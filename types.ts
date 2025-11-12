

export interface Language {
    code: string;
    name: string;
    speechLang: string;
}

export enum ModuleType {
    Listening = 'LISTENING',
    Speaking = 'SPEAKING',
    Reading = 'READING',
    Writing = 'WRITING',
    Alphabet = 'ALPHABET',
    Leaderboard = 'LEADERBOARD',
}

export interface Module {
    id: ModuleType | 'Translation';
    title: string;
    description: string;
    icon: string; // Outline version
    icon_solid: string; // Solid version for active states
    tags: string[];
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export interface User {
    username: string;
}

// --- Proficiency Survey Types ---
export enum ProficiencyLevel {
    None = 'NONE',
    Beginner = 'BEGINNER',
    Intermediate = 'INTERMEDIATE',
    Advanced = 'ADVANCED',
}

export interface ProficiencyState {
    level: ProficiencyLevel;
    xp: number;
}

export interface UserProficiency {
    [languageCode: string]: ProficiencyState;
}

export interface FluencyScore {
    pronunciation: number;
    fluency: number;
    vocabulary: number;
    feedback: string;
    badge: string;
}
// --- End Proficiency Survey Types ---

// --- Pronunciation Help Types ---
export interface Syllable {
    syllable: string;
    transliteration: string;
}
// --- End Pronunciation Help Types ---

// --- Game Activity Types ---

// Word Hunt
export interface WordHuntQuestion {
    definition: string;
    word: string;
}

export interface WordHuntData {
    title: string;
    story: string;
    questions: WordHuntQuestion[];
}

export interface WordHuntActivity {
    type: 'WORD_HUNT';
    title: string;
    icon: string;
    data: WordHuntData;
}

// Listen & Match
export interface ListenMatchQuestion {
    audioText: string;
    options: string[];
    correctAnswer: string;
}

export interface ListenMatchData {
    questions: ListenMatchQuestion[];
}

export interface ListenMatchActivity {
    type: 'LISTEN_MATCH';
    title: string;
    icon: string;
    data: ListenMatchData;
}

// Speak the Word
export interface SpeakTheWordData {
    phrases: string[];
}

export interface SpeakTheWordActivity {
    type: 'SPEAK_THE_WORD';
    title: string;
    icon: string;
    data: SpeakTheWordData;
}

// Sentence Scramble
export interface SentenceScrambleActivity {
    type: 'SENTENCE_SCRAMBLE';
    title: string;
    icon: string;
    data: {
        sentence: string;
    };
}

// New Game Activity for Roleplay Battle
export interface RoleplayBattleData {
    prompt: string;
    character: string; // e.g., "a friendly shopkeeper"
}

export interface RoleplayBattleActivity {
    type: 'ROLEPLAY_BATTLE';
    title: string;
    icon: string;
    data: RoleplayBattleData;
}

// New Game Activity for Cluster Search
export interface ClusterSearchData {
    promptEnglish: string;
    targetLetter: string;
    distractorLetters: string[];
    gridSize?: number;
}

export interface ClusterSearchActivity {
    type: 'CLUSTER_SEARCH';
    title: string;
    icon: string;
    data: ClusterSearchData;
}


export type GameActivity = WordHuntActivity | ListenMatchActivity | SpeakTheWordActivity | SentenceScrambleActivity | RoleplayBattleActivity | ClusterSearchActivity;
// --- End Game Activity Types ---


export interface Lesson {
    id: number;
    title: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    completed: boolean; // Now represents if all activities are done
    activities: GameActivity[];
    scenario?: string;
    mapPosition?: { x: string; y: string };
}

export interface LessonTemplate {
    id: number;
    title: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    activities: GameActivity[];
    scenario?: string;
    mapPosition?: { x: string; y: string };
}

export interface LessonProgress {
    [lessonId: number]: {
        completed: boolean;
        scores: {
             // e.g., 'Listen & Match': 80
            [activityTitle: string]: number;
        }
    };
}

export interface UserProgress {
    [languageCode: string]: LessonProgress;
}

export interface HandwritingEvaluation {
    writing_score: string;
    visual_feedback: string;
    stroke_feedback: string;
    encouragement: string;
    suggestion: string;
    next_step: string;
}

export interface AlphabetCharacter {
    character: string;
    transliteration: string;
    sound: string;
}

export interface StreakData {
    count: number;
    lastLogin: string; // ISO date string YYYY-MM-DD
}