

import React, { useState, useEffect, useRef } from 'react';
import { ListenMatchData, Language } from '../../types';
import { generateSpeech } from '../../services/geminiService';
import { playAudio, resumeAudioContext } from '../../utils/audioUtils';

interface ListenMatchGameProps {
    gameData: ListenMatchData;
    language: Language;
    onComplete: (score: number) => void;
    onExit: () => void;
}

const ListenMatchGame: React.FC<ListenMatchGameProps> = ({ gameData, language, onComplete, onExit }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [isLoadingAudio, setIsLoadingAudio] = useState(true); // Start loading initially
    const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
    const [audioDataCache, setAudioDataCache] = useState<Record<string, string>>({});
    
    useEffect(() => {
        // Ensure audio context is ready on first interaction
        resumeAudioContext();
    }, []);

    const isGameFinished = currentQuestionIndex >= gameData.questions.length;
    const currentQuestion = gameData.questions[currentQuestionIndex];

    const playAudioFromCacheOrFetch = async (text: string, speed: number) => {
        if (!text) {
            console.error("Audio playback failed: No text provided.");
            setIsLoadingAudio(false);
            return;
        }
        
        setIsLoadingAudio(true);
        const cacheKey = text;
        try {
            let audioData = audioDataCache[cacheKey];
            if (!audioData) {
                audioData = await generateSpeech(text, language);
                if (audioData) {
                    setAudioDataCache(prev => ({ ...prev, [cacheKey]: audioData! }));
                }
            }
            if (audioData) {
                await playAudio(audioData, undefined, speed);
            } else {
                 console.error("Failed to fetch or find audio data for:", text);
            }
        } catch (error) {
            console.error("Error during audio playback:", error);
        } finally {
            setIsLoadingAudio(false);
        }
    };

    // Auto-play audio when the question changes or speed is adjusted
    useEffect(() => {
        if (currentQuestion) {
            const timer = setTimeout(() => {
                playAudioFromCacheOrFetch(currentQuestion.audioText, playbackSpeed);
            }, 300); // Small delay for transition
            return () => clearTimeout(timer);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentQuestion, playbackSpeed]);
    
    // Preload audio for the next question
    useEffect(() => {
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < gameData.questions.length) {
            const nextQuestion = gameData.questions[nextIndex];
            const textToPreload = nextQuestion.audioText;
            const cacheKey = textToPreload;
            if (!audioDataCache[cacheKey]) {
                generateSpeech(textToPreload, language).then(audioData => {
                    if (audioData) {
                         setAudioDataCache(prev => ({ ...prev, [cacheKey]: audioData }));
                    }
                });
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentQuestionIndex]);


    const handleAnswerSelect = (answer: string) => {
        if (selectedAnswer) return; // Prevent changing answer

        setSelectedAnswer(answer);
        const correct = answer === currentQuestion.correctAnswer;
        setIsCorrect(correct);
        if (correct) {
            setScore(prev => prev + 1);
        }
        
        setTimeout(() => {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setIsCorrect(null);
        }, 1500);
    };

    if (isGameFinished) {
        const finalScore = Math.round((score / gameData.questions.length) * 100);
        return (
             <div className="max-w-3xl mx-auto w-full bg-white border border-slate-200 p-8 rounded-2xl shadow-lg flex flex-col items-center text-center space-y-6">
                <div className="w-24 h-24 rounded-full bg-sky-600 flex items-center justify-center text-3xl font-bold text-white ring-4 ring-sky-500/30">
                    {finalScore}%
                </div>
                <h2 className="text-3xl font-bold text-slate-900">Quiz Complete!</h2>
                <p className="text-slate-600">You correctly answered {score} out of {gameData.questions.length} questions.</p>
                <button 
                    onClick={() => onComplete(finalScore)}
                    className="w-full max-w-xs bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-bold py-3 px-4 rounded-lg"
                >
                    Back to Lesson
                </button>
            </div>
        );
    }
    
    const progressPercent = (currentQuestionIndex / gameData.questions.length) * 100;

    return (
        <div className="max-w-3xl mx-auto w-full bg-white border border-slate-200 p-8 rounded-2xl shadow-lg flex flex-col space-y-8">
            <div className="flex justify-between items-start">
                 <div>
                    <h2 className="text-2xl font-bold text-slate-900">Listen & Match</h2>
                    <p className="text-slate-500 mt-1">Question {currentQuestionIndex + 1} of {gameData.questions.length}</p>
                </div>
                 <button onClick={onExit} className="text-slate-400 hover:text-slate-800 text-2xl font-bold">&times;</button>
            </div>
            
            <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div className="bg-sky-600 h-2.5 rounded-full transition-all duration-500" style={{width: `${progressPercent}%`}}></div>
            </div>

            <div className="text-center">
                <p className="text-slate-500 mb-2">Listen to the audio and choose the correct meaning.</p>
                <div className="flex items-center justify-center space-x-2 mb-4">
                    <span className="text-sm font-semibold text-slate-500">Speed:</span>
                    {[0.75, 1.0, 1.25, 1.5].map(speed => (
                        <button
                            key={speed}
                            onClick={() => setPlaybackSpeed(speed)}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                                playbackSpeed === speed
                                    ? 'bg-sky-600 text-white'
                                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                        >
                            {speed}x
                        </button>
                    ))}
                </div>
                <button 
                    onClick={() => playAudioFromCacheOrFetch(currentQuestion.audioText, playbackSpeed)} 
                    disabled={isLoadingAudio}
                    className="w-24 h-24 bg-sky-600 rounded-full flex items-center justify-center text-white hover:bg-sky-500 transition-all duration-300 disabled:bg-slate-300 disabled:scale-100 transform hover:scale-105"
                >
                    {isLoadingAudio ? (
                        <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg>
                    )}
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map(option => (
                    <button 
                        key={option}
                        onClick={() => handleAnswerSelect(option)}
                        disabled={!!selectedAnswer}
                        className={`p-4 rounded-lg text-left transition-all duration-300 transform hover:scale-105 border-2 relative ${
                            selectedAnswer
                                ? (option === currentQuestion.correctAnswer ? 'bg-green-100 border-green-400' : (option === selectedAnswer ? 'bg-red-100 border-red-400' : 'bg-slate-100 border-slate-200 opacity-50'))
                                : 'bg-white border-slate-300 hover:border-sky-500'
                        }`}
                    >
                        <span className="font-semibold text-slate-800">{option}</span>
                        {selectedAnswer && (
                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center">
                                {option === currentQuestion.correctAnswer ? (
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                ) : (
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                )}
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};
export default ListenMatchGame;
