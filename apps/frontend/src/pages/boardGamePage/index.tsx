import React from 'react';
import Canvas from '../../components/canvas';
import { useParams } from 'react-router-dom';
import ChatComponent from '../../components/chat';
import PaintTool from '../../components/paintTool';

const BoardGamePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    if (!id) {
        return <div>Invalid Board Game ID</div>;
    }
    return (
        <div>
            <h1>Board Game Page:{id}</h1>
            <div className='flex gap-4 bg-gray-200 p-4'>
                <Canvas />
                <ChatComponent></ChatComponent>
            </div>
            <div>
                <PaintTool />
            </div>
            <p>Welcome to the board game page!</p>
        </div>
    );
};

export default BoardGamePage;