

import { User, UserProgress, LessonProgress, UserProficiency, ProficiencyLevel, ProficiencyState, StreakData } from "../types";
import { XP_THRESHOLDS } from "../constants";

const USERS_KEY = 'lingoleap_users';
const PROGRESS_KEY = 'lingoleap_progress';
const PROFICIENCY_KEY = 'lingoleap_proficiency';
const SESSION_KEY = 'lingoleap_session';
const STREAK_KEY = 'lingoleap_streaks';

// Helper to get data from localStorage
const getStorageData = <T>(key: string): T | null => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
        return null;
    }
};

// Helper to set data to localStorage
const setStorageData = <T>(key: string, value: T): void => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error writing to localStorage key “${key}”:`, error);
    }
};

// --- Daily Streak Logic ---
const getTodayDateString = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const updateUserStreak = (username: string): StreakData => {
    const allStreaks = getStorageData<{ [username: string]: StreakData }>(STREAK_KEY) || {};
    const userStreak = allStreaks[username] || { count: 0, lastLogin: '' };
    const todayStr = getTodayDateString();

    if (userStreak.lastLogin === todayStr) {
        // Already logged in today, do nothing.
        return userStreak;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    let newStreak: StreakData;

    if (userStreak.lastLogin === yesterdayStr) {
        // Consecutive day
        newStreak = { count: userStreak.count + 1, lastLogin: todayStr };
    } else {
        // Missed a day or first login
        newStreak = { count: 1, lastLogin: todayStr };
    }

    allStreaks[username] = newStreak;
    setStorageData(STREAK_KEY, allStreaks);
    return newStreak;
};
// --- End Daily Streak Logic ---

export const signUp = (username: string, password: string): { success: boolean, message: string } => {
    const users = getStorageData<{ [username: string]: string }>(USERS_KEY) || {};
    if (users[username]) {
        return { success: false, message: 'Username already exists.' };
    }
    users[username] = password; // In a real app, hash the password!
    setStorageData(USERS_KEY, users);
    return { success: true, message: 'Signup successful!' };
};

export const login = (username: string, password: string): { success: boolean, user: User | null, message: string } => {
    const users = getStorageData<{ [username: string]: string }>(USERS_KEY) || {};
    if (users[username] && users[username] === password) {
        const user: User = { username };
        // Use sessionStorage for the current session
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
        return { success: true, user, message: 'Login successful!' };
    }
    return { success: false, user: null, message: 'Invalid username or password.' };
};

export const logout = (): void => {
    sessionStorage.removeItem(SESSION_KEY);
};

export const getCurrentUser = (): User | null => {
    return getStorageData<User>(SESSION_KEY);
};

export const saveUserProgress = (username: string, languageCode: string, progress: LessonProgress): void => {
    const allProgress = getStorageData<{ [username: string]: UserProgress }>(PROGRESS_KEY) || {};
    if (!allProgress[username]) {
        allProgress[username] = {};
    }
    allProgress[username][languageCode] = progress;
    setStorageData(PROGRESS_KEY, allProgress);
};

export const loadUserProgress = (username: string, languageCode: string): LessonProgress => {
    const allProgress = getStorageData<{ [username: string]: UserProgress }>(PROGRESS_KEY) || {};
    return allProgress[username]?.[languageCode] || {};
};

export const saveInitialProficiency = (username: string, proficiencySelection: { [key:string]: ProficiencyLevel }): void => {
    const allProficiencies = getStorageData<{ [username: string]: UserProficiency }>(PROFICIENCY_KEY) || {};
    
    const userProficiency: UserProficiency = {};
    Object.keys(proficiencySelection).forEach(langCode => {
        const selectedLevel = proficiencySelection[langCode];
        userProficiency[langCode] = {
            level: selectedLevel === ProficiencyLevel.None ? ProficiencyLevel.Beginner : selectedLevel,
            xp: XP_THRESHOLDS[selectedLevel === ProficiencyLevel.None ? ProficiencyLevel.Beginner : selectedLevel] || 0
        };
    });

    allProficiencies[username] = userProficiency;
    setStorageData(PROFICIENCY_KEY, allProficiencies);
};

export const loadUserProficiency = (username: string, languageCode: string): ProficiencyState => {
    const allProficiencies = getStorageData<{ [username: string]: UserProficiency }>(PROFICIENCY_KEY) || {};
    return allProficiencies[username]?.[languageCode] || { level: ProficiencyLevel.Beginner, xp: 0 };
};


export const updateUserXPAndLevel = (username: string, languageCode: string, xpGained: number): { leveledUp: boolean, newState: ProficiencyState } => {
    const allProficiencies = getStorageData<{ [username: string]: UserProficiency }>(PROFICIENCY_KEY) || {};
    
    const currentState = allProficiencies[username]?.[languageCode] || { level: ProficiencyLevel.Beginner, xp: 0 };
    const oldLevel = currentState.level;
    
    const newState: ProficiencyState = {
        ...currentState,
        xp: currentState.xp + xpGained,
    };

    // Check for level up
    let newLevel = oldLevel;
    if (newState.xp >= XP_THRESHOLDS[ProficiencyLevel.Advanced] && oldLevel !== ProficiencyLevel.Advanced) {
        newLevel = ProficiencyLevel.Advanced;
    } else if (newState.xp >= XP_THRESHOLDS[ProficiencyLevel.Intermediate] && oldLevel === ProficiencyLevel.Beginner) {
        newLevel = ProficiencyLevel.Intermediate;
    }
    
    newState.level = newLevel;
    const leveledUp = oldLevel !== newLevel;

    // Save the new state
    if (!allProficiencies[username]) {
        allProficiencies[username] = {};
    }
    allProficiencies[username][languageCode] = newState;
    setStorageData(PROFICIENCY_KEY, allProficiencies);

    return { leveledUp, newState };
};

export const getLeaderboardData = (): { username: string; totalXp: number }[] => {
    const allProficiencies = getStorageData<{ [username: string]: UserProficiency }>(PROFICIENCY_KEY) || {};
    const allUsers = getStorageData<{ [username: string]: string }>(USERS_KEY) || {};
    
    const leaderboard: { username: string; totalXp: number }[] = [];
    const processedUsers = new Set<string>();

    // Process users with proficiency data
    for (const username in allProficiencies) {
        const userProficiency = allProficiencies[username];
        let totalXp = 0;
        for (const langCode in userProficiency) {
            totalXp += userProficiency[langCode].xp;
        }
        leaderboard.push({ username, totalXp });
        processedUsers.add(username);
    }

    // Add users who have signed up but have no XP yet
    for (const username in allUsers) {
        if (!processedUsers.has(username)) {
            leaderboard.push({ username, totalXp: 0 });
        }
    }

    // Sort by total XP descending
    leaderboard.sort((a, b) => b.totalXp - a.totalXp);

    return leaderboard;
};