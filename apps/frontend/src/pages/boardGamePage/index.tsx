import React, { useEffect, useState } from 'react';
import Canvas from '../../components/canvas';
import { useParams } from 'react-router-dom';
import ChatComponent from '../../components/chat';
import PaintTool from '../../components/paintTool';
import Participants from '../../components/Participants';
import WordMistery from '../../components/WordMistery';
import { useSocket } from '../../api/conexion';
import type { IDrawAction } from './types';

const BoardGamePage: React.FC = () => {
    const { id, user } = useParams<{ id: string, user: string }>();
    const [selectedTool, setSelectedTool] = React.useState<string | null>(null);
    const socket = useSocket();
    const [isConnected, setIsConnected] = React.useState(false);
    const [currentDrawing, setCurrentDrawing] = React.useState<IDrawAction[]>([]);

    // tools
    const [currentColor, setCurrentColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(5);
    const [isErasing, setIsErasing] = useState(false);

      const handleErase = () => {
    setIsErasing(!isErasing);
    if (!isErasing) {
      setCurrentColor('#FFFFFF');
    } else {
      setCurrentColor('#000000');
    }
  };

  const handleClear = () => {
    // Canvas will handle clearing
  };
    const handleReciveDrawAction = (coor: IDrawAction[]) => {
        console.log("Accion de dibujo recibida:", coor);
        setCurrentDrawing(coor);
    }

    const handleEmitDrawAction = (msg: IDrawAction[]) => {
        console.log("Accion de dibujo emitida:", msg);
        setCurrentDrawing(msg);
        socket.sendDrawAction(msg);

    }

    useEffect(() => {

        const roomCode = id!;
        const playerId = localStorage.getItem("playerId");
        socket.connect().then(() => {
            socket.joinRoom({ roomCode, playerId: playerId! }).then(() => {
                console.log(`✅ Joined room: ${roomCode}`);
            }).catch((error) => {
                console.error("Error joining room:", error);
            });

            socket.onDrawAction(handleReciveDrawAction);
            setIsConnected(true);
            console.log("✅ Socket conectado en BoardGamePage");
        }).catch((error) => {
            console.error("Error al conectar:", error);
        });

        return () => {

            socket.leaveRoom(id!);
            // Limpiar solo el listener de draw action
            const socketInstance = socket.getSocket();
            if (socketInstance) {
                socketInstance.off('drawAction');
            }
        };
    }, []);

    const handleToolSelect = (tool: string) => {
        console.log('Selected tool:', tool);
        setSelectedTool(tool);
    };

    if (!id) {
        return <div>Invalid Board Game ID</div>;
    }
    return (
        <div>
            <h1>Board Game Page:{id}</h1>

            <div className=''>
                <div className='w-full'>
                    <WordMistery texto="Example" show={false} underlineCount={7}></WordMistery>
                </div>
                <div className='w-full flex '>

                    <Participants participants={[
                        { id: '1', name: 'Alice', avatar: 'https://cdn-icons-png.flaticon.com/512/219/219983.png' },
                        { id: '2', name: 'Bob', avatar: 'https://cdn-icons-png.flaticon.com/512/219/219983.png' },
                        { id: '3', name: user! }
                    ]}></Participants>
                    <div className="flex-1 flex gap-4 min-h-0">
                        <div className="flex-1 flex flex-col gap-4 min-w-0">
                            <div className="flex-1 animate-in fade-in slide-in-from-left duration-500">
                                <Canvas selectedTool={selectedTool ?? 'NONE'} printLineCallback={handleEmitDrawAction} 
                                    currentUserDrawing={false} newPathToDraw={currentDrawing} brushSize={brushSize}
                                    currentColor={currentColor}
                                    className='w-full h-full bg-white rounded-xl shadow-inner border-4 border-gray-200' />
                            </div>
                        </div>

                    </div>

                    <ChatComponent></ChatComponent>
                </div>

            </div>
            <div className='mt-5'>
                <PaintTool onToolSelect={handleToolSelect}  currentColor={currentColor}
                  onColorChange={setCurrentColor}
                  brushSize={brushSize}
                  onBrushSizeChange={setBrushSize}
                  onClear={handleClear}
                  onErase={handleErase}
                  isErasing={isErasing}/>
            </div>
            <p>Welcome to the board game page!</p>
        </div>
    );
};

export default BoardGamePage;