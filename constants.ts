

import { Language, Module, ModuleType, LessonTemplate, ProficiencyLevel, AlphabetCharacter } from './types';

export const LANGUAGES: Language[] = [
    { code: 'en', name: 'English', speechLang: 'en-US' },
    { code: 'kn', name: 'Kannada', speechLang: 'kn-IN' },
    { code: 'ta', name: 'Tamil', speechLang: 'ta-IN' },
    { code: 'te', name: 'Telugu', speechLang: 'te-IN' },
    { code: 'mr', name: 'Marathi', speechLang: 'mr-IN' },
    { code: 'hi', name: 'Hindi', speechLang: 'hi-IN' },
    { code: 'ml', name: 'Malayalam', speechLang: 'ml-IN' },
];

const ICONS = {
    SPEAKING: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m12 0v-1.5a6 6 0 00-6-6v0a6 6 0 00-6 6v1.5m12 0v-1.5a6 6 0 00-6-6v0a6 6 0 00-6 6v1.5m0 9.75a6 6 0 01-6-6v-1.5m0 9.75a6 6 0 006-6v-1.5m6 7.5v-1.5a6 6 0 00-6-6v0a6 6 0 00-6 6v1.5m6 7.5a6 6 0 006-6v-1.5" /></svg>`,
    SPEAKING_SOLID: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M11.25 4.533A9.708 9.708 0 001.5 12.585v1.666a9.708 9.708 0 009.75 8.052 9.708 9.708 0 009.75-8.052v-1.666A9.708 9.708 0 0012.75 4.533h-1.5Z" /><path d="M12 1.5A6.75 6.75 0 0118.75 8.25v1.666a6.75 6.75 0 01-13.5 0V8.25A6.75 6.75 0 0112 1.5Z" /></svg>`,
    WRITING: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>`,
    WRITING_SOLID: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.48 3.712V21a.75.75 0 00.75.75h4.5a5.25 5.25 0 003.712-1.48l8.4-8.4z" /></svg>`,
    LISTENING: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg>`,
    LISTENING_SOLID: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.348 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.945.945 2.56.276 2.56-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" /><path d="M15.932 7.757a.75.75 0 011.061 0 5.25 5.25 0 010 7.424.75.75 0 11-1.06-1.06 3.75 3.75 0 000-5.304.75.75 0 010-1.06z" /></svg>`,
    READING: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>`,
    READING_SOLID: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M11.25 4.533A9.708 9.708 0 006 3.75a9.708 9.708 0 00-5.25.783V18a9.708 9.708 0 005.25 2.25c2.305 0 4.408.867 6 2.292V4.533zM12.75 4.533A9.708 9.708 0 0118 3.75a9.708 9.708 0 015.25.783V18a9.708 9.708 0 01-5.25 2.25c-2.305 0-4.408.867-6 2.292V4.533z" /></svg>`,
    ALPHABET: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>`,
    ALPHABET_SOLID: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path fill-rule="evenodd" d="M5.625 2.25H9.375a3 3 0 0 1 3 3V6h1.875a3 3 0 0 1 3 3v1.875a3 3 0 0 1-3 3H12.375v1.875a3 3 0 0 1-3 3H5.625a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3Zm0 1.5a1.5 1.5 0 0 0-1.5 1.5v13.5a1.5 1.5 0 0 0 1.5 1.5h3.75a1.5 1.5 0 0 0 1.5-1.5V15.375a.75.75 0 0 1 .75-.75h1.875a1.5 1.5 0 0 0 1.5-1.5V9a1.5 1.5 0 0 0-1.5-1.5H11.625a.75.75 0 0 1-.75-.75V4.5a1.5 1.5 0 0 0-1.5-1.5H5.625Z" clip-rule="evenodd" /></svg>`,
    LEADERBOARD: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 011.05-4.322A4.502 4.502 0 0112 12.75a4.502 4.502 0 014.45 1.678 9.75 9.75 0 011.05 4.322zM9 12.75a3 3 0 013-3h.008a3 3 0 013 3v.008a3 3 0 01-3 3h-.008a3 3 0 01-3-3v-.008z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 4.5c-2.43 0-4.63.89-6.362 2.39A8.25 8.25 0 003 13.125v2.875A8.25 8.25 0 0012 24a8.25 8.25 0 009-8.25v-2.875a8.25 8.25 0 00-5.638-7.911z" /></svg>`,
    LEADERBOARD_SOLID: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path fill-rule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071 1.071L12.963 2.286zM2.25 9.75A.75.75 0 003 9h-1.5zM9 2.25A.75.75 0 009.75 3V1.5zM12.963 2.286L9.75 5.514a.75.75 0 001.071 1.071L14.036 3.357a.75.75 0 00-1.071-1.071zM15 9.75a.75.75 0 00-1.5 0h1.5zM21.75 9.75a.75.75 0 00-.75-.75h-1.5zm-18 0h1.5V8.25h-1.5V9.75zM3 11.25A.75.75 0 002.25 12h1.5zm0 1.5A.75.75 0 003 12.75v1.5zm0 1.5a.75.75 0 00.75.75h-1.5zM4.5 15.75a.75.75 0 00.75.75v-1.5zm1.5 0A.75.75 0 005.25 15h1.5zM6 18.75a.75.75 0 00.75.75V17.25zM7.5 19.5A.75.75 0 006.75 20.25v-1.5zM9 21.75a.75.75 0 00.75.75V20.25zM12 21.75a.75.75 0 00.75-.75h-1.5zM15 21.75a.75.75 0 00-.75.75V20.25zM16.5 19.5a.75.75 0 00.75 1.5v-1.5zM18 18.75a.75.75 0 00-.75-.75h1.5zM18.75 15a.75.75 0 00.75.75v-1.5zM19.5 15.75a.75.75 0 00.75-.75h-1.5zM21 13.5a.75.75 0 00.75-.75h-1.5zM21 11.25a.75.75 0 00-.75.75v-1.5zM15.75 5.514l-4.286 4.286a.75.75 0 001.071 1.071l4.286-4.286a.75.75 0 00-1.071-1.071zM9.75 3a.75.75 0 00-1.071-1.071L5.514 5.214a.75.75 0 001.071 1.071L9.75 3.036V3zM3 9.75A.75.75 0 012.25 9V8.25a2.25 2.25 0 012.25-2.25h1.014a.75.75 0 00.53-1.28l-2.286-2.286a.75.75 0 00-1.071 1.071L3.929 7.014A3.75 3.75 0 00.75 10.5v1.5c0 .753.25 1.442.676 2.01l-1.362 1.362a.75.75 0 001.06 1.06l1.362-1.362A3.75 3.75 0 006 17.25h1.5a3.75 3.75 0 003.75 3.75h1.5a3.75 3.75 0 003.75-3.75H18a3.75 3.75 0 003.076-1.76l1.362 1.362a.75.75 0 001.06-1.06l-1.362-1.362a3.75 3.75 0 00.676-2.01v-1.5a3.75 3.75 0 00-3.214-3.736l2.286-2.286a.75.75 0 00-1.071-1.071l-2.286 2.286a.75.75 0 00-.53 1.28H18a2.25 2.25 0 012.25 2.25v.75a.75.75 0 01-1.5 0V12a2.25 2.25 0 01-2.25-2.25H9.75A2.25 2.25 0 017.5 12v-.75a.75.75 0 01-1.5 0V12A2.25 2.25 0 013.75 9.75H3z" clip-rule="evenodd" /></svg>`,
    TRANSLATION: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C13.18 7.061 14.1 8.25 15 9.75M9 8.25v-2.5m-3.334 2.364c1.12 0 2.233.038 3.334.114M6.666 8.25v-2.5m6.668 0h1.666" /></svg>`,
    TRANSLATION_SOLID: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C13.18 7.061 14.1 8.25 15 9.75M9 8.25v-2.5m-3.334 2.364c1.12 0 2.233.038 3.334.114M6.666 8.25v-2.5m6.668 0h1.666" /></svg>`,
};

