

import React, { useState, useRef } from 'react';
import { Language, HandwritingEvaluation } from '../types';
import { getGrammarFeedback, evaluateHandwriting } from '../services/geminiService';
import { marked } from 'marked';
import VirtualKeyboard from './VirtualKeyboard';
import HandwritingCanvas from './HandwritingCanvas';
import HandwritingFeedback from './HandwritingFeedback';


interface GrammarCheckProps {
    language: Language;
}

type WritingMode = 'grammar' | 'handwriting';

const GrammarCheck: React.FC<GrammarCheckProps> = ({ language }) => {
    // Shared state
    const [mode, setMode] = useState<WritingMode>('grammar');
    const [isLoading, setIsLoading] = useState(false);
    
    // Grammar Check state
    const [text, setText] = useState('');
    const [grammarFeedback, setGrammarFeedback] = useState('');
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    // Handwriting Practice state
    const [expectedCharacter, setExpectedCharacter] = useState('');
    const [evaluation, setEvaluation] = useState<HandwritingEvaluation | null>(null);
    const [hasDrawing, setHasDrawing] = useState(false);
    const [isHandwritingKeyboardVisible, setIsHandwritingKeyboardVisible] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);


    const handleCheckGrammar = async () => {
        if (!text.trim()) return;
        setIsLoading(true);
        setGrammarFeedback('');
        const fb = await getGrammarFeedback(text, language);
        setGrammarFeedback(fb);
        setIsLoading(false);
    };
    
    const handleEvaluateHandwriting = async () => {
        const sourceCanvas = canvasRef.current;
        if (!sourceCanvas || !expectedCharacter.trim() || !hasDrawing) {
            return;
        }
        setIsLoading(true);
        setEvaluation(null);

        const sourceCtx = sourceCanvas.getContext('2d');
        if (!sourceCtx) {
             console.error("Could not get source canvas context");
             setIsLoading(false);
             return;
        }

        // Create a high-contrast, black-on-white version of the drawing for the AI
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = sourceCanvas.width;
        exportCanvas.height = sourceCanvas.height;
        const exportCtx = exportCanvas.getContext('2d');
        
        if (exportCtx) {
            const originalImageData = sourceCtx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
            const originalData = originalImageData.data;
            const processedImageData = exportCtx.createImageData(sourceCanvas.width, sourceCanvas.height);
            const processedData = processedImageData.data;

            for (let i = 0; i < originalData.length; i += 4) {
                // Check the alpha channel of the original drawing
                const alpha = originalData[i + 3];

                if (alpha > 20) { // If the pixel has been drawn on (is not transparent)
                    processedData[i] = 0;     // R: black
                    processedData[i + 1] = 0; // G: black
                    processedData[i + 2] = 0; // B: black
                    processedData[i + 3] = 255; // Alpha: fully opaque
                } else { // If the pixel is part of the background
                    processedData[i] = 255;   // R: white
                    processedData[i + 1] = 255; // G: white
                    processedData[i + 2] = 255; // B: white
                    processedData[i + 3] = 255; // Alpha: fully opaque
                }
            }
            exportCtx.putImageData(processedImageData, 0, 0);
            const imageDataUrl = exportCanvas.toDataURL('image/png');
            
            const result = await evaluateHandwriting(language, expectedCharacter, imageDataUrl);
            setEvaluation(result);
        }
        
        setIsLoading(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (canvas && context) {
            const scale = window.devicePixelRatio || 1;
            context.clearRect(0, 0, canvas.width / scale, canvas.height / scale);
            setHasDrawing(false);
            setEvaluation(null);
        }
    };
    
    const parsedFeedback = () => {
        if (!grammarFeedback) return null;
        const html = marked.parse(grammarFeedback) as string;
        return { __html: html };
    };

    const handleKeyPress = (char: string) => {
        const textarea = textareaRef.current;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newText = text.substring(0, start) + char + text.substring(end);
            setText(newText);
            // Move cursor after the inserted character
            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = start + char.length;
                textarea.focus();
            }, 0);
        } else {
             setText(prev => prev + char);
        }
    };

    const handleBackspace = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            if (start === end && start > 0) {
                 const newText = text.substring(0, start - 1) + text.substring(end);
                 setText(newText);
                 setTimeout(() => {
                    textarea.selectionStart = textarea.selectionEnd = start - 1;
                    textarea.focus();
                }, 0);
            } else if (start !== end) {
                 const newText = text.substring(0, start) + text.substring(end);
                 setText(newText);
                  setTimeout(() => {
                    textarea.selectionStart = textarea.selectionEnd = start;
                    textarea.focus();
                }, 0);
            }
        } else {
            setText(prev => prev.slice(0, -1));
        }
    };
    
    const handleModeChange = (newMode: WritingMode) => {
        setMode(newMode);
        setIsKeyboardVisible(false);
        setIsHandwritingKeyboardVisible(newMode === 'handwriting');
    };

    const renderModeToggle = () => (
        <div className="flex justify-center mb-8 bg-slate-200 p-1.5 rounded-full border border-slate-300 w-fit mx-auto">
            <button 
                onClick={() => handleModeChange('grammar')}
                className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors ${mode === 'grammar' ? 'bg-white shadow-sm text-sky-700' : 'text-slate-600 hover:bg-white/50'}`}
            >
                Grammar Checker
            </button>
            <button 
                onClick={() => handleModeChange('handwriting')}
                className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors ${mode === 'handwriting' ? 'bg-white shadow-sm text-sky-700' : 'text-slate-600 hover:bg-white/50'}`}
            >
                Handwriting Practice
            </button>
        </div>
    );

    const renderGrammarChecker = () => (
        <>
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-lg">
                 <div className="flex justify-between items-center mb-2">
                    <label htmlFor="text-input" className="block text-sm font-medium text-sky-600">
                        Enter text in {language.name} to check its grammar:
                    </label>
                    <button
                        onClick={() => setIsKeyboardVisible(!isKeyboardVisible)}
                        className={`p-2 rounded-md transition-colors ${isKeyboardVisible ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                        title="Toggle virtual keyboard"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </button>
                </div>
                <textarea
                    id="text-input"
                    ref={textareaRef}
                    rows={6}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={`Type or paste your ${language.name} text here...`}
                    className="w-full bg-slate-100 text-slate-800 rounded-md p-3 focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
                />

                {isKeyboardVisible && (
                    <VirtualKeyboard
                        language={language}
                        onKeyPress={handleKeyPress}
                        onBackspace={handleBackspace}
                    />
                )}
                
                <button
                    onClick={handleCheckGrammar}
                    disabled={isLoading || !text.trim()}
                    className="mt-4 w-full bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-bold py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-sky-500 transition-colors duration-200 disabled:bg-slate-300 disabled:from-slate-300 disabled:to-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed flex items-center justify-center"
                >
                   {isLoading ? 'Checking...' : 'Check Grammar'}
                </button>
            </div>
            
            {(grammarFeedback || (isLoading && !grammarFeedback)) && (
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-lg mt-6">
                     <h3 className="text-lg font-semibold text-slate-900 mb-3">Feedback & Suggestions</h3>
                     {isLoading && !grammarFeedback ? (
                        <p className="text-slate-500">Analyzing your text...</p>
                     ) : (
                        <div 
                            className="prose prose-p:text-slate-600 prose-strong:text-slate-800 prose-ul:list-disc prose-li:text-slate-600"
                            dangerouslySetInnerHTML={parsedFeedback()}
                        />
                     )}
                </div>
            )}
        </>
    );
    
    const renderHandwritingPractice = () => (
        <>
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-lg">
                 <div className="flex justify-between items-center mb-2">
                    <label htmlFor="character-input" className="block text-sm font-medium text-sky-600">
                        Character to Practice
                    </label>
                    <button
                        onClick={() => setIsHandwritingKeyboardVisible(!isHandwritingKeyboardVisible)}
                        className={`p-2 rounded-md transition-colors ${isHandwritingKeyboardVisible ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                        title="Toggle virtual keyboard"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </button>
                </div>
                <input
                    id="character-input"
                    type="text"
                    value={expectedCharacter}
                    onChange={(e) => setExpectedCharacter(e.target.value)}
                    placeholder={`e.g., ಅ, क, or a word`}
                    className="w-full bg-slate-100 text-slate-800 rounded-md p-3 focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
                />
                 <p className="text-xs text-slate-500 my-2">Type the character or word you want to practice. Then, write it on the pad below.</p>
                 
                 {isHandwritingKeyboardVisible && (
                    <div className="mb-4">
                        <VirtualKeyboard
                            language={language}
                            onKeyPress={(char) => setExpectedCharacter(prev => prev + char)}
                            onBackspace={() => setExpectedCharacter(prev => prev.slice(0, -1))}
                        />
                    </div>
                 )}
                <HandwritingCanvas canvasRef={canvasRef} onDrawingChange={setHasDrawing} />
                <div className="flex items-center justify-between mt-4">
                     <button onClick={clearCanvas} className="px-4 py-2 text-sm font-semibold bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors text-slate-800">
                        Clear
                    </button>
                    <button
                        onClick={handleEvaluateHandwriting}
                        disabled={isLoading || !hasDrawing || !expectedCharacter.trim()}
                        className="px-6 py-2.5 text-white font-bold rounded-lg bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-sky-500 transition-colors duration-200 disabled:bg-slate-300 disabled:from-slate-300 disabled:to-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                         {isLoading ? 'Evaluating...' : 'Evaluate Writing'}
                    </button>
                </div>
            </div>
             {(evaluation || (isLoading && !evaluation)) && (
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-lg mt-6">
                     <h3 className="text-lg font-semibold text-slate-900 mb-4">AI Writing Coach Feedback</h3>
                     {isLoading && !evaluation ? (
                        <p className="text-slate-500">Our AI coach is analyzing your handwriting...</p>
                     ) : evaluation ? (
                        <HandwritingFeedback feedback={evaluation} />
                     ) : (
                         <p className="text-red-500">Sorry, the evaluation failed. Please try again.</p>
                     )}
                </div>
            )}
        </>
    );

    return (
        <div className="max-w-4xl mx-auto w-full flex flex-col space-y-0">
            {renderModeToggle()}
            {mode === 'grammar' ? renderGrammarChecker() : renderHandwritingPractice()}
        </div>
    );
};

export default GrammarCheck;