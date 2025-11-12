

import React, { useState, useEffect, useRef } from 'react';
import type { Chat } from '@google/genai';
import { Language, ChatMessage } from '../types';
import { createChat, generateSpeech } from '../services/geminiService';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { playAudio, resumeAudioContext } from '../utils/audioUtils';

interface ChatbotProps {
    language: Language;
}

const Chatbot: React.FC<ChatbotProps> = ({ language }) => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { transcript, isListening, startListening, stopListening, clearTranscript } = useSpeechRecognition();
    
    const chatContainerRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
        resumeAudioContext();
    }, []);

    useEffect(() => {
        setIsLoading(true);
        setChat(createChat(language));
        setMessages([
            {
                role: 'model',
                text: `Hi! I'm LingoGuide. I can help you practice ${language.name} and also explain how this AI-powered app works. What would you like to know?`
            }
        ]);
        setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language]);

    useEffect(() => {
        if (transcript) {
            setUserInput(transcript);
        }
    }, [transcript]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);
    
    const handleSendMessage = async () => {
        if (!userInput.trim() || !chat || isLoading) return;
        
        const userMessage: ChatMessage = { role: 'user', text: userInput };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        clearTranscript();
        setIsLoading(true);

        try {
            const response = await chat.sendMessage({ message: userInput });
            const modelMessage: ChatMessage = { role: 'model', text: response.text };
            setMessages(prev => [...prev, modelMessage]);
            
            const audioData = await generateSpeech(response.text, language);
            if (audioData) {
                await resumeAudioContext();
                await playAudio(audioData);
            }

        } catch (error) {
            let errorText = "Sorry, I encountered an error. Please try again.";
            if (error instanceof Error && error.message.toLowerCase().includes('quota')) {
                errorText = "The AI is currently busy due to high demand. Please try again in a few moments.";
            }
            console.error("Chat error:", error);
            const errorMessage: ChatMessage = { role: 'model', text: errorText };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const toggleListen = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening(language.speechLang);
        }
    };

    return (
        <div className="max-w-3xl mx-auto w-full h-[75vh] flex flex-col bg-white border border-slate-200 rounded-2xl shadow-lg">
            <div ref={chatContainerRef} className="flex-grow p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end space-x-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && (
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h.5a1.5 1.5 0 011.5 1.5v1.5a1.5 1.5 0 01-1.5 1.5h-3A1.5 1.5 0 0110 8V3.5z" />
                                    <path d="M4 6.5A1.5 1.5 0 015.5 5h1A1.5 1.5 0 018 6.5v3A1.5 1.5 0 016.5 11h-1A1.5 1.5 0 014 9.5v-3z" />
                                    <path d="M10.002 11.493a1.5 1.5 0 010 2.992A1.5 1.5 0 0110 16a1.5 1.5 0 01-1.492-1.005h-.006a1.5 1.5 0 010-2.992A1.5 1.5 0 0110 13a1.5 1.5 0 011.005 1.493h-.006a1.5 1.5 0 010-2.992zM15 11.5a1.5 1.5 0 011.5-1.5h.5a1.5 1.5 0 011.5 1.5v1.5a1.5 1.5 0 01-1.5 1.5h-.5a1.5 1.5 0 01-1.5-1.5v-1.5z" />
                                </svg>
                            </div>
                        )}
                        <div className={`max-w-xs md:max-w-md p-3 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-gradient-to-br from-sky-600 to-cyan-600 text-white rounded-br-none' : 'bg-slate-200 text-slate-800 rounded-bl-none'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start items-end space-x-3">
                         <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-600" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h.5a1.5 1.5 0 011.5 1.5v1.5a1.5 1.5 0 01-1.5 1.5h-3A1.5 1.5 0 0110 8V3.5z" />
                                <path d="M4 6.5A1.5 1.5 0 015.5 5h1A1.5 1.5 0 018 6.5v3A1.5 1.5 0 016.5 11h-1A1.5 1.5 0 014 9.5v-3z" />
                                <path d="M10.002 11.493a1.5 1.5 0 010 2.992A1.5 1.5 0 0110 16a1.5 1.5 0 01-1.492-1.005h-.006a1.5 1.5 0 010-2.992A1.5 1.5 0 0110 13a1.5 1.5 0 011.005 1.493h-.006a1.5 1.5 0 010-2.992zM15 11.5a1.5 1.5 0 011.5-1.5h.5a1.5 1.5 0 011.5 1.5v1.5a1.5 1.5 0 01-1.5 1.5h-.5a1.5 1.5 0 01-1.5-1.5v-1.5z" />
                            </svg>
                        </div>
                         <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-slate-200 text-slate-800 rounded-bl-none flex items-center space-x-2">
                             <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                             <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                             <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></div>
                         </div>
                    </div>
                )}
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-200">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder={`Type or speak in ${language.name}...`}
                        className="flex-grow bg-white text-slate-800 rounded-full py-2.5 px-5 border border-slate-300 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                    />
                    <button onClick={toggleListen} className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${isListening ? 'bg-red-600 hover:bg-red-500' : 'bg-sky-600 hover:bg-sky-500'}`}>
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                         </svg>
                    </button>
                    <button onClick={handleSendMessage} disabled={isLoading || !userInput.trim()} className="w-11 h-11 rounded-full bg-gradient-to-r from-sky-600 to-cyan-600 flex items-center justify-center flex-shrink-0 disabled:from-slate-300 disabled:to-slate-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;