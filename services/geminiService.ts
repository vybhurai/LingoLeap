

import { GoogleGenAI, GenerateContentResponse, Chat, Type, Modality } from "@google/genai";
import { Language, HandwritingEvaluation, Syllable, FluencyScore } from "../types";

const API_KEY = process.env.API_KEY;

const ai = new GoogleGenAI({ apiKey: API_KEY! });

// Helper function to create user-friendly error messages from Gemini API errors
const getGeminiErrorMessage = (error: unknown, fallbackMessage: string): string => {
    console.error("Gemini API Error:", error);
    if (error instanceof Error && error.message.toLowerCase().includes('quota')) {
        return "The AI is currently busy due to high demand. Please try again in a few moments.";
    }
    return fallbackMessage;
};

export const getPronunciationScore = async (
    targetPhrase: string,
    userSpeech: string,
    language: Language
): Promise<{ score: number, feedback: string }> => {
    const prompt = `You are a language tutor for ${language.name}. A student is trying to say: "${targetPhrase}". They actually said: "${userSpeech}".
    Analyze the user's speech against the target phrase. Provide a pronunciation score from 0 (completely wrong) to 100 (perfect).
    Also, provide a single, concise sentence of constructive feedback in English. If they were perfect, praise them.
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: {
                            type: Type.NUMBER,
                            description: 'A score from 0 to 100 for pronunciation accuracy.'
                        },
                        feedback: {
                            type: Type.STRING,
                            description: 'Concise feedback on the pronunciation.'
                        }
                    }
                }
            }
        });
        const jsonString = response.text;
        return JSON.parse(jsonString);
    } catch (error) {
        const feedback = getGeminiErrorMessage(error, "Sorry, I couldn't process the feedback right now.");
        return { score: 0, feedback };
    }
};

export const getFluencyScore = async (
    promptContext: string,
    userSpeech: string,
    language: Language
): Promise<FluencyScore> => {
    const prompt = `You are a language competition judge for ${language.name}. A user was given a scenario prompt: "${promptContext}".
    The user responded in ${language.name}: "${userSpeech}".

    Evaluate their response on a scale of 0 to 100 for the following three criteria:
    1.  **Pronunciation**: How clear and accurate was their pronunciation?
    2.  **Fluency & Pace**: Did they speak smoothly, or was it halting and hesitant? Was the pace natural?
    3.  **Vocabulary & Relevance**: How relevant was their response to the prompt? Did they use appropriate vocabulary?

    Provide a single, concise sentence of overall constructive feedback in English.

    Finally, suggest a title for a badge they earned based on their performance. Examples: "Clear Speaker", "Fluent Conversationalist", "Creative Responder", "Hesitant Speaker".

    Your response must be a single, valid JSON object. Do not include any other text or markdown formatting.
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        pronunciation: { type: Type.NUMBER, description: "Score from 0-100 for pronunciation." },
                        fluency: { type: Type.NUMBER, description: "Score from 0-100 for fluency and pace." },
                        vocabulary: { type: Type.NUMBER, description: "Score from 0-100 for vocabulary and relevance." },
                        feedback: { type: Type.STRING, description: "A single sentence of feedback." },
                        badge: { type: Type.STRING, description: "A badge title for the user." }
                    },
                    required: ["pronunciation", "fluency", "vocabulary", "feedback", "badge"]
                }
            }
        });
        const jsonString = response.text;
        return JSON.parse(jsonString) as FluencyScore;
    } catch (error) {
        const feedback = getGeminiErrorMessage(error, "Sorry, I couldn't evaluate your speech right now.");
        return {
            pronunciation: 0,
            fluency: 0,
            vocabulary: 0,
            feedback: feedback,
            badge: 'Error'
        };
    }
};

export const getGrammarFeedback = async (
    text: string,
    language: Language
): Promise<string> => {
    const prompt = `You are a ${language.name} grammar expert. Analyze the following text for grammatical errors.
    If there are errors, provide a corrected version and a brief, clear explanation of the mistakes in English.
    If the text is grammatically correct, simply state that it is correct.
    Format your response in Markdown, using bold for the corrected sentence and bullet points for explanations.
    Text to check: "${text}"`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        return getGeminiErrorMessage(error, "Sorry, I couldn't check the grammar at this moment.");
    }
};

