
import { useState, useRef, useCallback, useEffect } from 'react';

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
}

interface SpeechRecognitionAlternative {
    transcript: string;
}

interface SpeechRecognitionResult {
    isFinal: boolean;
    [index: number]: SpeechRecognitionAlternative;
    length: number;
}

interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult;
    length: number;
}


interface SpeechRecognitionEvent extends Event {
    resultIndex: number;
    results: SpeechRecognitionResultList;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    onend: () => void;
}

declare global {
    interface Window {
        SpeechRecognition: { new(): SpeechRecognition };
        webkitSpeechRecognition: { new(): SpeechRecognition };
    }
}

interface SpeechRecognitionHook {
    transcript: string;
    isListening: boolean;
    error: string | null;
    startListening: (lang: string) => void;
    stopListening: () => void;
    // FIX: Added clearTranscript to the hook's type definition.
    clearTranscript: () => void;
}

const getSpeechRecognition = (): { new(): SpeechRecognition } | null => {
    if (typeof window !== 'undefined') {
        return window.SpeechRecognition || window.webkitSpeechRecognition;
    }
    return null;
};

const SpeechRecognitionAPI = getSpeechRecognition();

export const useSpeechRecognition = (): SpeechRecognitionHook => {
    const [transcript, setTranscript] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const recognitionRef = useRef<SpeechRecognition | null>(null);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }, []);
    
    // FIX: Implemented the clearTranscript function.
    const clearTranscript = useCallback(() => {
        setTranscript('');
    }, []);

    useEffect(() => {
        if (!SpeechRecognitionAPI) {
            setError("Speech recognition is not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognitionAPI();
        // Set continuous to false to capture single utterances.
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let finalTranscript = '';
            let interimTranscript = '';
            
            for (let i = 0; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
             // Show interim results while speaking, then the final result.
            setTranscript(finalTranscript || interimTranscript);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            setError(`Speech recognition error: ${event.error}`);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };
        
        recognitionRef.current = recognition;

        return () => {
            recognition.stop();
        };
    }, []);

    const startListening = useCallback((lang: string) => {
        if (recognitionRef.current && !isListening) {
            setTranscript('');
            setError(null);
            recognitionRef.current.lang = lang;
            recognitionRef.current.start();
            setIsListening(true);
        }
    }, [isListening]);

    // FIX: Added clearTranscript to the returned object.
    return { transcript, isListening, error, startListening, stopListening, clearTranscript };
};
