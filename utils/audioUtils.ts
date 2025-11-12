

// --- Centralized AudioContext Management ---
let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch (e) {
            console.error("AudioContext is not supported by this browser.");
            // Return a dummy object or throw an error, depending on desired graceful degradation
            throw new Error("AudioContext not supported");
        }
    }
    return audioContext;
};

// Function to initialize/resume context on user gesture
export const resumeAudioContext = async () => {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
        await ctx.resume();
    }
};

// Add a global listener to resume context on the first user interaction
if (typeof window !== 'undefined') {
    window.addEventListener('click', () => resumeAudioContext(), { once: true });
    window.addEventListener('touchend', () => resumeAudioContext(), { once: true });
}
// --- End Centralized Management ---


function decode(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
): Promise<AudioBuffer> {
    // Gemini TTS returns 24000 sample rate, 1 channel
    const sampleRate = 24000; 
    const numChannels = 1;
    
    // The raw data is 16-bit PCM
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0; // Convert to float
        }
    }
    return buffer;
}


export const playAudio = async (base64Audio: string, audioContextParam?: AudioContext, playbackRate: number = 1.0) => {
    const audioContext = audioContextParam || getAudioContext();
    if (!base64Audio || !audioContext) return;

    // Fix for browser autoplay policies: resume context if suspended.
    if (audioContext.state === 'suspended') {
        await audioContext.resume();
    }
    
    try {
        const decodedBytes = decode(base64Audio);
        const audioBuffer = await decodeAudioData(decodedBytes, audioContext);

        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.playbackRate.value = playbackRate;
        source.connect(audioContext.destination);
        source.start();
    } catch (error) {
        console.error("Failed to play audio:", error);
    }
};