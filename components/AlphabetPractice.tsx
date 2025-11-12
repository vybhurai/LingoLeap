

import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { ALPHABET_DATA } from '../constants';
import { generateSpeech } from '../services/geminiService';
import { playAudio } from '../utils/audioUtils';

interface AlphabetPracticeProps {
    language: Language;
}

const AlphabetPractice: React.FC<AlphabetPracticeProps> = ({ language }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isSpeaking, setIsSpeaking] = useState(false);
    
    const alphabet = ALPHABET_DATA[language.code] || [];
    const currentCharacter = alphabet[currentIndex];

    useEffect(() => {
        setCurrentIndex(0);
    }, [language]);

    const handleNext = () => {
        setCurrentIndex(prev => (prev + 1) % alphabet.length);
    };

    const handlePrev = () => {
        setCurrentIndex(prev => (prev - 1 + alphabet.length) % alphabet.length);
    };

    const handleSpeak = async () => {
        if (isSpeaking || !currentCharacter) return;
        setIsSpeaking(true);
        const audioData = await generateSpeech(currentCharacter.sound, language);
        if (audioData) {
            await playAudio(audioData);
        }
        setIsSpeaking(false);
    };

    if (alphabet.length === 0) {
        return (
            <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md mx-auto w-full border border-slate-200">
                <p className="text-slate-700 font-semibold">Alphabet learning is not yet available for {language.name}.</p>
                <p className="text-slate-500 text-sm mt-2">Please check back later!</p>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto w-full bg-white border border-slate-200 p-8 rounded-2xl shadow-lg flex flex-col items-center space-y-8">
            {/* Flashcard */}
            <div className="w-full h-64 bg-slate-100 rounded-xl flex flex-col items-center justify-center relative border border-slate-200 transition-transform duration-300 transform hover:scale-105">
                <div className="text-9xl font-bold text-slate-900">{currentCharacter.character}</div>
                <div className="mt-4 text-3xl text-sky-600 font-semibold">{currentCharacter.transliteration}</div>
                <button 
                    onClick={handleSpeak}
                    disabled={isSpeaking}
                    className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center text-sky-600 hover:bg-sky-100 transition-colors disabled:opacity-50 shadow-sm border border-slate-200"
                    aria-label="Play sound"
                >
                    {isSpeaking ? (
                        <div className="w-5 h-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg>
                    )}
                </button>
            </div>

            {/* Navigation */}
            <div className="w-full flex items-center justify-between">
                <button onClick={handlePrev} className="flex items-center space-x-2 py-3 px-6 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    <span>Prev</span>
                </button>
                <span className="text-slate-500 font-medium tabular-nums">{currentIndex + 1} / {alphabet.length}</span>
                <button onClick={handleNext} className="flex items-center space-x-2 py-3 px-6 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition-colors">
                    <span>Next</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
            </div>
        </div>
    );
};

export default AlphabetPractice;
