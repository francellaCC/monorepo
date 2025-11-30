import React, { useEffect, useRef, useState } from 'react';
import Canvas from '../../components/canvas';
import { useParams } from 'react-router-dom';
import ChatComponent from '../../components/chat';
import PaintTool from '../../components/paintTool';
import Participants from '../../components/Participants';
import WordMistery from '../../components/WordMistery';
import { useSocket } from '../../api/conexion';
import type { IDrawAction } from './types';
import { Play, Send, Share2 } from 'lucide-react';


const BoardGamePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const [selectedTool, setSelectedTool] = React.useState<string | null>(null);
    const [roomStatus, setRoomStatus] = useState<String>("waiting")
    const socket = useSocket();
    // const user = localStorage.getItem("playerId")
    const [message, setMessage] = useState<string>('');
    const [isConnected, setIsConnected] = React.useState(false);
    const [currentDrawing, setCurrentDrawing] = React.useState<IDrawAction[]>([]);
    const [players, setPlayers] = useState<{ id: string; name: string; socketId: string }[]>([]);


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
    const handleShareLink = () => {
        console.log(`${window.location.origin}/join/${id}`)
        const link = `${window.location.origin}/join/${id}`

        navigator.clipboard.writeText(link).then(() => {
            alert("link copiado")
        }).catch((err) => {
            console.error("Error al copiar:", err)
        })
    }

    useEffect(() => {
        const roomCode = id!;

        const playerId = localStorage.getItem("playerId");
        const run = async () => {
            const resp = await socket.joinRoom({ roomCode, playerId: playerId! });
            console.log(resp);
            if (resp.ok) {
                setMessage(`Te has unido a la sala`);
            }
        };


        socket.connect().then(() => {
            socket.onUpdatePlayers(({ players }) => {
                console.log("Players actualizados:", players);
                setPlayers(players); 
                setMessage(`: ${players.find(p => p.id === playerId)?.name || 'Desconocido'} se ha unido al juego`);
            });
            run();

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
        <div className=" overflow-hidden flex flex-col  ">
            <div className="w-full h-full flex flex-col  mt-0">

                {/* Top Bar */}
                <div className="rounded-3xl bg-white shadow-lg p-4 mb-4 flex justify-between items-center">
                    <div>
                        <h1 className="font-semibold text-lg">Board Game Page: {id}</h1>
                        <WordMistery texto="Example" show={false} underlineCount={7} />
                    </div>
                </div>

                {/* MAIN AREA */}
                <div className="flex flex-1 gap-4 min-h-0 ">

                    {/* PARTICIPANTES */}
                    <div className="w-60 flex flex-col gap-4">
                        {/* Players List */}
                        <div className="bg-white rounded-3xl shadow-lg p-4 animate-in fade-in slide-in-from-right duration-300">
                            <h3 className="text-sm text-gray-600 mb-3">Jugadores {players.length}</h3>
                            <div className="space-y-2">
                                <Participants
                                    participants={players}
                                />
                            </div>
                        </div>

                    </div>
                    {/* CANVAS */}
                    <div className="flex flex-col flex-1 min-w-0 gap-4 ">

                        <div className="flex-1 min-h-0">
                            <Canvas
                                selectedTool={selectedTool ?? 'NONE'}
                                printLineCallback={handleEmitDrawAction}
                                currentUserDrawing={false}
                                newPathToDraw={currentDrawing}
                                brushSize={brushSize}
                                currentColor={currentColor}
                                className="w-full h-full bg-white rounded-xl shadow-inner border-4 border-gray-200"
                            />
                        </div>

                        {
                            roomStatus != "waiting" ? (
                                <>
                                    <PaintTool
                                        onToolSelect={handleToolSelect}
                                        currentColor={currentColor}
                                        onColorChange={setCurrentColor}
                                        brushSize={brushSize}
                                        onBrushSizeChange={setBrushSize}
                                        onClear={handleClear}
                                        onErase={handleErase}
                                        isErasing={isErasing}
                                    />
                                </>
                            ) : (
                                <>
                                    <div className="flex gap-4 animate-in fade-in slide-in-from-bottom duration-500">
                                        <button
                                            onClick={handleShareLink}
                                            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:shadow-xl transform hover:scale-[1.02] transition-all shadow-lg"
                                        >
                                            <Share2 className="w-5 h-5" />
                                            <span>Invitar amigos</span>
                                        </button>

                                        <button
                                            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl shadow-lg transition-all 
                                                bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-xl transform hover:scale-[1.02]"
                                        >
                                            <Play className="w-5 h-5" />
                                            <span>Iniciar partida</span>
                                        </button>
                                    </div>
                                </>
                            )}
                    </div>

                    {/* CHAT */}
                    <div className="w-72 bg-white rounded-3xl shadow-lg p-4 flex flex-col min-h-0">
                        <h3 className="text-sm text-gray-600 mb-3">Chat</h3>
                        <div className="flex-1 overflow-y-auto space-y-1 min-h-0">
                            <ChatComponent message={message} />
                        </div>
                        <form className="flex gap-2 mt-3">
                            <input
                                type="text"
                                placeholder="Escribe un mensaje..."
                                className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 text-sm"
                            />
                            <button type="submit" className="p-2 rounded-xl bg-gray-200 text-gray-700 cursor-pointer">
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>


    );
};

export default BoardGamePage;