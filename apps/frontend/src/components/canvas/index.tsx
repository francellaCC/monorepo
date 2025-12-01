import React, { useRef, useEffect } from 'react';
import type { IDrawAction } from '../../pages/boardGamePage/types';

interface CanvasProps {
    width?: number;
    height?: number;
    className?: string;
    selectedTool?: string;
    printLineCallback?: (line: IDrawAction[]) => void;
    currentUserDrawing?: boolean;
    newPathToDraw?: IDrawAction[];
    brushSize?: number;
    status: string;
    currentColor?: string;
}

const Canvas: React.FC<CanvasProps> = ({
    width = 800,
    height = 600,
    className,
    selectedTool,
    printLineCallback,
    currentUserDrawing,
    newPathToDraw,
    brushSize,
    status,
    currentColor
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedToolState, setSelectedToolState] = React.useState<string | null>(null);
    const [currentDrawingLine, setCurrentDrawingLine] = React.useState<IDrawAction[]>([]);

    useEffect(() => {
        console.log('Selected tool in Canvas:', selectedTool);
        setSelectedToolState(selectedTool || null);
    }, [selectedTool]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Basic setup
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
    }, [width, height]);

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.beginPath();
        ctx.moveTo(x, y);
        let coorRecord: IDrawAction[] = []
        const handleMouseMove = (e: MouseEvent) => {
            const newX = e.clientX - rect.left;
            const newY = e.clientY - rect.top;
            coorRecord.push({ x: newX, y: newY });
            ctx.lineTo(newX, newY);
            ctx.stroke();
        };

        const handleMouseUp = () => {
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseup', handleMouseUp);
            ctx.closePath();
            printLineCallback && printLineCallback(coorRecord);
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);
    };


    useEffect(() => {
        if (selectedToolState == 'ERASER_ALL') {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            // Basic setup
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);
        }
        if (selectedToolState == 'ERASER') {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            ctx.strokeStyle = '#FFFFFF'; // Set stroke color to white for erasing
            ctx.lineWidth = brushSize || 5; // Set a larger line width for erasing
        }
        if (selectedToolState == 'BRUSH') {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            ctx.strokeStyle = currentColor || '#000000';
            ctx.lineWidth = brushSize || 5;

        }
        if (selectedToolState == 'COLOR_PICKER') {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            ctx.strokeStyle = currentColor || '#000000';
            ctx.lineWidth = brushSize || 5;
        }
        // Implement tool application logic here
    }, [selectedToolState, brushSize, currentColor]);

    useEffect(() => {
        if (newPathToDraw && newPathToDraw.length > 0 && !currentUserDrawing) {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.beginPath();
            ctx.moveTo(newPathToDraw[0].x, newPathToDraw[0].y);
            newPathToDraw.forEach(point => {
                ctx.lineTo(point.x, point.y);
            });
            ctx.stroke();
            ctx.closePath();
        }
    }, [newPathToDraw, currentUserDrawing]);

    return (
        <div className='w-full h-full relative'>
            <canvas
                onMouseDown={handleMouseDown}
                ref={canvasRef}
                width={width}
                height={height}
                className={className}
                style={{ border: '1px solid #ccc' }}
            />

            {status === 'waiting' && (
                <div className="absolute inset-0 bg-gray-900/5 rounded-xl flex items-center justify-center pointer-events-none">
                    <p className="text-gray-500 text-center px-4">
                        Esperando a que inicie el juego...
                    </p>
                </div>
            )}

        </div>
    );
};

export default Canvas;