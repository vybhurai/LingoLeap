

import React from 'react';
import { User, Language } from '../types';
import * as userService from '../services/userService';
import LanguageSurvey from './LanguageSurvey';
import { authTranslations } from '../translations';
import { LANGUAGES } from '../constants';

interface AuthProps {
    onLogin: (user: User) => void;
    selectedLanguage: Language;
    onLanguageChange: (language: Language) => void;
}

type AuthStep = 'login' | 'signup' | 'survey';

const Auth: React.FC<AuthProps> = ({ onLogin, selectedLanguage, onLanguageChange }) => {
    const [authStep, setAuthStep] = React.useState<AuthStep>('login');
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [newUser, setNewUser] = React.useState<string | null>(null);

    const t = authTranslations[selectedLanguage.code] || authTranslations['en'];

    const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLang = LANGUAGES.find(lang => lang.code === e.target.value);
        if (newLang) onLanguageChange(newLang);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (authStep === 'login') {
            const result = userService.login(username, password);
            if (result.success && result.user) {
                onLogin(result.user);
            } else {
                setError(result.message);
            }
        } else { // 'signup'
            const result = userService.signUp(username, password);
            if (result.success) {
                setNewUser(username);
                setAuthStep('survey');
            } else {
                setError(result.message);
            }
        }
    };

    const handleSurveyComplete = () => {
        setMessage(t.profileSetupComplete);
        setAuthStep('login');
        setNewUser(null);
        setUsername('');
        setPassword('');
    };

    const switchMode = () => {
        setAuthStep(authStep === 'login' ? 'signup' : 'login');
        setError('');
        setMessage('');
        setUsername('');
        setPassword('');
    };

    if (authStep === 'survey' && newUser) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100">
                <LanguageSurvey username={newUser} onComplete={handleSurveyComplete} />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100">
            <div className="w-full max-w-md bg-white border border-slate-200 p-8 rounded-2xl shadow-lg relative">
                <div className="absolute top-4 right-4 z-10">
                    <div className="relative">
                        <select
                            value={selectedLanguage.code}
                            onChange={handleLangChange}
                            className="appearance-none bg-white border border-slate-300 rounded-md py-1.5 pl-3 pr-8 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                            aria-label="Select language"
                        >
                            {LANGUAGES.map(lang => (
                                <option key={lang.code} value={lang.code}>{lang.name}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </div>
                    </div>
                </div>
                <div className="text-center mb-8">
                     <div className="inline-block p-4 bg-slate-100 rounded-full mb-4 border border-slate-200">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-sky-600">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C13.18 7.061 14.1 8.25 15 9.75M9 8.25v-2.5m-3.334 2.364c1.12 0 2.233.038 3.334.114M6.666 8.25v-2.5m6.668 0h1.666" />
                         </svg>
                     </div>
                     <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        {t.welcome}
                    </h1>
                    <p className="text-slate-500">{authStep === 'login' ? t.signInMessage : t.signUpMessage}</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="username">
                            {t.usernameLabel}
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full bg-slate-100 text-slate-800 rounded-md py-3 pl-10 pr-3 border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="password">
                            {t.passwordLabel}
                        </label>
                         <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2-2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-slate-100 text-slate-800 rounded-md py-3 pl-10 pr-3 border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
                            />
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    {message && <p className="text-green-500 text-sm text-center">{message}</p>}
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-sky-500 transition-all duration-200"
                        >
                            {authStep === 'login' ? t.loginButton : t.createAccountButton}
                        </button>
                    </div>
                </form>
                <div className="mt-6 text-center">
                    <button onClick={switchMode} className="text-sm text-sky-600 hover:text-sky-500">
                        {authStep === 'login' ? t.switchSignUp : t.switchLogin}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;