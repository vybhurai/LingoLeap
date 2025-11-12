import React, { useState, useEffect } from 'react';
import { User } from '../types';
import * as userService from '../services/userService';

interface LeaderboardEntry {
    username: string;
    totalXp: number;
}

interface LeaderboardProps {
    currentUser: User;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ currentUser }) => {
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);

    useEffect(() => {
        const data = userService.getLeaderboardData();
        setLeaderboardData(data);
    }, []);

    const getRankStyling = (index: number) => {
        switch(index) {
            case 0: return 'bg-amber-100 border-amber-300';
            case 1: return 'bg-slate-200 border-slate-300';
            case 2: return 'bg-orange-100 border-orange-300';
            default: return 'bg-white border-slate-200';
        }
    };

    const RankIcon: React.FC<{ index: number }> = ({ index }) => {
        const medalColors = [
            'text-amber-400', // Gold
            'text-slate-400', // Silver
            'text-orange-400'  // Bronze
        ];

        if (index < 3) {
            return (
                <div className={`w-8 h-8 flex items-center justify-center font-bold ${medalColors[index]}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071 1.071L12.963 2.286zM2.25 9.75A.75.75 0 003 9h-1.5zM9 2.25A.75.75 0 009.75 3V1.5zM12.963 2.286L9.75 5.514a.75.75 0 001.071 1.071L14.036 3.357a.75.75 0 00-1.071-1.071zM15 9.75a.75.75 0 00-1.5 0h1.5zM21.75 9.75a.75.75 0 00-.75-.75h-1.5zm-18 0h1.5V8.25h-1.5V9.75zM3 11.25A.75.75 0 002.25 12h1.5zm0 1.5A.75.75 0 003 12.75v1.5zm0 1.5a.75.75 0 00.75.75h-1.5zM4.5 15.75a.75.75 0 00.75.75v-1.5zm1.5 0A.75.75 0 005.25 15h1.5zM6 18.75a.75.75 0 00.75.75V17.25zM7.5 19.5A.75.75 0 006.75 20.25v-1.5zM9 21.75a.75.75 0 00.75.75V20.25zM12 21.75a.75.75 0 00.75-.75h-1.5zM15 21.75a.75.75 0 00-.75.75V20.25zM16.5 19.5a.75.75 0 00.75 1.5v-1.5zM18 18.75a.75.75 0 00-.75-.75h1.5zM18.75 15a.75.75 0 00.75.75v-1.5zM19.5 15.75a.75.75 0 00.75-.75h-1.5zM21 13.5a.75.75 0 00.75-.75h-1.5zM21 11.25a.75.75 0 00-.75.75v-1.5zM15.75 5.514l-4.286 4.286a.75.75 0 001.071 1.071l4.286-4.286a.75.75 0 00-1.071-1.071zM9.75 3a.75.75 0 00-1.071-1.071L5.514 5.214a.75.75 0 001.071 1.071L9.75 3.036V3zM3 9.75A.75.75 0 012.25 9V8.25a2.25 2.25 0 012.25-2.25h1.014a.75.75 0 00.53-1.28l-2.286-2.286a.75.75 0 00-1.071 1.071L3.929 7.014A3.75 3.75 0 00.75 10.5v1.5c0 .753.25 1.442.676 2.01l-1.362 1.362a.75.75 0 001.06 1.06l1.362-1.362A3.75 3.75 0 006 17.25h1.5a3.75 3.75 0 003.75 3.75h1.5a3.75 3.75 0 003.75-3.75H18a3.75 3.75 0 003.076-1.76l1.362 1.362a.75.75 0 001.06-1.06l-1.362-1.362a3.75 3.75 0 00.676-2.01v-1.5a3.75 3.75 0 00-3.214-3.736l2.286-2.286a.75.75 0 00-1.071-1.071l-2.286 2.286a.75.75 0 00-.53 1.28H18a2.25 2.25 0 012.25 2.25v.75a.75.75 0 01-1.5 0V12a2.25 2.25 0 01-2.25-2.25H9.75A2.25 2.25 0 017.5 12v-.75a.75.75 0 01-1.5 0V12A2.25 2.25 0 013.75 9.75H3z" clipRule="evenodd" />
                    </svg>
                </div>
            );
        }
        return <span className="w-8 h-8 flex items-center justify-center font-bold text-slate-500">{index + 1}</span>;
    };

    return (
        <div className="max-w-3xl mx-auto w-full flex flex-col">
            <div className="w-full space-y-4">
                {leaderboardData.length > 0 ? (
                    leaderboardData.map((entry, index) => {
                        const isCurrentUser = currentUser.username === entry.username;
                        let rowClasses = "flex items-center p-4 rounded-xl border transition-all duration-300 shadow-sm ";
                        rowClasses += getRankStyling(index);
                        if (isCurrentUser) {
                            rowClasses += ' ring-2 ring-sky-400 ring-offset-2 ring-offset-slate-100 scale-105';
                        }

                        return (
                            <div key={entry.username} className={rowClasses}>
                                <RankIcon index={index} />
                                <div className="w-10 h-10 ml-4 rounded-full bg-gradient-to-tr from-sky-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                    {entry.username.charAt(0).toUpperCase()}
                                </div>
                                <span className="ml-4 font-semibold text-slate-800 flex-grow">{entry.username} {isCurrentUser && '(You)'}</span>
                                <span className="font-bold text-sky-600 text-lg">{entry.totalXp.toLocaleString()} XP</span>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center p-8 bg-white rounded-lg shadow-md border border-slate-200">
                        <p className="text-slate-700 font-semibold">The leaderboard is empty.</p>
                        <p className="text-slate-500 text-sm mt-2">Start completing lessons to see your name here!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;