export const createChat = (language: Language): Chat => {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `You are *LingoGuide*, the intelligent multilingual chatbot inside the LingoLeap AI language learning platform. Your goal is to help users learn their chosen language (${language.name}) and understand how the platform works.

Your Role:
1.  **Language Tutor**: When the user wants to practice ${language.name}, act as a friendly tutor. Respond primarily in ${language.name}, keeping replies simple and encouraging.
2.  **App Guide**: When the user asks about the platform's features (e.g., "where are the games?", "how to practice speaking?") or how the AI works, explain clearly and simply. For these explanations, use English for clarity unless the user asks for the explanation in ${language.name}.
    - Key Platform Features: Speaking Practice, Writing Assistant, Conversational Chat (this module), Gamified Lessons (found in 'Reading' section), Alphabet Basics, and a Leaderboard.
3.  **Explainable AI**: Always provide a brief reason for your answers, especially for grammar or language corrections.
4.  **Tone**: Be friendly, educational, and concise (2-4 sentences).

Rules:
- If a question is unrelated to language learning or this platform, gently steer the conversation back.
- Never reveal internal system data or secrets.`,
        }
    });
};

export const translateText = async (
    text: string,
    fromLanguage: string,
    toLanguage: string
): Promise<string> => {
    const prompt = `Translate the following text from ${fromLanguage} to ${toLanguage}: "${text}"`;
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        return getGeminiErrorMessage(error, "Sorry, translation failed.");
    }
};

export const generateSpeech = async (text: string, language?: Language): Promise<string | null> => {
    try {
        const langInfo = language ? ` in ${language.name}` : '';
        // Add a clear instruction to the model to handle single characters better.
        const ttsPrompt = `Say the following character or word${langInfo}: ${text}`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: ttsPrompt }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
                },
            },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        return base64Audio || null;
    } catch (error) {
        console.error("Error generating speech:", error, { text });
        return null;
    }
};

export const evaluateHandwriting = async (
    language: Language,
    expectedCharacter: string,
    imageDataUrl: string
): Promise<HandwritingEvaluation> => {
    const systemInstruction = `You are an expert AI handwriting evaluator named "BhashaMitra-WriteCoach". Your specialty is analyzing handwritten characters from Indian languages (like Kannada, Tamil, Hindi) with a balanced and constructive evaluation process.

Your primary function is to:
1.  **Analyze Critically**: Scrutinize the provided high-contrast, black-and-white image of a handwritten character. Compare it meticulously against the standard, typographically correct form of the character.
2.  **Evaluate Key Aspects**: Your analysis must cover these specific points:
    *   **Shape & Proportions**: Is the overall shape correct? Are the different parts of the character proportional?
    *   **Stroke Order & Direction**: Does the writing appear to follow the conventional stroke order?
    *   **Line Quality**: Are the lines smooth or shaky?
    *   **Completeness**: Are all required parts of the character present?
3.  **Score Fairly**: Your scoring should accurately reflect the quality of the writing while still being encouraging. The goal is to identify errors and guide the user to improve. Your score should feel fair and motivating.
    *   **Scoring Guide**:
        *   **90-100**: Excellent. Very close to the ideal form, with clean strokes. Minor imperfections are acceptable.
        *   **70-89**: Good. The character is correct and easily recognizable, but has noticeable flaws in shape, proportion, or stroke consistency.
        *   **50-69**: Fair. The character is recognizable but has significant structural errors. It's a good attempt that needs clear correction.
        *   **20-49**: Needs Improvement. The character is difficult to recognize due to major flaws.
        *   **0-19**: Try Again. The attempt is unrecognizable or is a completely different character.
4.  **Provide Actionable Feedback**: Give clear, constructive feedback that helps the user understand their specific mistakes and how to correct them.
5.  **Output in JSON**: Your entire response must be a single, valid JSON object matching the provided schema.

Behavioral Mandates:
-   **Positive Reinforcement**: Always start feedback with encouragement. Acknowledge the user's effort before pointing out areas for improvement.
-   **Be Specific but Gentle**: Frame feedback constructively. Instead of "the curve is wrong," say "The main curve needs to be more open to match the correct form."
-   **Prioritize Major Errors**: Address the most significant structural error first in your feedback.
-   **Maintain a Coaching Tone**: Your tone must be that of a helpful and patient coach, providing fair and motivational guidance.`;

    const prompt = `Evaluate the user's handwriting in the provided image.
- Language: "${language.name}"
- Expected Character/Word: "${expectedCharacter}"
- Context: "Writing Practice"`;

    const base64Data = imageDataUrl.split(',')[1];
    if (!base64Data) {
        return {
            writing_score: "0",
            visual_feedback: "Invalid image data.",
            stroke_feedback: "Could not process the drawing.",
            encouragement: "Please try drawing the character again.",
            suggestion: "Ensure the canvas is not empty before evaluating.",
            next_step: "Clear the canvas and retry."
        };
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: {
                parts: [
                    { text: prompt },
                    {
                        inlineData: {
                            mimeType: 'image/png',
                            data: base64Data,
                        },
                    },
                ]
            },
            config: {
                systemInstruction,
                temperature: 0.4, // Increased for more balanced and nuanced feedback
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        writing_score: { type: Type.STRING, description: "<0-100 based on similarity>" },
                        visual_feedback: { type: Type.STRING, description: "<short description of areas that need improvement>" },
                        stroke_feedback: { type: Type.STRING, description: "<comments on line direction, spacing, curvature>" },
                        encouragement: { type: Type.STRING, description: "<motivating feedback>" },
                        suggestion: { type: Type.STRING, description: "<short instruction to correct the writing>" },
                        next_step: { type: Type.STRING, description: "<what to practice next>" },
                    },
                    required: ["writing_score", "visual_feedback", "stroke_feedback", "encouragement", "suggestion", "next_step"]
                }
            }
        });
        const jsonString = response.text;
        return JSON.parse(jsonString) as HandwritingEvaluation;
    } catch (error) {
        const errorMessage = getGeminiErrorMessage(error, "Sorry, I couldn't evaluate your handwriting right now.");
        return {
            writing_score: "0",
            visual_feedback: "An error occurred during evaluation.",
            stroke_feedback: "The AI model could not process the request.",
            encouragement: errorMessage,
            suggestion: "Please check your connection and try again later.",
            next_step: "Retry the evaluation."
        };
    }
};

