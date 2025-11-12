

import React from 'react';
import { ModuleType, Language, ProficiencyLevel, ProficiencyState, StreakData, User } from '../types';
import { MODULES, XP_THRESHOLDS } from '../constants';

interface DashboardProps {
    onSelectModule: (module: ModuleType | 'Translation') => void;
    language?: Language;
    proficiency?: ProficiencyState;
    streak?: StreakData;
    user?: User;
}

const ModuleCard: React.FC<{ module: typeof MODULES[0]; onSelect: () => void; }> = ({ module, onSelect }) => (
    <div 
        onClick={onSelect}
        className="group cursor-pointer bg-white border border-slate-200 rounded-xl shadow-sm hover:border-sky-300 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex flex-col p-6 text-left"
    >
        <div className="relative z-10 flex flex-col flex-grow">
            <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 text-sky-600 transition-transform duration-300 group-hover:scale-110" dangerouslySetInnerHTML={{ __html: module.icon }} />
                <h3 className="text-xl font-bold text-slate-900">{module.title}</h3>
            </div>
            <p className="text-slate-600 text-sm mb-4 flex-grow">{module.description}</p>
            <div className="flex flex-wrap gap-2 mt-auto">
                {module.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-sky-100 text-sky-700 text-xs font-semibold rounded-full">{tag}</span>
                ))}
            </div>
        </div>
    </div>
);

