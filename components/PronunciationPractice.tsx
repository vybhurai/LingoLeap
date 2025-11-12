

import React, { useState, useEffect } from 'react';
import { Language, ProficiencyLevel, Syllable } from '../types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { getPronunciationScore, getSyllableBreakdown, generateSpeech } from '../services/geminiService';
import { playAudio, resumeAudioContext } from '../utils/audioUtils';
import { PHRASES } from '../constants';

interface PronunciationPracticeProps {
    language: Language;
    proficiency: ProficiencyLevel;
}

const ScoreDonut: React.FC<{ score: number }> = ({ score }) => {
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative w-32 h-32 flex-shrink-0">
             <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle className="text-slate-200" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                <circle className="text-sky-500 transition-all duration-1000 ease-out" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" style={{ strokeDasharray: circumference, strokeDashoffset: offset }} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-slate-800">
                {score}<span className="text-xl font-semibold">%</span>
            </div>
        </div>
    );
};


const PronunciationPractice: React.FC<PronunciationPracticeProps> = ({ language, proficiency }) => {
    const [currentPhrase, setCurrentPhrase] = useState('');
    const [feedback, setFeedback] = useState<{ score: number, feedback: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { transcript, isListening, error, startListening, stopListening, clearTranscript } = useSpeechRecognition();

    const [syllables, setSyllables] = useState<Syllable[] | null>(null);
    const [isShowingHelp, setIsShowingHelp] = useState(false);
    const [isLoadingSyllables, setIsLoadingSyllables] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [audioCache, setAudioCache] = useState<Record<string, string>>({});
    const [loadingAudio, setLoadingAudio] = useState<Set<string>>(new Set());

    const setNewPhrase = () => {
        const level = proficiency === ProficiencyLevel.None ? ProficiencyLevel.Beginner : proficiency;
        const languagePhrases = PHRASES[language.code] || PHRASES['hi'];
        const phrasesForLevel = languagePhrases[level] || languagePhrases[ProficiencyLevel.Beginner] || [];
        const phrases = phrasesForLevel.length > 0 ? phrasesForLevel : languagePhrases[ProficiencyLevel.Beginner] || [];


        if (phrases.length > 0) {
            const newPhrase = phrases[Math.floor(Math.random() * phrases.length)];
            setCurrentPhrase(newPhrase);
        } else {
            setCurrentPhrase("No practice phrases available for this level yet.");
        }
    };
    
    useEffect(() => {
        resumeAudioContext();
    }, []);

    useEffect(() => {
        setNewPhrase();
        setFeedback(null);
        clearTranscript();
        setIsShowingHelp(false);
        setSyllables(null);
        setAudioCache({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language, proficiency]);
    
    // Pre-fetch audio for the current phrase
    useEffect(() => {
        if (currentPhrase && !audioCache[currentPhrase] && !loadingAudio.has(currentPhrase)) {
            setLoadingAudio(prev => new Set(prev).add(currentPhrase));
            generateSpeech(currentPhrase, language).then(audioData => {
                if (audioData) {
                    setAudioCache(prev => ({ ...prev, [currentPhrase]: audioData }));
                }
            }).finally(() => {
                 setLoadingAudio(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(currentPhrase);
                    return newSet;
                });
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPhrase]);

    const handleListen = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening(language.speechLang);
        }
    };

    const handleGetFeedback = async () => {
        if (!transcript) return;
        setIsLoading(true);
        setFeedback(null);
        const result = await getPronunciationScore(currentPhrase, transcript, language);
        setFeedback(result);
        setIsLoading(false);
    };
    
    const handleNext = () => {
        setNewPhrase();
        clearTranscript();
        setFeedback(null);
        setIsShowingHelp(false);
        setSyllables(null);
        setAudioCache({});
    };

    const handleShowHelp = async () => {
        if (!currentPhrase) return;
        setIsLoadingSyllables(true);
        const result = await getSyllableBreakdown(currentPhrase, language);
        if (result) {
            setSyllables(result);
            result.forEach(syl => {
                const syllableText = syl.syllable;
                if (!audioCache[syllableText] && !loadingAudio.has(syllableText)) {
                    setLoadingAudio(prev => new Set(prev).add(syllableText));
                    generateSpeech(syllableText, language).then(audioData => {
                        if (audioData) {
                            setAudioCache(prev => ({ ...prev, [syllableText]: audioData }));
                        }
                    }).finally(() => {
                        setLoadingAudio(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(syllableText);
                            return newSet;
                        });
                    });
                }
            });
        } else {
            setSyllables([{ syllable: "Sorry, couldn't break down the phrase.", transliteration: "Error" }]);
        }
        setIsShowingHelp(true);
        setIsLoadingSyllables(false);
    };

    const handleSpeak = async (textToSpeak: string) => {
        if (isSpeaking) return;

        await resumeAudioContext();

        setIsSpeaking(true);
        setLoadingAudio(prev => new Set(prev).add(textToSpeak));

        try {
            let audioData = audioCache[textToSpeak];
            if (!audioData) {
                audioData = await generateSpeech(textToSpeak, language);
                if (audioData) {
                    setAudioCache(prev => ({ ...prev, [textToSpeak]: audioData! }));
                }
            }
            
            if (audioData) {
                const playbackRate = textToSpeak === currentPhrase ? 1.0 : 0.85;
                await playAudio(audioData, undefined, playbackRate);
            }
        } catch (error) {
            console.error("Error playing audio:", error);
        } finally {
            setIsSpeaking(false);
            setLoadingAudio(prev => {
                const newSet = new Set(prev);
                newSet.delete(textToSpeak);
                return newSet;
            });
        }
    };
    
    const isAudioLoading = (text: string) => loadingAudio.has(text) && !audioCache[text];

    return (
        <div className="max-w-3xl mx-auto w-full bg-white border border-slate-200 p-8 rounded-2xl shadow-lg flex flex-col space-y-8">
            <div>
                <p className="text-sm font-medium text-sky-600 text-center">Phrase to practice:</p>
                <p className="text-3xl font-bold text-slate-900 mt-2 p-6 bg-slate-100 rounded-lg text-center">{currentPhrase}</p>
                
                 <div className="text-center mt-4 h-5">
                    {isLoadingSyllables ? (
                        <span className="text-sm text-slate-500">Breaking it down...</span>
                    ) : !isShowingHelp ? (
                        <button onClick={handleShowHelp} className="text-sm text-sky-600 hover:text-sky-500 underline transition-colors">
                            I don't know how to say this
                        </button>
                    ) : null}
                </div>

                {isShowingHelp && syllables && (
                    <div className="mt-4 p-4 bg-slate-100 rounded-lg animate-fade-in-up">
                        <div className="flex flex-wrap justify-center gap-2">
                            {syllables.map((syl, index) => (
                                <button 
                                    key={index} 
                                    onClick={() => handleSpeak(syl.syllable)}
                                    disabled={isSpeaking || isAudioLoading(syl.syllable) || syl.transliteration === 'Error'}
                                    className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center min-w-[60px] min-h-[60px]"
                                >
                                    {isAudioLoading(syl.syllable) ? (
                                        <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <span className="text-xl font-semibold">{syl.syllable}</span>
                                            {syl.transliteration !== 'Error' && <span className="text-xs text-sky-600 mt-1">{syl.transliteration}</span>}
                                        </>
                                    )}
                                </button>
                            ))}
                        </div>
                        <div className="text-center mt-3">
                             <button 
                                onClick={() => handleSpeak(currentPhrase)}
                                disabled={isSpeaking || isAudioLoading(currentPhrase)}
                                className="text-sm text-sky-600 hover:text-sky-500 underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mx-auto"
                            >
                               {isAudioLoading(currentPhrase) && <div className="w-3 h-3 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>}
                               <span>Play full phrase</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-center space-x-6">
                 <button onClick={handleNext} className="py-3 px-6 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">
                    Next Phrase
                </button>
                <button
                    onClick={handleListen}
                    className="relative w-28 h-28 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-4 focus-visible:ring-offset-white focus-visible:ring-sky-500/50"
                >
                    {isListening ? (
                        <>
                            <div className="absolute inset-0 bg-red-600 rounded-full"></div>
                            <div className="absolute inset-0 bg-red-500/70 rounded-full animate-ping"></div>
                            <div className="absolute inset-0 bg-red-500/50 rounded-full animate-ping [animation-delay:0.5s]"></div>
                            <div className="absolute inset-0 bg-red-500/30 rounded-full animate-ping [animation-delay:1s]"></div>
                        </>
                    ) : (
                         <>
                            <div className="absolute inset-0 bg-sky-600 rounded-full"></div>
                            <div className="absolute inset-0 bg-sky-600/50 rounded-full animate-pulse-slow"></div>
                        </>
                    )}
                    <svg xmlns="http://www.w3.org/2000/svg" className="relative z-10 h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                </button>
                <button onClick={handleGetFeedback} disabled={!transcript || isLoading} className="py-3 px-6 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold transition-colors disabled:from-slate-300 disabled:to-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500">
                    Get Feedback
                </button>
            </div>
            
            {error && <p className="text-red-500 text-center text-sm">{error}</p>}
            
            <div className="min-h-[70px]">
                <p className="text-sm font-medium text-sky-600">Your attempt:</p>
                <p className="text-xl text-slate-700 p-3 bg-slate-100 rounded-md mt-1 italic min-h-[48px]">
                    {transcript || "..."}
                </p>
            </div>
            
            <div className="min-h-[120px] bg-slate-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-sky-600 mb-2">AI Feedback:</p>
                {isLoading ? (
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></div>
                        <span className="text-slate-500 text-sm">Analyzing...</span>
                    </div>
                ) : feedback ? (
                    <div className="flex items-center justify-center space-x-6 text-left">
                        <ScoreDonut score={feedback.score} />
                        <p className="text-slate-700 whitespace-pre-wrap flex-1">{feedback.feedback}</p>
                    </div>
                ) : (
                    <p className="text-slate-600 whitespace-pre-wrap text-center">Record your attempt to get feedback.</p>
                )}
            </div>
        </div>
    );
};

export default PronunciationPractice;
