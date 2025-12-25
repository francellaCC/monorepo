import React, { useEffect, useState } from 'react';
import { maskWord } from '../../herlpers/maskWord';

interface WordMisteryProps {
    texto: string;
    show: boolean;
    underlineCount: number;
}

const WordMistery: React.FC<WordMisteryProps> = ({ texto, show, underlineCount }) => {
    const [visible, setVisible] = useState("")

    useEffect(() => {
        if (show) {
            setVisible(texto)
        } else {
            setVisible(maskWord(texto));
        }
    }, [show, texto, underlineCount]);
   

    return (
        <span>
            {visible}
        
        </span>
    );
};

export default WordMistery;