
import React, { useRef, useEffect, useState } from 'react';

interface HandwritingCanvasProps {
    onDrawingChange: (hasDrawing: boolean) => void;
    canvasRef: React.RefObject<HTMLCanvasElement>;
}

const HandwritingCanvas: React.FC<HandwritingCanvasProps> = ({ onDrawingChange, canvasRef }) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const setCanvasDimensions = () => {
            const scale = window.devicePixelRatio;
            canvas.width = canvas.offsetWidth * scale;
            canvas.height = canvas.offsetHeight * scale;
            
            const context = canvas.getContext('2d');
            if (!context) return;
            
            context.scale(scale, scale);
            context.lineCap = 'round';
            context.strokeStyle = '#374151'; // gray-700
            context.lineWidth = 4;
            contextRef.current = context;
        }

        setCanvasDimensions();
        
        window.addEventListener('resize', setCanvasDimensions);
        return () => window.removeEventListener('resize', setCanvasDimensions);

    }, [canvasRef]);

    const getCoords = (event: MouseEvent | Touch): { x: number; y: number } => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in event ? (event as unknown as TouchEvent).touches[0].clientX : (event as MouseEvent).clientX;
        const clientY = 'touches' in event ? (event as unknown as TouchEvent).touches[0].clientY : (event as MouseEvent).clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top,
        };
    };

    const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
        event.preventDefault();
        const { x, y } = getCoords(event.nativeEvent as MouseEvent | Touch);
        contextRef.current?.beginPath();
        contextRef.current?.moveTo(x, y);
        setIsDrawing(true);
    };

    const finishDrawing = (event: React.MouseEvent | React.TouchEvent) => {
        event.preventDefault();
        contextRef.current?.closePath();
        setIsDrawing(false);
    };

    const draw = (event: React.MouseEvent | React.TouchEvent) => {
        event.preventDefault();
        if (!isDrawing) return;
        const { x, y } = getCoords(event.nativeEvent as MouseEvent | Touch);
        contextRef.current?.lineTo(x, y);
        contextRef.current?.stroke();
        onDrawingChange(true);
    };
    
    return (
        <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseMove={draw}
            onMouseLeave={finishDrawing}
            onTouchStart={startDrawing}
            onTouchEnd={finishDrawing}
            onTouchMove={draw}
            className="w-full h-64 bg-slate-100 rounded-md cursor-crosshair touch-none border border-slate-300"
        />
    );
};

export default HandwritingCanvas;