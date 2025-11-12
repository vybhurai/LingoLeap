
import React from 'react';
import { KEYBOARD_LAYOUTS } from '../constants';
import { Language } from '../types';

interface VirtualKeyboardProps {
    language: Language;
    onKeyPress: (char: string) => void;
    onBackspace: () => void;
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ language, onKeyPress, onBackspace }) => {
    const layout = KEYBOARD_LAYOUTS[language.code];

    if (!layout) {
        return <div className="text-center text-slate-500 p-4 mt-4 bg-slate-100 rounded-lg">No virtual keyboard available for this language.</div>;
    }

    return (
        <div className="bg-slate-100 p-3 rounded-lg mt-4 select-none">
            {layout.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-1.5 mb-1.5 flex-wrap">
                    {row.split(' ').map((char) => (
                        <button
                            key={char}
                            onClick={() => onKeyPress(char)}
                            className="bg-white hover:bg-slate-200 text-slate-800 font-medium h-12 w-12 rounded-lg transition-colors flex items-center justify-center text-lg border border-slate-300 shadow-sm"
                        >
                            {char}
                        </button>
                    ))}
                </div>
            ))}
            <div className="flex justify-center gap-2 mt-3">
                 <button 
                    onClick={() => onKeyPress(' ')} 
                    className="bg-white hover:bg-slate-200 text-slate-800 font-semibold py-2 px-16 rounded-md transition-colors border border-slate-300 shadow-sm"
                >
                    Space
                </button>
                 <button 
                    onClick={onBackspace} 
                    className="bg-white hover:bg-slate-200 text-slate-800 font-semibold py-2 px-4 rounded-md transition-colors flex items-center justify-center border border-slate-300 shadow-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 002.828 0L21 12M3 12l6.414-6.414a2 2 0 012.828 0L21 12" />
                    </svg>
                    <span className="ml-2">Backspace</span>
                </button>
            </div>
        </div>
    );
};

export default VirtualKeyboard;