export const getSyllableBreakdown = async (
    phrase: string,
    language: Language
): Promise<Syllable[] | null> => {
    let specializedInstructions = '';
    let examples = '';

    if (language.code === 'en') {
        specializedInstructions = `For the 'transliteration', provide a simple, phonetic spelling to help with pronunciation. For the 'syllable', provide the corresponding part of the original word.`;
        examples = `
    Examples for English:
    - Phrase: "Hello" -> Correct output: [{"syllable": "Hel", "transliteration": "Heh"}, {"syllable": "lo", "transliteration": "loh"}]
    - Phrase: "environment" -> Correct output: [{"syllable": "en", "transliteration": "en"}, {"syllable": "vi", "transliteration": "vy"}, {"syllable": "ron", "transliteration": "ruhn"}, {"syllable": "ment", "transliteration": "ment"}]
    - Phrase: "Where are you from" -> Correct output: [{"syllable": "Where", "transliteration": "Wair"}, {"syllable": "are", "transliteration": "ar"}, {"syllable": "you", "transliteration": "yoo"}, {"syllable": "from", "transliteration": "from"}]
    `;
    } else {
        specializedInstructions = `Combine consonants with vowels (matras) and consonant clusters to form meaningful phonetic units. Provide a simple, easy-to-read English transliteration for each syllable.`;
        examples = `
    Examples for Kannada (as a guide for other Indian languages):
    - Phrase: "ನಮಸ್ಕಾರ" -> Correct output: [{"syllable": "ನ", "transliteration": "Na"}, {"syllable": "ಮ", "transliteration": "ma"}, {"syllable": "ಸ್ಕಾ", "transliteration": "skaa"}, {"syllable": "ರ", "transliteration": "ra"}]
    - Phrase: "ಧನ್ಯವಾದಗಳು" -> Correct output: [{"syllable": "ಧನ್", "transliteration": "Dhan"}, {"syllable": "ಯ", "transliteration": "ya"}, {"syllable": "ವಾ", "transliteration": "vaa"}, {"syllable": "ದ", "transliteration": "da"}, {"syllable": "ಗ", "transliteration": "ga"}, {"syllable": "ಳು", "transliteration": "lu"}]
        `;
    }

    const prompt = `You are a linguistic expert specializing in the phonology of ${language.name}. Your task is to segment the given phrase into its constituent pronounceable syllables and provide an English transliteration for each.

Instructions:
1. A syllable is a unit of pronunciation having one vowel sound, with or without surrounding consonants.
2. For phrases with multiple words, break down each word into syllables, but return a single flat array for the whole phrase.
3. Do NOT break down into individual letters unless a single character is a syllable.
4. ${specializedInstructions}
5. The output MUST be a valid JSON array of objects. Each object must have two keys: "syllable" (the original script part) and "transliteration" (the English text). Provide NO other text or explanation.

${examples}

Phrase to process: "${phrase}"`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            syllable: {
                                type: Type.STRING,
                                description: "The syllable in its original script."
                            },
                            transliteration: {
                                type: Type.STRING,
                                description: "The English transliteration of the syllable."
                            }
                        },
                        required: ["syllable", "transliteration"]
                    }
                }
            }
        });
        const jsonString = response.text;
        return JSON.parse(jsonString);
    } catch (error) {
        const errorMessage = getGeminiErrorMessage(error, "Sorry, couldn't break down the phrase.");
        return [{ syllable: errorMessage, transliteration: "Error" }];
    }
};