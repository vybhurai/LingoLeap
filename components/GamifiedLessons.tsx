

import React, { useState, useEffect } from 'react';
import { Language, User, Lesson, GameActivity, LessonProgress, ListenMatchActivity, SpeakTheWordActivity, ProficiencyLevel, ProficiencyState, RoleplayBattleActivity, ClusterSearchActivity } from '../types';
import { LESSON_TEMPLATES, XP_PER_SCORE_POINT } from '../constants';
import * as userService from '../services/userService';
import WordHuntGame from './games/WordHuntGame';
import ListenMatchGame from './games/ListenMatchGame';
import SpeakTheWordGame from './games/SpeakTheWordGame';
import RoleplayBattleGame from './games/RoleplayBattleGame';
import ClusterSearchGame from './games/ClusterSearchGame';
import SentenceScrambleGame from './games/SentenceScrambleGame';

interface GamifiedLessonsProps {
    language: Language;
    user: User;
    proficiency: ProficiencyState;
    onLevelUp: (newLevel: ProficiencyLevel, updatedState: ProficiencyState) => void;
}

const XPToast: React.FC<{ xp: number; onClose: () => void }> = ({ xp, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed bottom-5 right-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-5 rounded-lg shadow-lg animate-fade-in-up">
            + {xp} XP Earned!
        </div>
    );
};

