import React from 'react';
import Canvas from '../../components/canvas';
import { useParams } from 'react-router-dom';
import ChatComponent from '../../components/chat';
import PaintTool from '../../components/paintTool';
import Participants from '../../components/Participants';
import WordMistery from '../../components/WordMistery';

const BoardGamePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    if (!id) {
        return <div>Invalid Board Game ID</div>;
    }
    return (
        <div>
            <h1>Board Game Page:{id}</h1>
            
            <div className='gap-4 bg-gray-200 p-4'>
                <div className='w-full'>
                    <WordMistery texto="Example" show={false} underlineCount={7}></WordMistery>
                 </div>
                 <div className='w-full flex '>
                
                <Participants participants={[
                    { id: '1', name: 'Alice', avatar: 'https://cdn-icons-png.flaticon.com/512/219/219983.png' },
                    { id: '2', name: 'Bob', avatar: 'https://cdn-icons-png.flaticon.com/512/219/219983.png' },
                    { id: '3', name: 'Charlie' }
                ]}></Participants>
                <Canvas />
                <ChatComponent></ChatComponent>
                </div>

            </div>
            <div>
                <PaintTool />
            </div>
            <p>Welcome to the board game page!</p>
        </div>
    );
};

export default BoardGamePage;