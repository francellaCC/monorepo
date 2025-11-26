import { Eraser, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

interface PaintToolProps {
    onToolSelect?: (tool: string) => void;
    currentColor: string;
    onColorChange: (color: string) => void;
    brushSize: number;
    onBrushSizeChange: (size: number) => void;
    onClear: () => void;
    onErase: () => void;
    isErasing: boolean;
}

const colors = [
    '#000000',
    '#FFFFFF',
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#FFA07A',
    '#98D8C8',
    '#F7B731',
    '#5F27CD',
    '#FF9FF3',
    '#54A0FF',
    '#48DBFB',
    '#1DD1A1',
    '#10AC84',
    '#F368E0',
    '#FF6348',
];


const PaintTool: React.FC<PaintToolProps> = ({ onToolSelect, currentColor,
    onColorChange,
    brushSize,
    onBrushSizeChange,
    onClear,
    onErase,
    isErasing }) => {
    const handleToolSelect = (tool: string) => {
        if (onToolSelect) {
            onToolSelect(tool);
            if (tool === 'ERASER_ALL') {
                setTimeout(() => {
                    onToolSelect('NONE');
                }, 10);
            }
        }
    }


    const handleChangeColor = (color: string) => {
        onColorChange(color);
        handleToolSelect('COLOR_PICKER');
    }
    return (
        <div className="bg-white rounded-2xl shadow-lg p-4 space-y-4 flex flex-row w-[800px] gap-4">
            {/* Colors */}
            <div>
                <p className="text-sm text-gray-600 mb-2">Color</p>
                <div className="grid grid-cols-10 gap-2 grid-rows-2 ">
                    {colors.map((color) => (
                        <button
                            key={color}
                            onClick={() => handleChangeColor(color)}
                            className={`w-8 h-8 rounded-lg shadow-md transition-transform hover:scale-110 ${currentColor === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                                }`}
                            style={{ backgroundColor: color }}
                            title={color}
                        />
                    ))}
                </div>
            </div>

            {/* Brush Size */}
            <div>

                <p className="text-sm text-gray-600 mb-2">Brush:{brushSize} px</p>
                <input
                    type="range"
                    min="2"
                    max="50"
                    onChange={(e) => onBrushSizeChange(Number(e.target.value))}
                    onClick={() => handleToolSelect('BRUSH')}
                    className="w-full accent-blue-500"
                />
            </div>

            {/* Tools */}
            <div className="flex gap-2">
                <button
                    onClick={() => handleToolSelect('ERASER')}
                    className={`flex-1 flex items-center justify-center gap-2 px-2 py-1 rounded-xl transition-colors ${isErasing
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    <Eraser className="w-4 h-4" />
                    <span className="text-sm">Eraser</span>
                </button>
                <button
                    onClick={() => handleToolSelect('ERASER_ALL')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm">Limpiar</span>
                </button>
            </div>
        </div>
    );
};

export default PaintTool;