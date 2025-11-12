

import React, { useState } from 'react';
import { SpeakTheWordData, Language } from '../../types';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { getPronunciationScore } from '../../services/geminiService';

interface SpeakTheWordGameProps {
    gameData: SpeakTheWordData;
    language: Language;
    onComplete: (averageScore: number) => void;
    onExit: () => void;
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

const SpeakTheWordGame: React.FC<SpeakTheWordGameProps> = ({ gameData, language, onComplete, onExit }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [results, setResults] = useState<{ phrase: string, score: number, feedback: string }[]>([]);
    const [currentFeedback, setCurrentFeedback] = useState<{ score: number, feedback: string } | null>(null);
    const [isChecking, setIsChecking] = useState(false);
    
    const { transcript, isListening, startListening, stopListening, clearTranscript } = useSpeechRecognition();

    const isGameFinished = currentIndex >= gameData.phrases.length;
    const currentPhrase = gameData.phrases[currentIndex];
    
    const handleListenToggle = () => {
        if (isListening) {
            stopListening();
        } else {
            setCurrentFeedback(null);
            clearTranscript();
            startListening(language.speechLang);
        }
    };
    
    const checkPronunciation = async () => {
        if (!transcript) return;
        setIsChecking(true);
        const result = await getPronunciationScore(currentPhrase, transcript, language);
        setCurrentFeedback(result);
        setResults(prev => [...prev, { phrase: currentPhrase, ...result }]);
        setIsChecking(false);
    };

    React.useEffect(() => {
        if (!isListening && transcript && !isChecking && !currentFeedback) {
            checkPronunciation();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isListening, transcript]);
    
    const handleNext = () => {
        setCurrentFeedback(null);
        clearTranscript();
        setCurrentIndex(prev => prev + 1);
    };

    if (isGameFinished) {
        const totalScore = results.reduce((sum, result) => sum + result.score, 0);
        const averageScore = results.length > 0 ? Math.round(totalScore / results.length) : 0;
        return (
             <div className="max-w-3xl mx-auto w-full bg-white border border-slate-200 p-8 rounded-2xl shadow-lg flex flex-col items-center text-center space-y-6">
                <div className="w-24 h-24 rounded-full bg-sky-600 flex items-center justify-center text-3xl font-bold text-white ring-4 ring-sky-500/30">
                    {averageScore}%
                </div>
                <h2 className="text-3xl font-bold text-slate-900">Great Job!</h2>
                <p className="text-slate-600">You completed the pronunciation practice with an average score of {averageScore}%.</p>
                <button 
                    onClick={() => onComplete(averageScore)}
                    className="w-full max-w-xs bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-bold py-3 px-4 rounded-lg"
                >
                    Back to Lesson
                </button>
            </div>
        );
    }
    
    return (
        <div className="max-w-3xl mx-auto w-full bg-white border border-slate-200 p-8 rounded-2xl shadow-lg flex flex-col space-y-8">
            <div className="flex justify-between items-start">
                 <h2 className="text-2xl font-bold text-slate-900">Speak the Word</h2>
                 <button onClick={onExit} className="text-slate-400 hover:text-slate-800 text-2xl">&times;</button>
            </div>

            <div className="text-center">
                <p className="text-slate-500 mb-2">Press the button and say:</p>
                <p className="text-3xl font-bold text-slate-900 p-4 bg-slate-100 rounded-lg">{currentPhrase}</p>
            </div>
            
            <div className="flex items-center justify-center">
                <button
                    onClick={handleListenToggle}
                    disabled={isChecking}
                    className="relative w-28 h-28 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-4 focus-visible:ring-offset-white focus-visible:ring-sky-500/50 disabled:cursor-not-allowed"
                >
                    {isListening ? (
                         <div className="absolute inset-0 bg-red-600 rounded-full animate-ping"></div>
                    ) : (
                         <div className="absolute inset-0 bg-sky-600/50 rounded-full animate-pulse-slow"></div>
                    )}
                     <div className={`absolute inset-0 rounded-full ${isListening ? 'bg-red-600' : 'bg-sky-600'}`}></div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="relative z-10 h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                </button>
            </div>
            
            <div className="min-h-[150px] bg-slate-50 p-4 rounded-lg flex items-center justify-center">
                {isChecking ? (
                    <div className="text-center text-slate-500">Checking...</div>
                ) : currentFeedback ? (
                    <div className="text-center w-full flex flex-col items-center">
                        <ScoreDonut score={currentFeedback.score} />
                        <p className="text-slate-600 mt-4 mb-4 max-w-md">{currentFeedback.feedback}</p>
                        <button onClick={handleNext} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500">
                           Next
                        </button>
                    </div>
                ) : (
                    <div className="text-center text-slate-500">
                        <p>Your attempt: <span className="text-slate-600 italic">{transcript || "..."}</span></p>
                        <p className="text-xs mt-2">Press the mic, speak, and release to check your pronunciation.</p>
                    </div>
                )}
            </div>

            <div className="text-center text-slate-500">
                Phrase {currentIndex + 1} of {gameData.phrases.length}
            </div>
        </div>
    );
};

export default SpeakTheWordGame;