import React, { useState, useEffect } from 'react';

interface SentenceScrambleData {
    sentence: string;
}

interface SentenceScrambleGameProps {
    gameData: SentenceScrambleData;
    onComplete: (score: number) => void;
    onExit: () => void;
}

const SentenceScrambleGame: React.FC<SentenceScrambleGameProps> = ({ gameData, onComplete, onExit }) => {
    const [scrambledWords, setScrambledWords] = useState<string[]>([]);
    const [builtSentence, setBuiltSentence] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    useEffect(() => {
        const words = gameData.sentence.split(' ');
        setScrambledWords(words.sort(() => Math.random() - 0.5));
    }, [gameData.sentence]);

    const handleWordClick = (word: string, index: number) => {
        setBuiltSentence(prev => [...prev, word]);
        setScrambledWords(prev => prev.filter((_, i) => i !== index));
    };

    const handleBuiltWordClick = (word: string, index: number) => {
        setScrambledWords(prev => [...prev, word]);
        setBuiltSentence(prev => prev.filter((_, i) => i !== index));
    };

    const checkSentence = () => {
        const userSentence = builtSentence.join(' ');
        if (userSentence === gameData.sentence) {
            setFeedback('correct');
            setTimeout(() => onComplete(100), 1500);
        } else {
            setFeedback('incorrect');
            setTimeout(() => setFeedback(null), 800);
        }
    };
    
    const renderWordBank = (words: string[], onClick: (word: string, index: number) => void) => (
        <div className="flex flex-wrap justify-center gap-3 p-4 bg-slate-100 rounded-lg min-h-[5rem]">
            {words.map((word, index) => (
                <button
                    key={`${word}-${index}`}
                    onClick={() => onClick(word, index)}
                    className="px-4 py-2 bg-white border border-slate-300 rounded-lg shadow-sm text-lg font-semibold text-slate-700 hover:bg-sky-50 transition-transform transform hover:scale-105"
                >
                    {word}
                </button>
            ))}
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto w-full bg-white border border-slate-200 p-8 rounded-2xl shadow-lg flex flex-col space-y-6">
            <div className="flex justify-between items-start">
                 <h2 className="text-2xl font-bold text-slate-900">Sentence Scramble</h2>
                 <button onClick={onExit} className="text-slate-400 hover:text-slate-800 text-2xl">&times;</button>
            </div>
            
            <p className="text-center text-slate-600">Unscramble the words to form a correct sentence.</p>

            {/* Area for building the sentence */}
            <div className={`p-4 rounded-lg min-h-[5rem] border-2 ${feedback === 'incorrect' ? 'border-red-500 animate-shake' : 'border-slate-300'}`}>
                {renderWordBank(builtSentence, handleBuiltWordClick)}
            </div>

             {/* Area for word bank */}
            {renderWordBank(scrambledWords, handleWordClick)}

            <button
                onClick={checkSentence}
                disabled={scrambledWords.length > 0 || feedback === 'correct'}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 px-4 rounded-lg disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed"
            >
                {feedback === 'correct' ? 'Correct!' : 'Check Answer'}
            </button>
        </div>
    );
};

export default SentenceScrambleGame;