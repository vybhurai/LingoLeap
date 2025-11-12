


import React, { useState, useEffect, useMemo } from 'react';
import { Language, ModuleType, User, ProficiencyLevel, ProficiencyState, StreakData } from './types';
import { LANGUAGES, MODULES } from './constants';
import * as userService from './services/userService';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import PronunciationPractice from './components/PronunciationPractice';
import GrammarCheck from './components/GrammarCheck';
import Chatbot from './components/Chatbot';
import TranslationTool from './components/TranslationTool';
import GamifiedLessons from './components/GamifiedLessons';
import Auth from './components/Auth';
import Sidebar from './components/Sidebar';
import LevelUpModal from './components/LevelUpModal';
import AlphabetPractice from './components/AlphabetPractice';
import Leaderboard from './components/Leaderboard';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<Language>(LANGUAGES[0]);
    const [activeModule, setActiveModule] = useState<ModuleType | 'Translation' | null>(null);
    const [currentProficiency, setCurrentProficiency] = useState<ProficiencyState>({ level: ProficiencyLevel.Beginner, xp: 0 });
    const [levelUpInfo, setLevelUpInfo] = useState<ProficiencyLevel | null>(null);
    const [streakData, setStreakData] = useState<StreakData>({ count: 0, lastLogin: '' });
    
    useEffect(() => {
        const user = userService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
            const updatedStreak = userService.updateUserStreak(user.username);
            setStreakData(updatedStreak);
        }
    }, []);

    useEffect(() => {
        if (currentUser) {
            const proficiency = userService.loadUserProficiency(currentUser.username, selectedLanguage.code);
            setCurrentProficiency(proficiency);
        }
    }, [currentUser, selectedLanguage]);

    const handleLogin = (user: User) => {
        setCurrentUser(user);
        const proficiency = userService.loadUserProficiency(user.username, selectedLanguage.code);
        setCurrentProficiency(proficiency);
        const updatedStreak = userService.updateUserStreak(user.username);
        setStreakData(updatedStreak);
    };
    
    const handleLogout = () => {
        userService.logout();
        setCurrentUser(null);
        setActiveModule(null);
    };

    const handleLevelUp = (newLevel: ProficiencyLevel, updatedProficiency: ProficiencyState) => {
        setLevelUpInfo(newLevel);
        setCurrentProficiency(updatedProficiency);
    };

    const renderActiveModule = () => {
        switch (activeModule) {
            case ModuleType.Speaking:
                return <PronunciationPractice language={selectedLanguage} proficiency={currentProficiency.level} />;
            case ModuleType.Writing:
                return <GrammarCheck language={selectedLanguage} />;
            case ModuleType.Listening:
                return <Chatbot language={selectedLanguage} />;
            case ModuleType.Reading:
                return <GamifiedLessons 
                            language={selectedLanguage} 
                            user={currentUser!} 
                            proficiency={currentProficiency}
                            onLevelUp={handleLevelUp} 
                        />;
            case ModuleType.Alphabet:
                return <AlphabetPractice language={selectedLanguage} />;
            case ModuleType.Leaderboard:
                return <Leaderboard currentUser={currentUser!} />;
            case 'Translation':
                return <TranslationTool language={selectedLanguage} />;
            default:
                return <Dashboard onSelectModule={setActiveModule} language={selectedLanguage} proficiency={currentProficiency} streak={streakData} user={currentUser!} />;
        }
    };
    
    const currentModule = useMemo(() => {
        if (activeModule) {
            const found = MODULES.find(m => m.id === activeModule);
            if (found) return found;
            if (activeModule === 'Translation') {
                 return {
                    id: 'Translation',
                    title: 'Translation Tool',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C13.18 7.061 14.1 8.25 15 9.75M9 8.25v-2.5m-3.334 2.364c1.12 0 2.233.038 3.334.114M6.666 8.25v-2.5m6.668 0h1.666" /></svg>`,
                    icon_solid: `<svg xmlns="http://www.w.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C13.18 7.061 14.1 8.25 15 9.75M9 8.25v-2.5m-3.334 2.364c1.12 0 2.233.038 3.334.114M6.666 8.25v-2.5m6.668 0h1.666" /></svg>`,
                    description: '',
                    tags: [],
                };
            }
        }
        return null;
    }, [activeModule]);

    if (!currentUser) {
        return <Auth onLogin={handleLogin} selectedLanguage={selectedLanguage} onLanguageChange={setSelectedLanguage} />;
    }

    return (
        <div className="min-h-screen font-sans text-slate-800 flex bg-slate-50">
            {levelUpInfo && <LevelUpModal newLevel={levelUpInfo} onClose={() => setLevelUpInfo(null)} />}
            <Sidebar 
                activeModule={activeModule}
                onSelectModule={setActiveModule}
            />
            <div className="flex-1 flex flex-col min-w-0">
                <Header
                    user={currentUser}
                    onLogout={handleLogout}
                    selectedLanguage={selectedLanguage}
                    onLanguageChange={setSelectedLanguage}
                />
                <main className="flex-grow p-4 sm:p-6 lg:p-8 flex flex-col overflow-y-auto">
                    {activeModule && currentModule ? (
                         <div className="flex-grow flex flex-col">
                            <div className="mb-8 flex items-center space-x-4">
                                 <div dangerouslySetInnerHTML={{ __html: currentModule.icon }} className="w-14 h-14 text-sky-600 flex-shrink-0"/>
                                <h1 className="text-4xl font-bold text-slate-900 tracking-tight">{currentModule.title}</h1>
                            </div>
                            <div className="flex-grow flex items-center justify-center">
                                {renderActiveModule()}
                            </div>
                        </div>
                    ) : (
                        <Dashboard onSelectModule={setActiveModule} language={selectedLanguage} proficiency={currentProficiency} streak={streakData} user={currentUser} />
                    )}
                </main>
            </div>
        </div>
    );
};

export default App;