export const MODULES: Module[] = [
    {
        id: ModuleType.Speaking,
        title: 'Speaking Practice',
        description: 'Improve your pronunciation and fluency with AI-powered feedback on real-world phrases.',
        icon: ICONS.SPEAKING,
        icon_solid: ICONS.SPEAKING_SOLID,
        tags: ['Pronunciation', 'Fluency', 'AI Feedback']
    },
    {
        id: ModuleType.Writing,
        title: 'Writing Assistant',
        description: 'Check your grammar, get writing suggestions, and practice handwriting with instant AI evaluation.',
        icon: ICONS.WRITING,
        icon_solid: ICONS.WRITING_SOLID,
        tags: ['Grammar', 'Handwriting', 'Composition']
    },
    {
        id: ModuleType.Listening,
        title: 'AI Guide (LingoGuide)',
        description: 'Chat with our AI guide. Practice conversation in your target language or ask questions about the app and how the AI works.',
        icon: ICONS.LISTENING,
        icon_solid: ICONS.LISTENING_SOLID,
        tags: ['Conversation', 'App Help', 'Explainable AI']
    },
    {
        id: ModuleType.Reading,
        title: 'Gamified Lessons',
        description: 'Embark on a learning path with fun, interactive games and activities to boost your vocabulary.',
        icon: ICONS.READING,
        icon_solid: ICONS.READING_SOLID,
        tags: ['Vocabulary', 'Games', 'Learning Path']
    },
    {
        id: ModuleType.Alphabet,
        title: 'Alphabet Basics',
        description: 'Learn the fundamental characters of the language with interactive flashcards and audio.',
        icon: ICONS.ALPHABET,
        icon_solid: ICONS.ALPHABET_SOLID,
        tags: ['Beginner', 'Flashcards', 'Foundation']
    },
    {
        id: ModuleType.Leaderboard,
        title: 'Leaderboard',
        description: 'See how you rank against other learners and climb to the top of the global charts.',
        icon: ICONS.LEADERBOARD,
        icon_solid: ICONS.LEADERBOARD_SOLID,
        tags: ['Ranking', 'Global', 'XP']
    },
    {
        id: 'Translation',
        title: 'Translation Tool',
        description: 'Quickly translate text between languages, with speech-to-text and text-to-speech capabilities.',
        icon: ICONS.TRANSLATION,
        icon_solid: ICONS.TRANSLATION_SOLID,
        tags: ['Utility', 'Speech-to-Text', 'Quick']
    }
];

export const KEYBOARD_LAYOUTS: { [key: string]: string[] } = {
    'en': [
        'Q W E R T Y U I O P',
        'A S D F G H J K L',
        'Z X C V B N M',
    ],
    'kn': [
        'ಅ ಆ ಇ ಈ ಉ ಊ ಋ ಎ ಏ ಐ ಒ ಓ ಔ',
        'ಕ ಖ ಗ ಘ ಙ ಚ ಛ ಜ ಝ ಞ',
        'ಟ ಠ ಡ ಢ ಣ ತ ಥ ದ ಧ ನ',
        'ಪ ಫ ಬ ಭ ಮ ಯ ರ ಲ ವ ಶ ಷ ಸ ಹ ಳ',
    ],
    'ta': [
        'அ ஆ இ ஈ உ ஊ எ ஏ ஐ ஒ ஓ ஔ',
        'க ங ச ஞ ட ண த ந ப ம ய ர ல வ',
        'ழ ள ற ன ஷ ஸ ஹ க்ஷ ஸ்ரீ',
    ],
    'te': [
        'అ ఆ ఇ ఈ ఉ ఊ ఋ ౠ ఎ ఏ ఐ ఒ ఓ ఔ',
        'క ఖ గ ఘ ఙ చ ఛ జ ఝ ఞ',
        'ట ఠ డ ఢ ణ త థ ద ధ న',
        'ప ఫ బ భ మ య ర ల వ శ ష స హ ళ క్ష ఱ',
    ],
    'mr': [
        'अ आ इ ई उ ऊ ऋ ए ऐ ओ औ',
        'क ख ग घ ङ च छ ज झ ञ',
        'ट ठ ड ढ ण त थ द ध न',
        'प फ ब भ म य र ల వ श ष स ह ळ क्ष ज्ञ',
    ],
    'hi': [
        'अ आ इ ई उ ऊ ऋ ए ऐ ओ औ',
        'क ख ग घ ङ च छ ज झ ञ',
        'ट ठ ड ढ ण त थ द ध न',
        'प फ ब भ म य र ल व श ष स ह क्ष त्र ज्ञ',
    ],
    'ml': [
        'അ ആ ഇ ഈ ഉ ഊ ഋ എ ഏ ഐ ഒ ഓ ഔ',
        'ക ഖ ഗ ഘ ങ ച ഛ ജ ഝ ഞ',
        'ട ഠ ഡ ഢ ണ ത ഥ ദ ധ ന',
        'പ ഫ ബ ഭ മ യ ര ല വ ശ ഷ സ ഹ ള ഴ റ',
    ],
};

// --- XP and Leveling System ---
export const XP_THRESHOLDS = {
    [ProficiencyLevel.Beginner]: 0,
    [ProficiencyLevel.Intermediate]: 1000,
    [ProficiencyLevel.Advanced]: 3000,
};

export const XP_PER_SCORE_POINT = 1.5;
// --- End XP System ---

