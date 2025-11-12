import React, { useState } from 'react';
import { WordHuntData } from '../../types';

interface WordHuntGameProps {
    gameData: WordHuntData;
    onComplete: () => void;
    onExit: () => void;
}

const WordHuntGame: React.FC<WordHuntGameProps> = ({ gameData, onComplete, onExit }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [foundWords, setFoundWords] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect', word: string } | null>(null);

    const isGameFinished = currentQuestionIndex >= gameData.questions.length;
    const currentQuestion = gameData.questions[currentQuestionIndex];

    const handleWordClick = (clickedWord: string) => {
        if (isGameFinished) return;

        const cleanedWord = clickedWord.replace(/[.,।?!]/g, '');

        if (cleanedWord === currentQuestion.word) {
            setFeedback({ type: 'correct', word: cleanedWord });
            setFoundWords(prev => [...prev, cleanedWord]);
            setTimeout(() => {
                setCurrentQuestionIndex(prev => prev + 1);
                setFeedback(null);
            }, 1000);
        } else {
            setFeedback({ type: 'incorrect', word: cleanedWord });
            setTimeout(() => setFeedback(null), 800);
        }
    };

    if (isGameFinished) {
        return (
            <div className="max-w-3xl mx-auto w-full bg-white border border-slate-200 p-8 rounded-2xl shadow-lg flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-3xl font-bold text-slate-900">Congratulations!</h2>
                <p className="text-slate-600">You've successfully completed the Word Hunt.</p>
                <button 
                    onClick={onComplete}
                    className="w-full max-w-xs bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-sky-500 transition-all duration-200"
                >
                    Back to Lessons
                </button>
            </div>
        );
    }
    
    return (
        <div className="max-w-3xl mx-auto w-full bg-white border border-slate-200 p-8 rounded-2xl shadow-lg flex flex-col space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">{gameData.title}</h2>
                    <p className="text-sky-600 font-semibold mt-2">{currentQuestion.definition}</p>
                </div>
                <button onClick={onExit} className="text-slate-400 hover:text-slate-800">&times;</button>
            </div>
            
            <div className="bg-slate-100 p-6 rounded-lg text-2xl leading-loose text-slate-700">
                {gameData.story.split(' ').map((word, index) => {
                    const cleanedWord = word.replace(/[.,।?!]/g, '');
                    const isFound = foundWords.includes(cleanedWord);
                    const isCorrectFeedback = feedback?.type === 'correct' && feedback.word === cleanedWord;
                    const isIncorrectFeedback = feedback?.type === 'incorrect' && feedback.word === cleanedWord;

                    const wordClasses = [
                        "cursor-pointer",
                        "transition-all",
                        "duration-300",
                        "px-1",
                        "rounded",
                        isFound ? "bg-green-500/20 text-green-700 cursor-default" : "hover:bg-slate-200",
                        isCorrectFeedback ? "bg-green-500 text-white" : "",
                        isIncorrectFeedback ? "bg-red-500 text-white animate-[shake_0.8s]" : ""
                    ].join(" ");
                    
                    return (
                        <span key={index} className={wordClasses} onClick={() => handleWordClick(word)}>
                            {word}{' '}
                        </span>
                    );
                })}
            </div>

            <div className="text-center text-slate-500">
                Progress: {currentQuestionIndex} / {gameData.questions.length} words found
            </div>
        </div>
    );
};

export default WordHuntGame;