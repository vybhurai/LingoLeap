

import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import { LANGUAGES } from '../constants';
import { translateText, generateSpeech } from '../services/geminiService';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { playAudio, resumeAudioContext } from '../utils/audioUtils';

interface TranslationToolProps {
    language: Language;
}

const TranslationTool: React.FC<TranslationToolProps> = ({ language }) => {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [sourceLang, setSourceLang] = useState('English');
    const [targetLang, setTargetLang] = useState(language.name);
    const [isLoading, setIsLoading] = useState(false);
    const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    
    const { transcript, isListening, startListening, stopListening } = useSpeechRecognition();

    useEffect(() => {
        resumeAudioContext();
    }, []);

    // Update target language if the global language selection changes
    useEffect(() => {
        if (sourceLang === 'English') {
            setTargetLang(language.name);
        } else { // If user has swapped, assume they want to translate from the new language
            setSourceLang(language.name);
        }
    }, [language, sourceLang]);

    // Set input text from speech recognition transcript
    useEffect(() => {
        if (transcript) {
            setInputText(transcript);
        }
    }, [transcript]);

    // Automatic translation on input change (debounced)
    useEffect(() => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        if (!inputText.trim()) {
            setOutputText('');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        debounceTimeout.current = setTimeout(async () => {
            if (inputText.trim()) {
                const result = await translateText(inputText, sourceLang, targetLang);
                setOutputText(result);
            }
            setIsLoading(false);
        }, 500); // 500ms delay after user stops typing

        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, [inputText, sourceLang, targetLang]);

    const handleSpeak = async (text: string, langName: string) => {
        if (!text) return;
        await resumeAudioContext();
        const langObj = LANGUAGES.find(l => l.name === langName);
        const audioData = await generateSpeech(text, langObj);
        if (audioData) {
            await playAudio(audioData);
        }
    };

    const handleSwapLanguages = () => {
        const temp = sourceLang;
        setSourceLang(targetLang);
        setTargetLang(temp);
        setInputText(outputText);
        setOutputText(inputText);
    };

    const getLangSpeechCode = (langName: string): string => {
        if (langName === 'English') return 'en-US';
        const foundLang = LANGUAGES.find(l => l.name === langName);
        return foundLang ? foundLang.speechLang : 'en-US';
    }

    return (
        <div className="max-w-4xl mx-auto w-full bg-white border border-slate-200 p-8 rounded-2xl shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 items-center">
                {/* Input Side */}
                <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-sky-600">{sourceLang}</span>
                        <button 
                            onClick={() => handleSpeak(inputText, sourceLang)} 
                            disabled={!inputText} 
                            className="flex items-center space-x-1.5 px-3 py-1 text-sm rounded-md transition-colors bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg>
                             <span>Listen</span>
                        </button>
                    </div>
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        rows={8}
                        className="w-full flex-grow bg-slate-50 text-slate-800 rounded-md p-3 border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none resize-none transition"
                        placeholder="Enter text..."
                    />
                    <div className="flex items-center justify-between mt-1">
                         <button onClick={() => {isListening ? stopListening() : startListening(getLangSpeechCode(sourceLang))}} className={`px-3 py-1 text-sm rounded-md transition-colors ${isListening ? 'bg-red-600 text-white' : 'bg-slate-600 hover:bg-slate-700 text-white'}`}>
                            {isListening ? 'Stop' : 'Speak'}
                        </button>
                        <span className="text-xs text-slate-500">{inputText.length} / 5000</span>
                    </div>
                </div>

                 {/* Swap Button */}
                 <div className="my-4 lg:my-0">
                        <button onClick={handleSwapLanguages} className="w-12 h-12 bg-white border border-slate-300 rounded-full flex items-center justify-center text-slate-500 hover:bg-sky-600 hover:text-white hover:border-sky-600 transition-all ring-4 ring-slate-50 transform lg:rotate-0 rotate-90">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                        </button>
                    </div>

                {/* Output Side */}
                 <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-sky-600">{targetLang}</span>
                         <button 
                            onClick={() => handleSpeak(outputText, targetLang)} 
                            disabled={!outputText} 
                            className="flex items-center space-x-1.5 px-3 py-1 text-sm rounded-md transition-colors bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg>
                            <span>Listen</span>
                        </button>
                    </div>
                    <div className="w-full flex-grow bg-slate-50 text-slate-800 rounded-md p-3 border border-slate-300 relative min-h-[216px]">
                         {isLoading && (
                            <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-md">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></div>
                                    <span className="text-slate-500 text-sm">Translating...</span>
                                </div>
                            </div>
                         )}
                         <p className="whitespace-pre-wrap">{outputText}</p>
                    </div>
                     <div className="flex items-center justify-between mt-1">
                        <button onClick={() => {isListening ? stopListening() : startListening(getLangSpeechCode(targetLang))}} className={`px-3 py-1 text-sm rounded-md transition-colors ${isListening ? 'bg-red-600 text-white' : 'bg-slate-600 hover:bg-slate-700 text-white'}`}>
                            {isListening ? 'Stop' : 'Speak'}
                        </button>
                        <button onClick={() => navigator.clipboard.writeText(outputText)} disabled={!outputText} className="px-3 py-1 text-sm rounded-md bg-slate-200 hover:bg-slate-300 text-slate-700 disabled:opacity-50">
                            Copy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TranslationTool;
