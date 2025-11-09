import React from 'react';

interface PaintToolProps {
    onToolSelect?: (tool: string) => void;
}

const PaintTool: React.FC<PaintToolProps> = ({ onToolSelect }) => {
    const handleToolSelect = (tool: string) => {
        if (onToolSelect) {
            onToolSelect(tool);
            if (tool === 'ERASER_ALL'){
                setTimeout(() => {
                    onToolSelect('NONE');
                }, 10);
                }
        }
    }
    return (
        <div className="paint-tool gap-2 p-2 border border-gray-300 rounded">
            <button className='btn' onClick={() => handleToolSelect('BRUSH')}>Brush</button>
            <button className='btn' onClick={() => handleToolSelect('ERASER')}>Eraser</button>
            <button className='btn' onClick={() => handleToolSelect('ERASER_ALL')}>Eraser All</button>
            <button className='btn' onClick={() => handleToolSelect('COLOR_PICKER')}>Color Picker</button>
        </div>
    );
};

export default PaintTool;