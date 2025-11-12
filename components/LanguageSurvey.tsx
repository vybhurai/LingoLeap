

import React, { useState } from 'react';
import { ProficiencyLevel } from '../types';
import { LANGUAGES } from '../constants';
import * as userService from '../services/userService';

interface LanguageSurveyProps {
    username: string;
    onComplete: () => void;
}

const ProficiencyOption: React.FC<{
    label: string;
    value: ProficiencyLevel;
    langName: string;
    currentValue: ProficiencyLevel;
    onChange: () => void;
}> = ({ label, value, langName, currentValue, onChange }) => (
    <label className="flex items-center space-x-2 cursor-pointer text-sm text-slate-700">
        <input
            type="radio"
            name={`${langName}-proficiency`}
            value={value}
            checked={value === currentValue}
            onChange={onChange}
            className="hidden"
        />
        <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
            value === currentValue ? 'border-sky-600 bg-sky-600' : 'border-slate-300 bg-white'
        }`}>
            {value === currentValue && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
        </span>
        <span>{label}</span>
    </label>
);


const LanguageSurvey: React.FC<LanguageSurveyProps> = ({ username, onComplete }) => {
    const [proficiencySelection, setProficiencySelection] = useState<{ [key: string]: ProficiencyLevel }>(() => {
        const initialState: { [key: string]: ProficiencyLevel } = {};
        LANGUAGES.forEach(lang => {
            initialState[lang.code] = ProficiencyLevel.None;
        });
        return initialState;
    });

    const handleProficiencyChange = (langCode: string, level: ProficiencyLevel) => {
        setProficiencySelection(prev => ({ ...prev, [langCode]: level }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        userService.saveInitialProficiency(username, proficiencySelection);
        onComplete();
    };

    return (
        <div className="w-full max-w-lg bg-white border border-slate-200 p-8 rounded-2xl shadow-lg animate-fade-in-up">
            <div className="text-center mb-8">
                 <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    One Last Step!
                </h1>
                <p className="text-slate-500">Help us personalize your learning experience.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-4">
                    {LANGUAGES.map(lang => (
                        <div key={lang.code} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <p className="font-semibold text-slate-800 mb-3">{lang.name}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2">
                                <ProficiencyOption 
                                    label="No Knowledge" 
                                    value={ProficiencyLevel.None} 
                                    langName={lang.name}
                                    currentValue={proficiencySelection[lang.code]}
                                    onChange={() => handleProficiencyChange(lang.code, ProficiencyLevel.None)}
                                />
                                 <ProficiencyOption 
                                    label="Beginner" 
                                    value={ProficiencyLevel.Beginner} 
                                    langName={lang.name}
                                    currentValue={proficiencySelection[lang.code]}
                                    onChange={() => handleProficiencyChange(lang.code, ProficiencyLevel.Beginner)}
                                />
                                 <ProficiencyOption 
                                    label="Intermediate" 
                                    value={ProficiencyLevel.Intermediate} 
                                    langName={lang.name}
                                    currentValue={proficiencySelection[lang.code]}
                                    onChange={() => handleProficiencyChange(lang.code, ProficiencyLevel.Intermediate)}
                                />
                                 <ProficiencyOption 
                                    label="Advanced" 
                                    value={ProficiencyLevel.Advanced} 
                                    langName={lang.name}
                                    currentValue={proficiencySelection[lang.code]}
                                    onChange={() => handleProficiencyChange(lang.code, ProficiencyLevel.Advanced)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                 <div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-sky-500 transition-all duration-200"
                    >
                        Save & Continue
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LanguageSurvey;