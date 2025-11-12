
import React, { useState, useEffect, useRef } from 'react';
import { Language, User } from '../types';
import { LANGUAGES } from '../constants';

interface HeaderProps {
    user: User;
    onLogout: () => void;
    selectedLanguage: Language;
    onLanguageChange: (language: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, selectedLanguage, onLanguageChange }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="bg-white/70 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-200 flex-shrink-0">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-end h-16">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <select
                                value={selectedLanguage.code}
                                onChange={(e) => {
                                    const newLang = LANGUAGES.find(lang => lang.code === e.target.value);
                                    if (newLang) onLanguageChange(newLang);
                                }}
                                className="appearance-none bg-white border border-slate-300 rounded-md py-2 pl-3 pr-10 text-sm leading-5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                            >
                                {LANGUAGES.map(lang => (
                                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <div className="relative" ref={dropdownRef}>
                            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-2 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
                                 <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                                     {user.username.charAt(0).toUpperCase()}
                                 </span>
                                 <span className="text-sm font-medium text-slate-700 hidden sm:inline pr-2">{user.username}</span>
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-20">
                                    <button
                                        onClick={() => { onLogout(); setIsDropdownOpen(false); }}
                                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;