import React from 'react';
import { ProficiencyLevel } from '../types';

interface LevelUpModalProps {
    newLevel: ProficiencyLevel;
    onClose: () => void;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ newLevel, onClose }) => {
    const levelName = newLevel.charAt(0).toUpperCase() + newLevel.slice(1).toLowerCase();

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up">
            <div 
                className="bg-white border border-sky-200 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center transform transition-all duration-300 relative overflow-hidden"
            >
                {/* Background glow */}
                <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-r from-sky-500 via-cyan-500 to-pink-500 opacity-10 animate-[spin_10s_linear_infinite]"></div>

                <div className="relative z-10">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center ring-4 ring-sky-500/20 animate-pulse-glow">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 11l7-7 7 7M5 19l7-7 7 7" />
                        </svg>
                    </div>

                    <h2 className="text-3xl font-extrabold text-slate-900 mb-2">LEVEL UP!</h2>
                    <p className="text-slate-700 mb-6">
                        Congratulations! You've reached the <span className="font-bold text-sky-600">{levelName}</span> level.
                    </p>
                    <p className="text-slate-500 text-sm mb-8">
                        New challenges and more advanced lessons are now available to you. Keep up the great work!
                    </p>
                    
                    <button
                        onClick={onClose}
                        className="w-full bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-sky-500 transition-all duration-200"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LevelUpModal;