const ProficiencyVisual: React.FC<{ language: Language, proficiency: ProficiencyState }> = ({ language, proficiency }) => {
    const { level, xp } = proficiency;

    const levels = {
        [ProficiencyLevel.Beginner]: { name: 'Beginner', description: "You're starting your journey, focusing on greetings and basic phrases." },
        [ProficiencyLevel.Intermediate]: { name: 'Intermediate', description: "You're building on the basics, learning to form sentences and handle simple conversations." },
        [ProficiencyLevel.Advanced]: { name: 'Advanced', description: "You're working towards fluency, tackling complex sentences and nuanced topics." },
        [ProficiencyLevel.None]: { name: 'Beginner', description: "You're starting your journey, focusing on greetings and basic phrases." },
    };

    const currentLevelInfo = levels[level];
    
    const getProgressDetails = () => {
        if (level === ProficiencyLevel.Advanced) {
            return { progressPercent: 100, nextLevelXP: xp, currentLevelXP: XP_THRESHOLDS[ProficiencyLevel.Advanced] };
        }
        
        const currentLevelXP = XP_THRESHOLDS[level];
        const nextLevel = level === ProficiencyLevel.Beginner ? ProficiencyLevel.Intermediate : ProficiencyLevel.Advanced;
        const nextLevelXP = XP_THRESHOLDS[nextLevel];

        const xpInCurrentLevel = xp - currentLevelXP;
        const xpForNextLevel = nextLevelXP - currentLevelXP;
        
        const progressPercent = Math.max(0, Math.min(100, (xpInCurrentLevel / xpForNextLevel) * 100));

        return { progressPercent, nextLevelXP, currentLevelXP };
    };

    const { progressPercent, nextLevelXP } = getProgressDetails();
    const circumference = 2 * Math.PI * 52;
    const offset = circumference - (progressPercent / 100) * circumference;
    
    return (
        <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-center text-center md:text-left space-y-4 md:space-y-0 md:space-x-6 h-full">
            <div className="relative w-32 h-32 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    <circle className="text-slate-200" strokeWidth="10" stroke="currentColor" fill="transparent" r="52" cx="60" cy="60" />
                    <circle 
                        className="text-sky-500 transition-all duration-1000 ease-out" 
                        strokeWidth="10" 
                        stroke="currentColor" 
                        fill="transparent" 
                        r="52" 
                        cx="60" 
                        cy="60" 
                        style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
                        strokeLinecap="round" 
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-slate-800">
                    {currentLevelInfo.name}
                </div>
            </div>
            <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900">Your {language.name} Proficiency</h2>
                <p className="text-slate-600 mt-2 max-w-lg">{currentLevelInfo.description}</p>
                <div className="mt-4">
                     <div className="flex justify-between items-center text-sm font-semibold text-slate-500 mb-1">
                        <span>Progress to Next Level</span>
                        <span>{xp} / {level === ProficiencyLevel.Advanced ? 'Max' : nextLevelXP} XP</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                        <div className="bg-sky-600 h-2.5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StreakVisual: React.FC<{ streak: StreakData }> = ({ streak }) => {
    const isActive = streak && streak.count > 0;
    
    return (
        <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center text-center justify-center h-full">
            <div className={`relative w-32 h-32 flex items-center justify-center ${isActive ? 'animate-pulse-fire' : ''}`}>
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-24 h-24 transition-colors ${isActive ? 'text-orange-500' : 'text-slate-300'}`}>
                    <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071 1.071L12.963 2.286zM10.5 5.25a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5zM13.5 5.25a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5zM10.875 12.75a.75.75 0 00-1.5 0v2.625a.75.75 0 001.5 0v-2.625zM13.125 12.75a.75.75 0 00-1.5 0v2.625a.75.75 0 001.5 0v-2.625zM12 7.5a.75.75 0 00-1.5 0v2.25a.75.75 0 001.5 0V7.5zM12.963 2.286L11.488 3.76a.75.75 0 001.071 1.071l1.475-1.475a.75.75 0 00-1.071-1.071zM14.25 5.25a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5zM8.25 5.25a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5zM7.125 12.75a.75.75 0 00-1.5 0v2.625a.75.75 0 001.5 0v-2.625zM9.375 12.75a.75.75 0 00-1.5 0v2.625a.75.75 0 001.5 0v-2.625zM15.75 12.75a.75.75 0 00-1.5 0v2.625a.75.75 0 001.5 0v-2.625zM12 11.25a.75.75 0 00-1.5 0v2.25a.75.75 0 001.5 0v-2.25zM4.125 7.5a.75.75 0 000 1.5h.375a.75.75 0 000-1.5h-.375zM19.5 7.5a.75.75 0 000 1.5h.375a.75.75 0 000-1.5h-.375zM8.625 16.5a.75.75 0 00-1.5 0v.375a.75.75 0 001.5 0v-.375zM15.375 16.5a.75.75 0 00-1.5 0v.375a.75.75 0 001.5 0v-.375zM12 15.75a.75.75 0 00-1.5 0v.375a.75.75 0 001.5 0v-.375zM12 3.75a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0112 3.75zM15.75 8.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM8.25 8.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 018.25 8.25zM6 12a.75.75 0 01.75.75v.75a.75.75 0 01-1.5 0v-.75A.75.75 0 016 12zM18 12a.75.75 0 01.75.75v.75a.75.75 0 01-1.5 0v-.75A.75.75 0 0118 12z" clipRule="evenodd" /><path d="M12 21a.75.75 0 01-.75-.75v-2.668A5.25 5.25 0 018.4 14.94l-1.67-.834a.75.75 0 11.668-1.336l1.67.834A5.25 5.25 0 0112 11.25a5.25 5.25 0 013.102 1.354l1.67-.834a.75.75 0 11.668 1.336l-1.67.834a5.25 5.25 0 01-2.852 2.642V20.25a.75.75 0 01-.75.75z" />
                </svg>
                 {isActive && (
                    <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)'}}>
                        {streak.count}
                    </div>
                )}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-4">Daily Streak</h3>
            <p className="text-slate-600 mt-1 text-sm">
                {isActive ? `You're on a ${streak.count}-day streak!` : "Practice daily to build your streak!"}
            </p>
        </div>
    );
};

const Dashboard: React.FC<DashboardProps> = ({ onSelectModule, language, proficiency, streak, user }) => {
    return (
        <div className="flex flex-col items-center w-full">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                    {user ? `Welcome, ${user.username}!` : 'LingoLeap AI'}
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-600">
                    {user ? 'Ready for your next lesson? Select a module to begin.' : 'Your personal AI tutor for mastering new languages.'}
                </p>
            </div>

             {language && proficiency && streak && (
                <div className="mb-12 w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                    <div className="lg:col-span-2">
                        <ProficiencyVisual language={language} proficiency={proficiency} />
                    </div>
                    <div className="lg:col-span-1">
                        <StreakVisual streak={streak} />
                    </div>
                </div>
            )}


            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {MODULES.map(module => (
                    <ModuleCard key={module.id} module={module} onSelect={() => onSelectModule(module.id)} />
                ))}
            </div>
        </div>
    );
};

export default Dashboard;