import React from 'react';
import './styles.css';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/loginForm';
import { Sparkles } from 'lucide-react';
import { createPlayer } from '../../api/playerService';
import { useSocket } from '../../api/conexion';
import { createGameRoom } from '../../api/gameRoomService';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const socket = useSocket();
    const handleCreateRoom = async (name: string) => {

        const roomId = Math.random().toString(36).substring(2, 10);
        console.log("Creating player:", name);
        // navigate(`/board/${roomId}/${name}`);
        try {

            await socket.connect();
            const res = await createPlayer(name);
            const serverResponse = await socket.joinGame({
                playerId: res._id,
                name: name
            });

            console.log("Player created with ID:", res);


            const result = await createGameRoom({ playerId: res._id, languageCode: "es", code: roomId });
            console.log("🏁 Room created with ID:", result.room._id);
            navigate(`/board/${result.room.code}/${name}`);
            console.log("🔥 Server response:", serverResponse);
            localStorage.setItem("socketId", serverResponse.socketId);
            localStorage.setItem("playerId", serverResponse.playerId);


        } catch (err) {
            console.error("❌ Error creating room:", err);
        }
    }
    return (
        <div className="login-container items-center justify-center p-4 relative ">

            <div className="flex items-center justify-center mt-28">
                <div className="w-full ">
                    {/* Logo and Title */}
                    <div className="text-center animate-in fade-in slide-in-from-top duration-500">
                        <h1 className="text-5xl text-gray-800 ">Drawlio</h1>
                        <p className="text-xl text-gray-600 flex items-center justify-center gap-2">
                            <Sparkles className="w-5 h-5 " />
                            Adivina, dibuja, gana
                            <Sparkles className="w-5 h-5 " />
                        </p>
                    </div>
                </div>
            </div>
            <LoginForm onCreate={handleCreateRoom} />
        </div>
    );
};

export default LoginPage;