// Game Activity Icons
const GAME_ICONS = {
    WORD_HUNT: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>`,
    LISTEN_MATCH: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m12 0v-1.5a6 6 0 00-6-6v0a6 6 0 00-6 6v1.5" /><path stroke-linecap="round" stroke-linejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" /></svg>`,
    SPEAK_THE_WORD: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>`,
    SENTENCE_SCRAMBLE: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" /></svg>`,
    ROLEPLAY_BATTLE: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72 3.72a.75.75 0 01-1.06 0l-3.72-3.72h-1.465a2.122 2.122 0 01-2.122-2.122v-4.286c0-.97.616-1.813 1.5-2.097M15.75 8.19v-2.19a2.122 2.122 0 00-2.122-2.122h-4.286c-.97 0-1.813.616-2.097 1.5M12 9.75a3 3 0 100-6 3 3 0 000 6z" /></svg>`,
    CLUSTER_SEARCH: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>`,
};

const HINDI_LESSONS: LessonTemplate[] = [
    {
        id: 1,
        title: "The Arrival",
        level: 'Beginner',
        scenario: "You've just arrived in a bustling new city! Your first mission is to find your way from the airport to the train station. You'll need to understand signs and basic directions.",
        mapPosition: { x: '10%', y: '50%' },
        activities: [
            {
                type: 'LISTEN_MATCH',
                title: 'Find the Station',
                icon: GAME_ICONS.LISTEN_MATCH,
                data: {
                    questions: [
                        { audioText: 'रेलवे स्टेशन', options: ['Hospital', 'Train Station', 'Market', 'Airport'], correctAnswer: 'Train Station' },
                        { audioText: 'सीधे जाओ', options: ['Turn Left', 'Go Straight', 'Turn Right', 'Stop'], correctAnswer: 'Go Straight' },
                        { audioText: 'यह कितनी दूर है?', options: ["What's the time?", 'How are you?', 'How far is it?', 'How much is this?'], correctAnswer: 'How far is it?' },
                    ]
                }
            },
        ]
    },
    {
        id: 2,
        title: "A Tasty Meal",
        level: 'Beginner',
        scenario: "You made it to the city center, and you're hungry. Time to visit a local café and order some delicious food. Try to pronounce the names of the dishes correctly!",
        mapPosition: { x: '35%', y: '30%' },
        activities: [
            {
                type: 'SPEAK_THE_WORD',
                title: 'Order at the Café',
                icon: GAME_ICONS.SPEAK_THE_WORD,
                data: { phrases: ['समोसा', 'चाय', 'पानी', 'एक प्लेट छोले भटूरे'] }
            }
        ]
    },
    {
        id: 3,
        title: "Market Banter",
        level: 'Intermediate',
        scenario: "You're exploring a vibrant market. A friendly shopkeeper starts a conversation with you. Try to respond fluently and impress them with your speaking skills!",
        mapPosition: { x: '60%', y: '70%' },
        activities: [
            {
                type: 'ROLEPLAY_BATTLE',
                title: 'Speak to Win!',
                icon: GAME_ICONS.ROLEPLAY_BATTLE,
                data: {
                    character: 'a friendly shopkeeper',
                    prompt: "Welcome to my shop! I have the best spices in the city. What are you looking for today?",
                }
            }
        ]
    },
    {
        id: 4,
        title: "Festival Plans",
        level: 'Advanced',
        scenario: "Your new friend needs help writing an invitation for the upcoming Diwali festival. This is a great chance to practice your writing and sentence structure.",
        mapPosition: { x: '85%', y: '50%' },
        activities: [
            {
                type: 'SENTENCE_SCRAMBLE',
                title: 'Write the Invitation',
                icon: GAME_ICONS.SENTENCE_SCRAMBLE,
                data: { sentence: 'आप दिवाली पार्टी में आमंत्रित हैं' } // You are invited to the Diwali party
            }
        ]
    }
];

const KANNADA_LESSONS: LessonTemplate[] = [
    {
        id: 1,
        title: "Basic Greetings",
        level: 'Beginner',
        scenario: "You're meeting a new friend in Bengaluru. Start by learning the most important greetings to make a great first impression!",
        mapPosition: { x: '15%', y: '50%' },
        activities: [
             {
                type: 'SPEAK_THE_WORD',
                title: 'Practice Greetings',
                icon: GAME_ICONS.SPEAK_THE_WORD,
                data: { phrases: ['ನಮಸ್ಕಾರ', 'ಧನ್ಯವಾದಗಳು'] }
            }
        ]
    },
    {
        id: 2,
        title: "Find the Letter",
        level: 'Beginner',
        scenario: "Quick! Time to test your recognition skills. Find the correct letter as fast as you can to earn bonus points.",
        mapPosition: { x: '40%', y: '30%' },
        activities: [
            {
                type: 'CLUSTER_SEARCH',
                title: 'Letter Hunt: ಅ',
                icon: GAME_ICONS.CLUSTER_SEARCH,
                data: {
                    promptEnglish: 'Find the letter for "A"',
                    targetLetter: 'ಅ',
                    distractorLetters: ['ಆ', 'ಇ', 'ಈ', 'ಉ', 'ಊ', 'ಎ', 'ಏ', 'ಐ', 'ಒ', 'ಓ', 'ಔ', 'ಕ', 'ಖ', 'ಗ', 'ಘ'],
                    gridSize: 16
                }
            }
        ]
    },
    {
        id: 3,
        title: "Simple Questions",
        level: 'Beginner',
        scenario: "You're getting a bit more confident. Let's learn to understand some common questions you might hear.",
        mapPosition: { x: '60%', y: '60%' },
        activities: [
            {
                type: 'LISTEN_MATCH',
                title: 'Understand the Question',
                icon: GAME_ICONS.LISTEN_MATCH,
                data: {
                    questions: [
                        { audioText: 'ನೀವು ಹೇಗಿದ್ದೀರಾ?', options: ["What is your name?", "How are you?", "Where are you from?", "Thank you"], correctAnswer: 'How are you?' },
                        { audioText: 'ನಿಮ್ಮ ಹೆಸರೇನು?', options: ["How are you?", "What is your name?", "Where are you from?", "Goodbye"], correctAnswer: 'What is your name?' },
                        { audioText: 'ಕ್ಷಮಿಸಿ', options: ["Hello", "Yes", "Excuse me", "No"], correctAnswer: 'Excuse me' },
                    ]
                }
            }
        ]
    },
    {
        id: 4,
        title: "Numbers & Counting",
        level: 'Beginner',
        scenario: "You're at a market and need to understand prices. Let's practice listening to numbers!",
        mapPosition: { x: '75%', y: '40%' },
        activities: [
            {
                type: 'LISTEN_MATCH',
                title: 'Listen for the Number',
                icon: GAME_ICONS.LISTEN_MATCH,
                data: {
                    questions: [
                        { audioText: 'ಒಂದು', options: ["One", "Two", "Three", "Four"], correctAnswer: 'One' },
                        { audioText: 'ಐದು', options: ["Three", "Four", "Five", "Six"], correctAnswer: 'Five' },
                        { audioText: 'ಹತ್ತು', options: ["Eight", "Nine", "Ten", "Eleven"], correctAnswer: 'Ten' },
                    ]
                }
            }
        ]
    },
    {
        id: 100,
        title: "Market Day",
        level: 'Intermediate',
        scenario: "You are at a vibrant market in Mysuru. Read the description of the market and find the items being sold.",
        mapPosition: { x: '85%', y: '60%' },
        activities: [
            {
                type: 'WORD_HUNT',
                title: 'Market Finds',
                icon: GAME_ICONS.WORD_HUNT,
                data: {
                    title: 'Mysuru Market',
                    story: 'ಮೈಸೂರು ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ತಾಜಾ ಹಣ್ಣುಗಳು, ತರಕಾರಿಗಳು, ಮತ್ತು ಸುಂದರವಾದ ಹೂವುಗಳು ಮಾರಾಟವಾಗುತ್ತವೆ. ಜನರು ಬಾಳೆಹಣ್ಣು ಮತ್ತು ಮಾವಿನಹಣ್ಣುಗಳನ್ನು ಖರೀದಿಸುತ್ತಾರೆ. ಸುವಾಸನೆಯು ಅದ್ಭುತವಾಗಿದೆ.',
                    questions: [
                        { definition: 'Find the word for "market"', word: 'ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ' },
                        { definition: 'Find the word for "vegetables"', word: 'ತರಕಾರಿಗಳು' },
                        { definition: 'Find the word for "flowers"', word: 'ಹೂವುಗಳು' },
                        { definition: 'Find the word for "mangoes"', word: 'ಮಾವಿನಹಣ್ಣುಗಳನ್ನು' },
                    ]
                }
            }
        ]
    },
    {
        id: 101, // Use a distinct ID range
        title: 'Story Comprehension',
        level: 'Advanced',
        scenario: "You've advanced in your journey! Now, read a classic Kannada folk tale and test your comprehension by finding key words in the story.",
        mapPosition: { x: '95%', y: '45%' },
        activities: [
            {
                type: 'WORD_HUNT',
                title: 'Find the Key Words',
                icon: GAME_ICONS.WORD_HUNT,
                data: {
                    title: 'The Lion and the Mouse',
                    story: 'ಒಂದು ಸಿಂಹವು ಮಲಗಿತ್ತು. ಒಂದು ಇಲಿ ಅದರ ಮೇಲೆ ಆಡುತ್ತಿತ್ತು. ಸಿಂಹವು ಎಚ್ಚರಗೊಂಡು ಇಲಿಯನ್ನು ಹಿಡಿಯಿತು. "ದಯವಿಟ್ಟು ನನ್ನನ್ನು ಬಿಟ್ಟುಬಿಡಿ," ಇಲಿ ಬೇಡಿಕೊಂಡಿತು. "ಒಂದು ದಿನ ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತೇನೆ." ಸಿಂಹವು ನಕ್ಕು ಅದನ್ನು ಬಿಟ್ಟಿತು. ಕೆಲವು ದಿನಗಳ ನಂತರ, ಸಿಂಹವು ಬಲೆಯಲ್ಲಿ ಸಿಕ್ಕಿಬಿದ್ದಿತು. ಇಲಿಯು ಬಲೆಯನ್ನು ಕಡಿದು ಸಿಂಹವನ್ನು ಕಾಪಾಡಿತು.',
                    questions: [
                        { definition: 'Find the word for "lion"', word: 'ಸಿಂಹವು' },
                        { definition: 'Find the word for "mouse"', word: 'ಇಲಿ' },
                        { definition: 'Find the word for "net"', word: 'ಬಲೆಯಲ್ಲಿ' },
                        { definition: 'Find the word for "saved"', word: 'ಕಾಪಾಡಿತು' },
                    ]
                }
            }
        ]
    }
];

const TAMIL_LESSONS: LessonTemplate[] = [
    {
        id: 201,
        title: "First Vanakkam",
        level: 'Beginner',
        scenario: "You've just landed in Chennai! Learn to greet people warmly to start your adventure.",
        mapPosition: { x: '15%', y: '50%' },
        activities: [
            {
                type: 'SPEAK_THE_WORD',
                title: 'Practice Greetings',
                icon: GAME_ICONS.SPEAK_THE_WORD,
                data: { phrases: ['வணக்கம்', 'நன்றி', 'என் பெயர்...'] }
            }
        ]
    },
    {
        id: 205,
        title: "Find the Letter",
        level: 'Beginner',
        scenario: "Let's test your eyes! Find the first letter of the Tamil alphabet as quickly as you can.",
        mapPosition: { x: '35%', y: '30%' },
        activities: [
            {
                type: 'CLUSTER_SEARCH',
                title: 'Letter Hunt: அ',
                icon: GAME_ICONS.CLUSTER_SEARCH,
                data: {
                    promptEnglish: 'Find the letter for "A"',
                    targetLetter: 'அ',
                    distractorLetters: ['ஆ', 'இ', 'ஈ', 'ಉ', 'ஊ', 'எ', 'ஏ', 'ஐ', 'ஒ', 'ஓ', 'ஔ', 'க', 'ங', 'ச', 'ஞ'],
                    gridSize: 16
                }
            }
        ]
    },
    {
        id: 202,
        title: "Cafe Stop",
        level: 'Beginner',
        scenario: "Feeling hungry? Stop by a local cafe and order some classic South Indian food.",
        mapPosition: { x: '55%', y: '60%' },
        activities: [
            {
                type: 'LISTEN_MATCH',
                title: 'Order Food',
                icon: GAME_ICONS.LISTEN_MATCH,
                data: {
                    questions: [
                        { audioText: 'இட்லி', options: ['Tea', 'Idli', 'Water', 'Dosa'], correctAnswer: 'Idli' },
                        { audioText: 'தண்ணீர்', options: ['Coffee', 'Juice', 'Water', 'Milk'], correctAnswer: 'Water' },
                    ]
                }
            }
        ]
    },
    {
        id: 203,
        title: "Beach Trip",
        level: 'Intermediate',
        scenario: "You want to visit the famous Marina Beach. Ask a local for directions and have a short conversation.",
        mapPosition: { x: '75%', y: '40%' },
        activities: [
            {
                type: 'ROLEPLAY_BATTLE',
                title: 'Ask for Directions',
                icon: GAME_ICONS.ROLEPLAY_BATTLE,
                data: {
                    character: 'a helpful local',
                    prompt: "Excuse me, how can I get to Marina Beach?",
                }
            }
        ]
    },
    {
        id: 204,
        title: "Poetic Wisdom",
        level: 'Advanced',
        scenario: "Discover the wisdom of the ancient Tamil text, Thirukkural. Read a couplet and understand its meaning.",
        mapPosition: { x: '90%', y: '65%' },
        activities: [
            {
                type: 'WORD_HUNT',
                title: 'Find the Virtue',
                icon: GAME_ICONS.WORD_HUNT,
                data: {
                    title: 'Thirukkural',
                    story: 'அன்பின் வழியது உயிர்நிலை அஃதிலார்க்கு என்புதோல் போர்த்த உடம்பு.',
                    questions: [
                        { definition: 'Find the word for "love"', word: 'அன்பின்' },
                        { definition: 'Find the word for "life"', word: 'உயிர்நிலை' },
                        { definition: 'Find the word for "body"', word: 'உடம்பு' },
                    ]
                }
            }
        ]
    }
];

const TELUGU_LESSONS: LessonTemplate[] = [
    {
        id: 301,
        title: "Hyderabad Hello",
        level: 'Beginner',
        scenario: "You're in the city of pearls, Hyderabad. Learn how to introduce yourself.",
        mapPosition: { x: '15%', y: '50%' },
        activities: [
            {
                type: 'SPEAK_THE_WORD',
                title: 'Introductions',
                icon: GAME_ICONS.SPEAK_THE_WORD,
                data: { phrases: ['నమస్కారం', 'ధన్యవాదాలు', 'నా పేరు...'] }
            }
        ]
    },
    {
        id: 305,
        title: "Find the Letter",
        level: 'Beginner',
        scenario: "Challenge time! Spot the first letter of the Telugu alphabet from the grid before time runs out.",
        mapPosition: { x: '35%', y: '70%' },
        activities: [
            {
                type: 'CLUSTER_SEARCH',
                title: 'Letter Hunt: అ',
                icon: GAME_ICONS.CLUSTER_SEARCH,
                data: {
                    promptEnglish: 'Find the letter for "A"',
                    targetLetter: 'అ',
                    distractorLetters: ['ఆ', 'ఇ', 'ಈ', 'ఉ', 'ఊ', 'ఋ', 'ఎ', 'ఏ', 'ఐ', 'ఒ', 'ఓ', 'ఔ', 'క', 'ఖ', 'గ'],
                    gridSize: 16
                }
            }
        ]
    },
    {
        id: 302,
        title: "Market Visit",
        level: 'Beginner',
        scenario: "You're at a bustling Rythu Bazar. Identify the names of common vegetables.",
        mapPosition: { x: '55%', y: '40%' },
        activities: [
            {
                type: 'LISTEN_MATCH',
                title: 'Vegetable Shopping',
                icon: GAME_ICONS.LISTEN_MATCH,
                data: {
                    questions: [
                        { audioText: 'టమోటా', options: ['Onion', 'Potato', 'Tomato', 'Carrot'], correctAnswer: 'Tomato' },
                        { audioText: 'ఉల్లిపాయ', options: ['Onion', 'Garlic', 'Ginger', 'Chilli'], correctAnswer: 'Onion' },
                    ]
                }
            }
        ]
    },
    {
        id: 303,
        title: "Charminar Chat",
        level: 'Intermediate',
        scenario: "A local starts a conversation with you near the beautiful Charminar. Tell them what you think of it!",
        mapPosition: { x: '75%', y: '65%' },
        activities: [
            {
                type: 'ROLEPLAY_BATTLE',
                title: 'Talk about the view',
                icon: GAME_ICONS.ROLEPLAY_BATTLE,
                data: {
                    character: 'a fellow tourist',
                    prompt: "Charminar is so beautiful, isn't it? What do you like most about it?",
                }
            }
        ]
    },
    {
        id: 304,
        title: "Postcard from Hyderabad",
        level: 'Advanced',
        scenario: "Write a short sentence for a postcard to your friend about your visit.",
        mapPosition: { x: '90%', y: '50%' },
        activities: [
            {
                type: 'SENTENCE_SCRAMBLE',
                title: 'Write a Postcard',
                icon: GAME_ICONS.SENTENCE_SCRAMBLE,
                data: { sentence: 'చార్మినార్ చాలా అందంగా ఉంది' } // Charminar is very beautiful
            }
        ]
    }
];

const MARATHI_LESSONS: LessonTemplate[] = [
    {
        id: 401,
        title: "Mumbai Meeting",
        level: 'Beginner',
        scenario: "Welcome to the vibrant city of Mumbai! Start by learning essential greetings.",
        mapPosition: { x: '15%', y: '50%' },
        activities: [
            {
                type: 'SPEAK_THE_WORD',
                title: 'First Words',
                icon: GAME_ICONS.SPEAK_THE_WORD,
                data: { phrases: ['नमस्कार', 'धन्यवाद', 'माफ करा'] }
            }
        ]
    },
    {
        id: 405,
        title: "Find the Letter",
        level: 'Beginner',
        scenario: "A quick challenge to sharpen your skills. Find the first letter of the Devanagari script used in Marathi.",
        mapPosition: { x: '35%', y: '30%' },
        activities: [
            {
                type: 'CLUSTER_SEARCH',
                title: 'Letter Hunt: अ',
                icon: GAME_ICONS.CLUSTER_SEARCH,
                data: {
                    promptEnglish: 'Find the letter for "A"',
                    targetLetter: 'अ',
                    distractorLetters: ['आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ', 'क', 'ख', 'ग', 'घ', 'ङ'],
                    gridSize: 16
                }
            }
        ]
    },
    {
        id: 402,
        title: "Street Food Craving",
        level: 'Beginner',
        scenario: "You can't be in Mumbai and not try Vada Pav! Order one from a street vendor.",
        mapPosition: { x: '55%', y: '65%' },
        activities: [
            {
                type: 'LISTEN_MATCH',
                title: 'Order Vada Pav',
                icon: GAME_ICONS.LISTEN_MATCH,
                data: {
                    questions: [
                        { audioText: 'एक वडा पाव', options: ['Two Samosas', 'One Vada Pav', 'Tea', 'Water'], correctAnswer: 'One Vada Pav' },
                        { audioText: 'चहा', options: ['Coffee', 'Juice', 'Water', 'Tea'], correctAnswer: 'Tea' },
                    ]
                }
            }
        ]
    },
    {
        id: 403,
        title: "Festival Joy",
        level: 'Intermediate',
        scenario: "It's Ganesh Chaturthi! Talk to a local about the festival celebrations.",
        mapPosition: { x: '75%', y: '40%' },
        activities: [
            {
                type: 'ROLEPLAY_BATTLE',
                title: 'Festival Chat',
                icon: GAME_ICONS.ROLEPLAY_BATTLE,
                data: {
                    character: 'a friendly local',
                    prompt: "The Ganesh festival is so lively here! Are you enjoying the celebrations?",
                }
            }
        ]
    },
    {
        id: 404,
        title: "Gateway Story",
        level: 'Advanced',
        scenario: "Read a short passage about the Gateway of India and find key historical words.",
        mapPosition: { x: '90%', y: '55%' },
        activities: [
            {
                type: 'WORD_HUNT',
                title: 'Historical Hunt',
                icon: GAME_ICONS.WORD_HUNT,
                data: {
                    title: 'Gateway of India',
                    story: 'गेटवे ऑफ इंडिया मुंबईतील एक प्रसिद्ध स्मारक आहे. हे समुद्राच्या किनारी आहे. राजा जॉर्ज पंचम यांच्या स्वागतासाठी हे बांधले गेले.',
                    questions: [
                        { definition: 'Find the word for "monument"', word: 'स्मारक' },
                        { definition: 'Find the word for "sea"', word: 'समुद्राच्या' },
                        { definition: 'Find the word for "king"', word: 'राजा' },
                    ]
                }
            }
        ]
    }
];

const MALAYALAM_LESSONS: LessonTemplate[] = [
    {
        id: 501,
        title: "Kerala Greetings",
        level: 'Beginner',
        scenario: "You've arrived in the serene backwaters of Kerala. Greet the friendly locals.",
        mapPosition: { x: '15%', y: '60%' },
        activities: [
            {
                type: 'SPEAK_THE_WORD',
                title: 'Polite Greetings',
                icon: GAME_ICONS.SPEAK_THE_WORD,
                data: { phrases: ['നമസ്കാരം', 'നന്ദി', 'എൻ്റെ പേര്...'] }
            }
        ]
    },
    {
        id: 505,
        title: "Find the Letter",
        level: 'Beginner',
        scenario: "Time for a quick test! Find the first letter of the Malayalam alphabet in the grid.",
        mapPosition: { x: '35%', y: '40%' },
        activities: [
            {
                type: 'CLUSTER_SEARCH',
                title: 'Letter Hunt: അ',
                icon: GAME_ICONS.CLUSTER_SEARCH,
                data: {
                    promptEnglish: 'Find the letter for "A"',
                    targetLetter: 'അ',
                    distractorLetters: ['ആ', 'ഇ', 'ഈ', 'ഉ', 'ഊ', 'ഋ', 'എ', 'ഏ', 'ഐ', 'ഒ', 'ഓ', 'ഔ', 'ക', 'ಖ', 'ഗ'],
                    gridSize: 16
                }
            }
        ]
    },
    {
        id: 502,
        title: "Tea Shop Talk",
        level: 'Beginner',
        scenario: "Stop at a traditional 'Chaya Kada' (tea shop) for a refreshing cup of tea.",
        mapPosition: { x: '55%', y: '70%' },
        activities: [
            {
                type: 'LISTEN_MATCH',
                title: 'At the Chaya Kada',
                icon: GAME_ICONS.LISTEN_MATCH,
                data: {
                    questions: [
                        { audioText: 'ചായ', options: ['Coffee', 'Tea', 'Water', 'Juice'], correctAnswer: 'Tea' },
                        { audioText: 'കാപ്പി', options: ['Tea', 'Milk', 'Coffee', 'Sugar'], correctAnswer: 'Coffee' },
                    ]
                }
            }
        ]
    },
    {
        id: 503,
        title: "Backwater Conversation",
        level: 'Intermediate',
        scenario: "While on a houseboat, you strike up a conversation with the guide. Ask them about the beautiful scenery.",
        mapPosition: { x: '75%', y: '50%' },
        activities: [
            {
                type: 'ROLEPLAY_BATTLE',
                title: 'Houseboat Chat',
                icon: GAME_ICONS.ROLEPLAY_BATTLE,
                data: {
                    character: 'a houseboat guide',
                    prompt: "The backwaters are so peaceful. What would you like to know about this place?",
                }
            }
        ]
    },
    {
        id: 504,
        title: "Local Wisdom",
        level: 'Advanced',
        scenario: "Read a Malayalam proverb and understand its meaning by identifying key vocabulary.",
        mapPosition: { x: '90%', y: '65%' },
        activities: [
            {
                type: 'WORD_HUNT',
                title: 'Proverb Hunt',
                icon: GAME_ICONS.WORD_HUNT,
                data: {
                    title: 'A Malayalam Proverb',
                    story: 'അറിവേ ശക്തി. നല്ല വാക്ക് അമൃത് പോലെയാണ്. ഐക്യമത്യം മഹാബലം.',
                    questions: [
                        { definition: 'Find the word for "knowledge"', word: 'അറിവേ' },
                        { definition: 'Find the word for "power/strength"', word: 'ശക്തി' },
                        { definition: 'Find the word for "unity"', word: 'ഐക്യമത്യം' },
                    ]
                }
            }
        ]
    }
];

export const LESSON_TEMPLATES: { [languageCode: string]: LessonTemplate[] } = {
    'hi': HINDI_LESSONS,
    'kn': KANNADA_LESSONS,
    'ta': TAMIL_LESSONS,
    'te': TELUGU_LESSONS,
    'mr': MARATHI_LESSONS,
    'ml': MALAYALAM_LESSONS,
};


// Pronunciation Phrases
export const PHRASES: Record<string, Partial<Record<ProficiencyLevel, string[]>>> = {
    'kn': {
        [ProficiencyLevel.Beginner]: [ 'ನಮಸ್ಕಾರ', 'ನೀವು ಹೇಗಿದ್ದೀರಾ?', 'ನನ್ನ ಹೆಸರು...', 'ಧನ್ಯವಾದಗಳು', 'ಕ್ಷಮಿಸಿ' ],
        [ProficiencyLevel.Intermediate]: [ 'ಇದು ಎಷ್ಟು?', 'ಶುಭ ದಿನ', 'ನಾನು ಕನ್ನಡ ಕಲಿಯುತ್ತಿದ್ದೇನೆ', 'ನಿಮ್ಮ ಊರು ಯಾವುದು?' ],
        [ProficiencyLevel.Advanced]: [ 'ಕರ್ನಾಟಕದ ಇತಿಹಾಸ ಮತ್ತು ಸಂಸ್ಕೃತಿ ಬಹಳ ಶ್ರೀಮಂತವಾಗಿದೆ।', 'ನಾವು ಪರಿಸರವನ್ನು ಸಂರಕ್ಷಿಸುವುದು ನಮ್ಮೆಲ್ಲರ ಕರ್ತವ್ಯ।' ],
    },
    'hi': {
        [ProficiencyLevel.Beginner]: [ 'नमस्ते', 'आप कैसे हैं?', 'मेरा नाम है...', 'धन्यवाद', 'माफ़ कीजिये' ],
        [ProficiencyLevel.Intermediate]: [ 'यह कितने का है?', 'आपका दिन शुभ हो', 'मैं हिन्दी सीख रहा हूँ।', 'आप कहाँ से हैं?' ],
        [ProficiencyLevel.Advanced]: [ 'भारत एक विविधतापूर्ण देश है जिसकी संस्कृति बहुत समृद्ध है।', 'ग्लोबल वार्मिंग पूरी दुनिया के लिए एक गंभीर चिंता का विषय है।' ],
    },
    'ta': {
        [ProficiencyLevel.Beginner]: [ 'வணக்கம்', 'நீங்கள் எப்படி இருக்கிறீர்கள்?', 'என் பெயர்...', 'நன்றி', 'மன்னிக்கவும்', 'இது எவ்வளவு?', 'நல்ல நாள்' ],
        [ProficiencyLevel.Intermediate]: ['தமிழ் மொழி மிகவும் இனிமையானது.'],
        [ProficiencyLevel.Advanced]: [ 'தமிழ் மொழி உலகின் பழமையான மொழிகளில் ஒன்றாகும்.' ],
    },
    'te': {
        [ProficiencyLevel.Beginner]: [ 'నమస్కారం', 'మీరు ఎలా ఉన్నారు?', 'నా పేరు...', 'ధన్యవాదాలు', 'క్షమించండి', 'ఇది ఎంత?', 'మంచి రోజు' ],
        [ProficiencyLevel.Intermediate]: [],
        [ProficiencyLevel.Advanced]: [],
    },
    'mr': {
        [ProficiencyLevel.Beginner]: [ 'नमस्कार', 'तुम्ही कसे आहात?', 'माझं नाव...', 'धन्यवाद', 'माफ करा', 'हे किती आहे?', 'तुमचा दिवस चांगला जावो' ],
        [ProficiencyLevel.Intermediate]: [],
        [ProficiencyLevel.Advanced]: [],
    },
    'ml': {
        [ProficiencyLevel.Beginner]: [ 'നമസ്കാരം', 'സുഖമാണോ?', 'എന്റെ പേര്...', 'നന്ദി', 'ക്ഷമിക്കണം', 'ഇതിന് എന്ത് വിലയാണ്?', 'ഒരു നല്ല ദിനം ആശംസിക്കുന്നു' ],
        [ProficiencyLevel.Intermediate]: [],
        [ProficiencyLevel.Advanced]: [],
    },
    'en': {
        [ProficiencyLevel.Beginner]: [ 'Hello', 'How are you?', 'My name is...', 'Thank you', 'Excuse me' ],
        [ProficiencyLevel.Intermediate]: [ 'How much is this?', 'Have a good day', 'I am learning English', 'Where are you from?' ],
        [ProficiencyLevel.Advanced]: [ 'The history and culture of this place is very rich.', 'It is our duty to protect the environment.' ],
    }
};

export const ALPHABET_DATA: { [languageCode: string]: AlphabetCharacter[] } = {
    'kn': [
        // Vowels (ಸ್ವರಗಳು)
        { character: 'ಅ', transliteration: 'a', sound: 'ಅ' }, { character: 'ಆ', transliteration: 'ā', sound: 'ಆ' },
        { character: 'ಇ', transliteration: 'i', sound: 'ಇ' }, { character: 'ಈ', transliteration: 'ī', sound: 'ಈ' },
        { character: 'ಉ', transliteration: 'u', sound: 'ಉ' }, { character: 'ಊ', transliteration: 'ū', sound: 'ಊ' },
        { character: 'ಋ', transliteration: 'ṛu', sound: 'ಋ' }, { character: 'ೠ', transliteration: 'ṝu', sound: 'ೠ' },
        { character: 'ಎ', transliteration: 'e', sound: 'ಎ' }, { character: 'ಏ', transliteration: 'ē', sound: 'ಏ' },
        { character: 'ಐ', transliteration: 'ai', sound: 'ಐ' }, { character: 'ಒ', transliteration: 'o', sound: 'ಒ' },
        { character: 'ಓ', transliteration: 'ō', sound: 'ಓ' }, { character: 'ಔ', transliteration: 'au', sound: 'ಔ' },
        // Consonants (ವ್ಯಂಜನಗಳು)
        { character: 'ಕ', transliteration: 'ka', sound: 'ಕ' }, { character: 'ಖ', transliteration: 'kha', sound: 'ಖ' },
        { character: 'ಗ', transliteration: 'ga', sound: 'ಗ' }, { character: 'ಘ', transliteration: 'gha', sound: 'ಘ' },
        { character: 'ಙ', transliteration: 'ṅa', sound: 'ಙ' }, { character: 'ಚ', transliteration: 'ca', sound: 'ಚ' },
        { character: 'ಛ', transliteration: 'cha', sound: 'ಛ' }, { character: 'ಜ', transliteration: 'ja', sound: 'ಜ' },
        { character: 'ಝ', transliteration: 'jha', sound: 'ಝ' }, { character: 'ಞ', transliteration: 'ña', sound: 'ಞ' },
        { character: 'ಟ', transliteration: 'ṭa', sound: 'ಟ' }, { character: 'ಠ', transliteration: 'ṭha', sound: 'ಠ' },
        { character: 'ಡ', transliteration: 'ḍa', sound: 'ಡ' }, { character: 'ಢ', transliteration: 'ḍha', sound: 'ಢ' },
        { character: 'ಣ', transliteration: 'ṇa', sound: 'ಣ' }, { character: 'ತ', transliteration: 'ta', sound: 'ತ' },
        { character: 'ಥ', transliteration: 'tha', sound: 'ಥ' }, { character: 'ದ', transliteration: 'da', sound: 'ದ' },
        { character: 'ಧ', transliteration: 'dha', sound: 'ಧ' }, { character: 'ನ', transliteration: 'na', sound: 'ನ' },
        { character: 'ಪ', transliteration: 'pa', sound: 'ಪ' }, { character: 'ಫ', transliteration: 'pha', sound: 'ಫ' },
        { character: 'ಬ', transliteration: 'ba', sound: 'ಬ' }, { character: 'ಭ', transliteration: 'bha', sound: 'ಭ' },
        { character: 'ಮ', transliteration: 'ma', sound: 'ಮ' }, { character: 'ಯ', transliteration: 'ya', sound: 'ಯ' },
        { character: 'ರ', transliteration: 'ra', sound: 'ರ' }, { character: 'ಲ', transliteration: 'la', sound: 'ಲ' },
        { character: 'ವ', transliteration: 'va', sound: 'ವ' }, { character: 'ಶ', transliteration: 'śa', sound: 'ಶ' },
        { character: 'ಷ', transliteration: 'ṣa', sound: 'ಷ' }, { character: 'ಸ', transliteration: 'sa', sound: 'ಸ' },
        { character: 'ಹ', transliteration: 'ha', sound: 'ಹ' }, { character: 'ಳ', transliteration: 'ḷa', sound: 'ಳ' },
    ],
    'hi': [
        // Vowels (स्वर)
        { character: 'अ', transliteration: 'a', sound: 'अ' }, { character: 'आ', transliteration: 'ā', sound: 'आ' },
        { character: 'इ', transliteration: 'i', sound: 'इ' }, { character: 'ई', transliteration: 'ī', sound: 'ई' },
        { character: 'उ', transliteration: 'u', sound: 'उ' }, { character: 'ऊ', transliteration: 'ū', sound: 'ऊ' },
        { character: 'ऋ', transliteration: 'ṛi', sound: 'ऋ' }, { character: 'ए', transliteration: 'e', sound: 'ए' },
        { character: 'ऐ', transliteration: 'ai', sound: 'ऐ' }, { character: 'ओ', transliteration: 'o', sound: 'ओ' },
        { character: 'औ', transliteration: 'au', sound: 'औ' },
        // Consonants (व्यंजन)
        { character: 'क', transliteration: 'ka', sound: 'क' }, { character: 'ख', transliteration: 'kha', sound: 'ख' },
        { character: 'ग', transliteration: 'ga', sound: 'ग' }, { character: 'घ', transliteration: 'gha', sound: 'घ' },
        { character: 'ङ', transliteration: 'ṅa', sound: 'ङ' }, { character: 'च', transliteration: 'ca', sound: 'च' },
        { character: 'छ', transliteration: 'chha', sound: 'छ' }, { character: 'ज', transliteration: 'ja', sound: 'ज' },
        { character: 'झ', transliteration: 'jha', sound: 'झ' }, { character: 'ञ', transliteration: 'ña', sound: 'ञ' },
        { character: 'ट', transliteration: 'ṭa', sound: 'ट' }, { character: 'ठ', transliteration: 'ṭha', sound: 'ठ' },
        { character: 'ड', transliteration: 'ḍa', sound: 'ड' }, { character: 'ढ', transliteration: 'ḍha', sound: 'ढ' },
        { character: 'ण', transliteration: 'ṇa', sound: 'ण' }, { character: 'त', transliteration: 'ta', sound: 'त' },
        { character: 'थ', transliteration: 'tha', sound: 'थ' }, { character: 'द', transliteration: 'da', sound: 'द' },
        { character: 'ध', transliteration: 'dha', sound: 'ध' }, { character: 'न', transliteration: 'na', sound: 'ನ' },
        { character: 'प', transliteration: 'pa', sound: 'प' }, { character: 'फ', transliteration: 'pha', sound: 'फ' },
        { character: 'ब', transliteration: 'ba', sound: 'ब' }, { character: 'ಭ', transliteration: 'bha', sound: 'भ' },
        { character: 'म', transliteration: 'ma', sound: 'म' }, { character: 'य', transliteration: 'ya', sound: 'य' },
        { character: 'र', transliteration: 'ra', sound: 'र' }, { character: 'ल', transliteration: 'la', sound: 'ल' },
        { character: 'व', transliteration: 'va', sound: 'व' }, { character: 'श', transliteration: 'sha', sound: 'श' },
        { character: 'ष', transliteration: 'ṣha', sound: 'ष' }, { character: 'स', transliteration: 'sa', sound: 'स' },
        { character: 'ह', transliteration: 'ha', sound: 'ह' },
    ],
    'ta': [
        // Vowels (உயிரெழுத்துக்கள்)
        { character: 'அ', transliteration: 'a', sound: 'அ' }, { character: 'ஆ', transliteration: 'ā', sound: 'ஆ' },
        { character: 'இ', transliteration: 'i', sound: 'இ' }, { character: 'ஈ', transliteration: 'ī', sound: 'ஈ' },
        { character: 'உ', transliteration: 'u', sound: 'ಉ' }, { character: 'ஊ', transliteration: 'ū', sound: 'ஊ' },
        { character: 'எ', transliteration: 'e', sound: 'எ' }, { character: 'ஏ', transliteration: 'ē', sound: 'ஏ' },
        { character: 'ஐ', transliteration: 'ai', sound: 'ಐ' }, { character: 'ஒ', transliteration: 'o', sound: 'ഒ' },
        { character: 'ஓ', transliteration: 'ō', sound: 'ஓ' }, { character: 'ஔ', transliteration: 'au', sound: 'ஔ' },
        // Consonants (மெய்யெழுத்துக்கள்)
        { character: 'க', transliteration: 'ka', sound: 'க' }, { character: 'ங', transliteration: 'ṅa', sound: 'ங' },
        { character: 'ச', transliteration: 'ca', sound: 'ச' }, { character: 'ஞ', transliteration: 'ña', sound: 'ಞ' },
        { character: 'ட', transliteration: 'ṭa', sound: 'ட' }, { character: 'ண', transliteration: 'ṇa', sound: 'ண' },
        { character: 'த', transliteration: 'ta', sound: 'த' }, { character: 'ந', transliteration: 'na', sound: 'ನ' },
        { character: 'ப', transliteration: 'pa', sound: 'ப' }, { character: 'ம', transliteration: 'ma', sound: 'म' },
        { character: 'ய', transliteration: 'ya', sound: 'ய' }, { character: 'ர', transliteration: 'ra', sound: 'ர' },
        { character: 'ல', transliteration: 'la', sound: 'ல' }, { character: 'வ', transliteration: 'va', sound: 'வ' },
        { character: 'ழ', transliteration: 'ḻa', sound: 'ழ' }, { character: 'ள', transliteration: 'ḷa', sound: 'ள' },
        { character: 'ற', transliteration: 'ṟa', sound: 'ற' }, { character: 'ன', transliteration: 'ṉa', sound: 'ன' },
        // Grantha consonants
        { character: 'ஜ', transliteration: 'ja', sound: 'ஜ' }, { character: 'ஷ', transliteration: 'ṣa', sound: 'ஷ' },
        { character: 'ஸ', transliteration: 'sa', sound: 'ஸ' }, { character: 'ஹ', transliteration: 'ha', sound: 'ஹ' },
    ],
    'te': [
        // Vowels (అచ్చులు)
        { character: 'అ', transliteration: 'a', sound: 'అ' }, { character: 'ఆ', transliteration: 'ā', sound: 'ఆ' },
        { character: 'ఇ', transliteration: 'i', sound: 'ఇ' }, { character: 'ఈ', transliteration: 'ī', sound: 'ಈ' },
        { character: 'ఉ', transliteration: 'u', sound: 'ಉ' }, { character: 'ఊ', transliteration: 'ū', sound: 'ఊ' },
        { character: 'ఋ', transliteration: 'ṛu', sound: 'ఋ' }, { character: 'ౠ', transliteration: 'ṝu', sound: 'ౠ' },
        { character: 'ಎ', transliteration: 'e', sound: 'ಎ' }, { character: 'ఏ', transliteration: 'ē', sound: 'ఏ' },
        { character: 'ಐ', transliteration: 'ai', sound: 'ಐ' }, { character: 'ఒ', transliteration: 'o', sound: 'ఒ' },
        { character: 'ఓ', transliteration: 'ō', sound: 'ಓ' }, { character: 'ఔ', transliteration: 'au', sound: 'ఔ' },
        // Consonants (హల్లులు)
        { character: 'క', transliteration: 'ka', sound: 'ಕ' }, { character: 'ఖ', transliteration: 'kha', sound: 'ఖ' },
        { character: 'గ', transliteration: 'ga', sound: 'గ' }, { character: 'ఘ', transliteration: 'gha', sound: 'ಘ' },
        { character: 'ఙ', transliteration: 'ṅa', sound: 'ఙ' }, { character: 'చ', transliteration: 'ca', sound: 'ಚ' },
        { character: 'ఛ', transliteration: 'cha', sound: 'ఛ' }, { character: 'జ', transliteration: 'ja', sound: 'ಜ' },
        { character: 'ఝ', transliteration: 'jha', sound: 'ఝ' }, { character: 'ఞ', transliteration: 'ña', sound: 'ಞ' },
        { character: 'ట', transliteration: 'ṭa', sound: 'ಟ' }, { character: 'ఠ', transliteration: 'ṭha', sound: 'ఠ' },
        { character: 'డ', transliteration: 'ḍa', sound: 'డ' }, { character: 'ఢ', transliteration: 'ḍha', sound: 'ఢ' },
        { character: 'ణ', transliteration: 'ṇa', sound: 'ಣ' }, { character: 'ತ', transliteration: 'ta', sound: 'ತ' },
        { character: 'థ', transliteration: 'tha', sound: 'థ' }, { character: 'ద', transliteration: 'da', sound: 'ದ' },
        { character: 'ధ', transliteration: 'dha', sound: 'ಧ' }, { character: 'ನ', transliteration: 'na', sound: 'ನ' },
        { character: 'ప', transliteration: 'pa', sound: 'ప' }, { character: 'ఫ', transliteration: 'pha', sound: 'ఫ' },
        { character: 'బ', transliteration: 'ba', sound: 'ಬ' }, { character: 'భ', transliteration: 'bha', sound: 'ಭ' },
        { character: 'మ', transliteration: 'ma', sound: 'మ' }, { character: 'ಯ', transliteration: 'ya', sound: 'య' },
        { character: 'ర', transliteration: 'ra', sound: 'ರ' }, { character: 'ల', transliteration: 'la', sound: 'ಲ' },
        { character: 'ವ', transliteration: 'va', sound: 'ವ' }, { character: 'ಶ', transliteration: 'śa', sound: 'ಶ' },
        { character: 'ష', transliteration: 'ṣa', sound: 'ಷ' }, { character: 'ಸ', transliteration: 'sa', sound: 'ಸ' },
        { character: 'హ', transliteration: 'ha', sound: 'ಹ' }, { character: 'ళ', transliteration: 'ḷa', sound: 'ಳ' },
        { character: 'ఱ', transliteration: 'ṟa', sound: 'ఱ' },
    ],
    'mr': [
        // Vowels (स्वर)
        { character: 'अ', transliteration: 'a', sound: 'अ' }, { character: 'आ', transliteration: 'ā', sound: 'आ' },
        { character: 'इ', transliteration: 'i', sound: 'इ' }, { character: 'ई', transliteration: 'ī', sound: 'ई' },
        { character: 'उ', transliteration: 'u', sound: 'उ' }, { character: 'ऊ', transliteration: 'ū', sound: 'ऊ' },
        { character: 'ऋ', transliteration: 'ṛu', sound: 'ऋ' }, { character: 'ए', transliteration: 'e', sound: 'ए' },
        { character: 'ऐ', transliteration: 'ai', sound: 'ऐ' }, { character: 'ओ', transliteration: 'o', sound: 'ओ' },
        { character: 'औ', transliteration: 'au', sound: 'ಔ' },
        // Consonants (व्यंजन)
        { character: 'क', transliteration: 'ka', sound: 'क' }, { character: 'ख', transliteration: 'kha', sound: 'ख' },
        { character: 'ग', transliteration: 'ga', sound: 'గ' }, { character: 'घ', transliteration: 'gha', sound: 'घ' },
        { character: 'ङ', transliteration: 'ṅa', sound: 'ङ' }, { character: 'च', transliteration: 'ca', sound: 'च' },
        { character: 'छ', transliteration: 'cha', sound: 'छ' }, { character: 'ज', transliteration: 'ja', sound: 'ज' },
        { character: 'ਝ', transliteration: 'jha', sound: 'झ' }, { character: 'ञ', transliteration: 'ña', sound: 'ಞ' },
        { character: 'ट', transliteration: 'ṭa', sound: 'ट' }, { character: 'ఠ', transliteration: 'ṭha', sound: 'ठ' },
        { character: 'ड', transliteration: 'ḍa', sound: 'ड' }, { character: 'ढ', transliteration: 'ḍha', sound: 'ढ' },
        { character: 'ण', transliteration: 'ṇa', sound: 'ण' }, { character: 'त', transliteration: 'ta', sound: 'त' },
        { character: 'थ', transliteration: 'tha', sound: 'थ' }, { character: 'द', transliteration: 'da', sound: 'द' },
        { character: 'ध', transliteration: 'dha', sound: 'ध' }, { character: 'न', transliteration: 'na', sound: 'ನ' },
        { character: 'प', transliteration: 'pa', sound: 'प' }, { character: 'फ', transliteration: 'pha', sound: 'फ' },
        { character: 'ब', transliteration: 'ba', sound: 'ब' }, { character: 'भ', transliteration: 'bha', sound: 'भ' },
        { character: 'म', transliteration: 'ma', sound: 'म' }, { character: 'य', transliteration: 'ya', sound: 'य' },
        { character: 'र', transliteration: 'ra', sound: 'र' }, { character: 'ल', transliteration: 'la', sound: 'ल' },
        { character: 'व', transliteration: 'va', sound: 'व' }, { character: 'श', transliteration: 'śa', sound: 'ശ' },
        { character: 'ष', transliteration: 'ṣa', sound: 'ष' }, { character: 'स', transliteration: 'sa', sound: 'स' },
        { character: 'ह', transliteration: 'ha', sound: 'ಹ' }, { character: 'ळ', transliteration: 'ḷa', sound: 'ಳ' },
        { character: 'क्ष', transliteration: 'kṣa', sound: 'क्ष' }, { character: 'ज्ञ', transliteration: 'jña', sound: 'ज्ञ' },
    ],
    'ml': [
        // Vowels (സ്വരങ്ങൾ)
        { character: 'അ', transliteration: 'a', sound: 'അ' }, { character: 'ആ', transliteration: 'ā', sound: 'ಆ' },
        { character: 'ഇ', transliteration: 'i', sound: 'ഇ' }, { character: 'ഈ', transliteration: 'ī', sound: 'ಈ' },
        { character: 'ഉ', transliteration: 'u', sound: 'ഉ' }, { character: 'ഊ', transliteration: 'ū', sound: 'ഊ' },
        { character: 'ഋ', transliteration: 'ṛu', sound: 'ഋ' }, { character: 'എ', transliteration: 'e', sound: 'എ' },
        { character: 'ഏ', transliteration: 'ē', sound: 'ഏ' }, { character: 'ഐ', transliteration: 'ai', sound: 'ಐ' },
        { character: 'ഒ', transliteration: 'o', sound: 'ഒ' }, { character: 'ഓ', transliteration: 'ō', sound: 'ഓ' },
        { character: 'ഔ', transliteration: 'au', sound: 'ഔ' },
        // Consonants (വ്യഞ്ജനങ്ങൾ)
        { character: 'ക', transliteration: 'ka', sound: 'ക' }, { character: 'ഖ', transliteration: 'kha', sound: 'ఖ' },
        { character: 'ഗ', transliteration: 'ga', sound: 'గ' }, { character: 'ഘ', transliteration: 'gha', sound: 'ഘ' },
        { character: 'ങ', transliteration: 'ṅa', sound: 'ങ' }, { character: 'ച', transliteration: 'ca', sound: 'ച' },
        { character: 'ഛ', transliteration: 'cha', sound: 'ഛ' }, { character: 'ജ', transliteration: 'ja', sound: 'ಜ' },
        { character: 'ഝ', transliteration: 'jha', sound: 'ഝ' }, { character: 'ഞ', transliteration: 'ña', sound: 'ഞ' },
        { character: 'ട', transliteration: 'ṭa', sound: 'ട' }, { character: 'ഠ', transliteration: 'ṭha', sound: 'ഠ' },
        { character: 'ഡ', transliteration: 'ḍa', sound: 'ഡ' }, { character: 'ഢ', transliteration: 'ḍha', sound: 'ഢ' },
        { character: 'ണ', transliteration: 'ṇa', sound: 'ണ' }, { character: 'ത', transliteration: 'ta', sound: 'ത' },
        { character: 'ഥ', transliteration: 'tha', sound: 'ഥ' }, { character: 'ദ', transliteration: 'da', sound: 'ദ' },
        { character: 'ധ', transliteration: 'dha', sound: 'ധ' }, { character: 'ന', transliteration: 'na', sound: 'ನ' },
        { character: 'പ', transliteration: 'pa', sound: 'പ' }, { character: 'ഫ', transliteration: 'pha', sound: 'ഫ' },
        { character: 'ബ', transliteration: 'ba', sound: 'ബ' }, { character: 'ഭ', transliteration: 'bha', sound: 'ഭ' },
        { character: 'മ', transliteration: 'ma', sound: 'మ' }, { character: 'യ', transliteration: 'ya', sound: 'യ' },
        { character: 'ര', transliteration: 'ra', sound: 'ര' }, { character: 'ല', transliteration: 'la', sound: 'ല' },
        { character: 'വ', transliteration: 'va', sound: 'ವ' }, { character: 'ശ', transliteration: 'śa', sound: 'ശ' },
        { character: 'ഷ', transliteration: 'ṣa', sound: 'ഷ' }, { character: 'സ', transliteration: 'sa', sound: 'സ' },
        { character: 'ഹ', transliteration: 'ha', sound: 'ಹ' }, { character: 'ള', transliteration: 'ḷa', sound: 'ಳ' },
        { character: 'ഴ', transliteration: 'ḻa', sound: 'ഴ' }, { character: 'റ', transliteration: 'ṟa', sound: 'റ' },
    ],
};