const GamifiedLessons: React.FC<GamifiedLessonsProps> = ({ language, user, proficiency, onLevelUp }) => {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [progress, setProgress] = useState<LessonProgress>({});
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [showScenario, setShowScenario] = useState<Lesson | null>(null);
    const [activeGame, setActiveGame] = useState<GameActivity & { lessonId: number } | null>(null);
    const [xpToast, setXpToast] = useState<number | null>(null);

    const loadData = () => {
        const allTemplates = LESSON_TEMPLATES[language.code] || [];
        const userProgress = userService.loadUserProgress(user.username, language.code);
        
        const getLevelNumber = (level: string) => {
            const upperLevel = level.toUpperCase();
            if (upperLevel === 'NONE' || upperLevel === 'BEGINNER') return 1;
            if (upperLevel === 'INTERMEDIATE') return 2;
            if (upperLevel === 'ADVANCED') return 3;
            return 1; // Default to beginner
        };

        const filteredTemplates = allTemplates.filter(template => {
            const userLevel = getLevelNumber(proficiency.level);
            const lessonLevel = getLevelNumber(template.level);
            return lessonLevel <= userLevel;
        });
        
        const mergedLessons = filteredTemplates.map(template => {
            const lessonProg = userProgress[template.id] || { completed: false, scores: {} };
            return {
                ...template,
                completed: lessonProg.completed,
            };
        });
        
        setLessons(mergedLessons);
        setProgress(userProgress);
    };

    useEffect(() => {
        loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language, user.username, proficiency]);
    
    const handleGameComplete = (lessonId: number, activityTitle: string, score: number) => {
        const xpGained = Math.round(score * XP_PER_SCORE_POINT);
        setXpToast(xpGained);

        const { leveledUp, newState } = userService.updateUserXPAndLevel(user.username, language.code, xpGained);

        if (leveledUp) {
            onLevelUp(newState.level, newState);
        }

        const newProgress: LessonProgress = JSON.parse(JSON.stringify(progress));
        
        if (!newProgress[lessonId]) {
            newProgress[lessonId] = { completed: false, scores: {} };
        }
        
        const oldScore = newProgress[lessonId].scores[activityTitle] || 0;
        if (score > oldScore) {
            newProgress[lessonId].scores[activityTitle] = score;
        }

        const lessonTemplate = lessons.find(l => l.id === lessonId);
        if (lessonTemplate) {
            const activityTitles = lessonTemplate.activities.map(a => a.title);
            const completedActivities = Object.keys(newProgress[lessonId].scores);
            if (activityTitles.every(title => completedActivities.includes(title))) {
                newProgress[lessonId].completed = true;
            }
        }

        userService.saveUserProgress(user.username, language.code, newProgress);
        setProgress(newProgress);
        setActiveGame(null); 
        setSelectedLesson(null);
        loadData(); 
    };
    
    if (activeGame) {
        switch (activeGame.type) {
            case 'WORD_HUNT':
                return <WordHuntGame 
                    gameData={activeGame.data} 
                    onComplete={() => handleGameComplete(activeGame.lessonId, activeGame.title, 100)}
                    onExit={() => setActiveGame(null)}
                />;
            case 'LISTEN_MATCH':
                 return <ListenMatchGame
                    gameData={(activeGame as ListenMatchActivity).data}
                    language={language}
                    onComplete={(score) => handleGameComplete(activeGame.lessonId, activeGame.title, score)}
                    onExit={() => setActiveGame(null)}
                />;
            case 'SPEAK_THE_WORD':
                 return <SpeakTheWordGame
                    gameData={(activeGame as SpeakTheWordActivity).data}
                    language={language}
                    onComplete={(score) => handleGameComplete(activeGame.lessonId, activeGame.title, score)}
                    onExit={() => setActiveGame(null)}
                />;
            case 'ROLEPLAY_BATTLE':
                return <RoleplayBattleGame
                    gameData={(activeGame as RoleplayBattleActivity).data}
                    language={language}
                    onComplete={(score) => handleGameComplete(activeGame.lessonId, activeGame.title, score)}
                    onExit={() => setActiveGame(null)}
                />;
            case 'CLUSTER_SEARCH':
                return <ClusterSearchGame
                    gameData={(activeGame as ClusterSearchActivity).data}
                    onComplete={(score) => handleGameComplete(activeGame.lessonId, activeGame.title, score)}
                    onExit={() => setActiveGame(null)}
                />;
            case 'SENTENCE_SCRAMBLE':
                return <SentenceScrambleGame
                    gameData={activeGame.data}
                    onComplete={(score) => handleGameComplete(activeGame.lessonId, activeGame.title, score)}
                    onExit={() => setActiveGame(null)}
                />;
            default:
                setActiveGame(null);
                return null;
        }
    }
    
    const renderLessonDetailModal = () => {
        if (!selectedLesson) return null;
        
        const lessonProg = progress[selectedLesson.id] || { scores: {} };

        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedLesson(null)}>
                <div 
                    className="bg-white border border-slate-200 p-8 rounded-2xl shadow-xl w-full max-w-2xl transform transition-all duration-300 animate-fade-in-up"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex justify-between items-start">
                        <div>
                             <h2 className="text-3xl font-bold text-slate-900 mb-2">{selectedLesson.title}</h2>
                             <p className="text-slate-500 mb-6">Complete the activities below to master this lesson.</p>
                        </div>
                        <button onClick={() => setSelectedLesson(null)} className="text-slate-400 hover:text-slate-800 text-2xl">&times;</button>
                    </div>
                    
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {selectedLesson.activities.length > 0 ? selectedLesson.activities.map(activity => (
                             <div key={activity.title} className="bg-slate-50 p-4 rounded-lg flex items-center justify-between transition-colors hover:bg-slate-100">
                                 <div className="flex items-center space-x-4">
                                     <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-lg flex items-center justify-center flex-shrink-0" dangerouslySetInnerHTML={{ __html: activity.icon }}/>
                                     <div>
                                        <h3 className="font-semibold text-slate-800">{activity.title}</h3>
                                        <p className="text-sm text-slate-500">High Score: {lessonProg.scores[activity.title] || 0}%</p>
                                     </div>
                                 </div>
                                 <button 
                                    onClick={() => {
                                        setActiveGame({ ...activity, lessonId: selectedLesson.id });
                                        setSelectedLesson(null);
                                    }}
                                    className="px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white"
                                >
                                    {lessonProg.scores[activity.title] ? 'Play Again' : 'Play'}
                                </button>
                             </div>
                        )) : (
                            <p className="text-center text-slate-500 py-8">No activities available for this lesson yet.</p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    const renderScenarioModal = () => {
        if (!showScenario) return null;
        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowScenario(null)}>
                <div 
                    className="bg-white border border-slate-200 p-8 rounded-2xl shadow-xl w-full max-w-2xl transform transition-all duration-300 animate-fade-in-up"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex justify-between items-start">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">{showScenario.title}</h2>
                        <button onClick={() => setShowScenario(null)} className="text-slate-400 hover:text-slate-800 text-2xl">&times;</button>
                    </div>
                    <p className="text-slate-600 mb-6">{showScenario.scenario}</p>
                    <button 
                        onClick={() => {
                            setSelectedLesson(showScenario);
                            setShowScenario(null);
                        }}
                        className="w-full mt-4 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-sky-500 transition-all duration-200"
                    >
                        Start Mission
                    </button>
                </div>
            </div>
        );
    }

    const handleLessonClick = (lesson: Lesson) => {
        if (lesson.scenario) {
            setShowScenario(lesson);
        } else {
            setSelectedLesson(lesson);
        }
    }
    
    const getPathD = (lessonsWithPath: Lesson[]) => {
        if (lessonsWithPath.length < 2) return '';
        
        let pathString = `M ${parseFloat(lessonsWithPath[0].mapPosition!.x)} ${parseFloat(lessonsWithPath[0].mapPosition!.y)}`;

        for (let i = 1; i < lessonsWithPath.length; i++) {
            pathString += ` L ${parseFloat(lessonsWithPath[i].mapPosition!.x)} ${parseFloat(lessonsWithPath[i].mapPosition!.y)}`;
        }
        
        return pathString;
    };
    
    const proficiencyDisplay = proficiency.level.charAt(0).toUpperCase() + proficiency.level.slice(1).toLowerCase();
    const lessonsWithPositions = lessons.filter(l => l.mapPosition);
    const hasMapLayout = lessons.length > 0 && lessons.every(l => l.mapPosition);

    return (
        <div className="max-w-4xl mx-auto w-full">
            {xpToast && <XPToast xp={xpToast} onClose={() => setXpToast(null)} />}
            {renderScenarioModal()}
            {renderLessonDetailModal()}
            <div className="text-center mb-12">
                 <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Language Quest World</h1>
                 <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-600">
                    Your <span className="text-sky-600 font-semibold">{proficiencyDisplay}</span> quest in {language.name}. Follow the path and complete missions!
                 </p>
            </div>
            
            {lessons.length === 0 ? (
                 <div className="text-center py-16 px-6 bg-white border border-slate-200 rounded-xl">
                    <h3 className="text-2xl font-bold text-slate-900">Coming Soon!</h3>
                    <p className="text-slate-500 mt-2">No quests are available for your proficiency level in this language yet. Please check back later.</p>
                 </div>
            ) : ( hasMapLayout ? (
                <div className="relative h-96 w-full bg-slate-50/50 rounded-2xl p-4 border border-slate-200 overflow-hidden">
                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute top-0 left-0">
                        <path d={getPathD(lessonsWithPositions)} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" fill="none" vectorEffect="non-scaling-stroke" />
                    </svg>
                    
                    {lessonsWithPositions.map((lesson, index) => {
                        const lessonProgress = progress[lesson.id] || { completed: false };
                        const prevLesson = index > 0 ? lessonsWithPositions[index - 1] : null;
                        const prevLessonCompleted = index === 0 || (prevLesson && progress[prevLesson.id]?.completed);
                        
                        let status: 'completed' | 'unlocked' | 'locked' = 'locked';
                        if (lessonProgress.completed) status = 'completed';
                        else if (prevLessonCompleted) status = 'unlocked';
                        
                        const isClickable = status !== 'locked';
                        
                        return (
                            <div key={lesson.id} className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10" style={{ left: lesson.mapPosition!.x, top: lesson.mapPosition!.y }}>
                                <div className="flex flex-col items-center">
                                    <button
                                        onClick={() => isClickable && handleLessonClick(lesson)}
                                        disabled={!isClickable}
                                        className={`
                                            w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center border-4 transition-all duration-300 relative shadow-lg
                                            ${status === 'completed' && 'bg-green-500 border-green-300 text-white'}
                                            ${status === 'unlocked' && 'bg-sky-600 border-sky-400 text-white animate-pulse-glow cursor-pointer hover:scale-105'}
                                            ${status === 'locked' && 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed'}
                                        `}
                                    >
                                        {status === 'completed' ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                        ) : status === 'unlocked' ? (
                                             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6.364-8.364l-1.414-1.414M6.343 6.343l1.414 1.414m12.728 0l-1.414 1.414M17.657 17.657l1.414 1.414M4 12H2m10 10v-2m6.364-1.636l-1.414-1.414M12 6.343l-1.414-1.414" /></svg>
                                        )}
                                    </button>
                                    <p className={`mt-2 text-center text-xs md:text-sm font-semibold max-w-[100px] p-1 bg-white/70 rounded ${isClickable ? 'text-slate-700' : 'text-slate-400'}`}>{lesson.title}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                 <div className="space-y-4">
                    {lessons.map((lesson, index) => {
                         const lessonProgress = progress[lesson.id] || { completed: false };
                         const prevLessonCompleted = index === 0 || (progress[lessons[index - 1].id] && progress[lessons[index - 1].id].completed);
                         
                         let status: 'completed' | 'unlocked' | 'locked' = 'locked';
                         if (lessonProgress.completed) status = 'completed';
                         else if (prevLessonCompleted) status = 'unlocked';
                         
                         const isClickable = status !== 'locked';

                         return (
                            <div key={lesson.id} onClick={() => isClickable && handleLessonClick(lesson)} className={`p-4 rounded-lg flex items-center justify-between transition-all duration-300 border ${isClickable ? 'cursor-pointer hover:border-sky-300 hover:shadow-sm' : 'cursor-not-allowed opacity-60'} ${status === 'completed' ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'}`}>
                                <div className="flex items-center space-x-4">
                                     <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${status === 'completed' ? 'bg-green-500 text-white' : status === 'unlocked' ? 'bg-sky-600 text-white' : 'bg-slate-300 text-slate-500'}`}>
                                        {status === 'completed' ? '✓' : '▶'}
                                     </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-800">{lesson.title}</h3>
                                        <p className="text-sm text-slate-500">{lesson.level}</p>
                                    </div>
                                </div>
                            </div>
                         )
                    })}
                 </div>
            ))
            }
        </div>
    );
};

export default GamifiedLessons;
