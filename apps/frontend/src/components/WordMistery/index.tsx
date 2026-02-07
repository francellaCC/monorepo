import React from 'react';

interface WordMisteryProps {
    texto: string;
    show: boolean;
    underlineCount: number;
}

const WordMistery: React.FC<WordMisteryProps> = ({ texto, show, underlineCount }) => {
    if (show) {
        return <span>{texto}</span>;
    }

    return (
        <span>
            {'_ '.repeat(underlineCount) + ' ' + underlineCount}
        </span>
    );
};

export default WordMistery;