import React, { useRef, useEffect } from 'react';

interface CanvasProps {
    width?: number;
    height?: number;
    className?: string;
}

const Canvas: React.FC<CanvasProps> = ({ 
    width = 800, 
    height = 600, 
    className 
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

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
        
        const handleMouseMove = (e: MouseEvent) => {
            const newX = e.clientX - rect.left;
            const newY = e.clientY - rect.top;
            
            ctx.lineTo(newX, newY);
            ctx.stroke();
        };
        
        const handleMouseUp = () => {
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseup', handleMouseUp);
        };
        
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);
    };


    return (
        <canvas
            onMouseDown={handleMouseDown}
            ref={canvasRef}
            width={width}
            height={height}
            className={className}
            style={{ border: '1px solid #ccc' }}
        />
    );
};

export default Canvas;