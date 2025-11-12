import React, { useState, useEffect } from 'react';
import { RoleplayBattleData, Language, FluencyScore } from '../../types';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { getFluencyScore } from '../../services/geminiService';

interface RoleplayBattleGameProps {
    gameData: RoleplayBattleData;
    language: Language;
    onComplete: (averageScore: number) => void;
    onExit: () => void;
}

const ScoreDisplay: React.FC<{ label: string; score: number }> = ({ label, score }) => (
    <div className="flex flex-col items-center">
        <div className="relative w-24 h-24">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle className="text-slate-200" strokeWidth="8" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                <circle
                    className="text-sky-500 transition-all duration-1000 ease-out"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                    style={{ strokeDasharray: 2 * Math.PI * 45, strokeDashoffset: (2 * Math.PI * 45) - (score / 100) * (2 * Math.PI * 45) }}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-slate-800">{score}</div>
        </div>
        <p className="mt-2 text-sm font-semibold text-slate-600">{label}</p>
    </div>
);


const RoleplayBattleGame: React.FC<RoleplayBattleGameProps> = ({ gameData, language, onComplete, onExit }) => {
    const [results, setResults] = useState<FluencyScore | null>(null);
    const [isChecking, setIsChecking] = useState(false);
    const { transcript, isListening, startListening, stopListening, clearTranscript } = useSpeechRecognition();

    useEffect(() => {
        if (!isListening && transcript && !isChecking && !results) {
            checkFluency();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isListening, transcript]);

    const handleListenToggle = () => {
        if (isListening) {
            stopListening();
        } else {
            clearTranscript();
            startListening(language.speechLang);
        }
    };

    const checkFluency = async () => {
        if (!transcript) return;
        setIsChecking(true);
        const result = await getFluencyScore(gameData.prompt, transcript, language);
        setResults(result);
        setIsChecking(false);
    };
    
    const handleFinish = () => {
        if (!results) {
            onComplete(0);
            return;
        }
        const avgScore = Math.round((results.pronunciation + results.fluency + results.vocabulary) / 3);
        onComplete(avgScore);
    };

    const badgeIcon = (badge: string) => {
        if (badge.toLowerCase().includes('fluent')) return '🥈';
        if (badge.toLowerCase().includes('virtuoso')) return '🥇';
        if (badge.toLowerCase().includes('clear')) return '🥉';
        return '🌍';
    };

    return (
        <div className="max-w-3xl mx-auto w-full bg-white border border-slate-200 p-8 rounded-2xl shadow-lg flex flex-col space-y-6">
            <div className="flex justify-between items-start">
                 <h2 className="text-2xl font-bold text-slate-900">Roleplay Battle</h2>
                 <button onClick={onExit} className="text-slate-400 hover:text-slate-800 text-2xl">&times;</button>
            </div>

            <div className="p-4 bg-slate-100 rounded-lg">
                <p className="text-sm font-semibold text-sky-700">Scenario:</p>
                <p className="text-slate-800 mt-1 italic">A {gameData.character} says to you: "{gameData.prompt}"</p>
                <p className="text-sm font-semibold text-sky-700 mt-4">Your Task:</p>
                <p className="text-slate-800 mt-1">Press the button and respond naturally in {language.name}.</p>
            </div>
            
             <div className="flex items-center justify-center">
                <button
                    onClick={handleListenToggle}
                    disabled={isChecking || !!results}
                    className="relative w-28 h-28 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-105 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isListening && <div className="absolute inset-0 bg-red-600 rounded-full animate-ping"></div>}
                    <div className={`absolute inset-0 rounded-full ${isListening ? 'bg-red-600' : 'bg-sky-600'}`}></div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="relative z-10 h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                </button>
            </div>
             <p className="text-center text-slate-500 italic min-h-[2rem]">"{transcript || "..."}"</p>

            <div className="min-h-[200px] bg-slate-50 p-4 rounded-lg flex items-center justify-center">
                {isChecking ? (
                    <p className="text-slate-500">Analyzing your performance...</p>
                ) : results ? (
                    <div className="w-full flex flex-col items-center space-y-4">
                        <div className="flex justify-around w-full">
                            <ScoreDisplay label="Pronunciation" score={results.pronunciation} />
                            <ScoreDisplay label="Fluency" score={results.fluency} />
                            <ScoreDisplay label="Vocabulary" score={results.vocabulary} />
                        </div>
                        <div className="text-center bg-white p-3 rounded-lg w-full border border-slate-200">
                             <p className="text-slate-600">{results.feedback}</p>
                             <p className="font-bold text-sky-700 mt-2">Badge Unlocked: {results.badge} {badgeIcon(results.badge)}</p>
                        </div>
                        <button onClick={handleFinish} className="px-8 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500">
                           Finish
                        </button>
                    </div>
                ) : (
                    <p className="text-center text-slate-500">Your results will appear here after you speak.</p>
                )}
            </div>
        </div>
    );
};

export default RoleplayBattleGame;