import React from 'react';
import './styles.css';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/loginForm';
import {  Sparkles } from 'lucide-react';
import { createPlayer } from '../../api/playerService';
import { useSocket } from '../../api/conexion';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const socket = useSocket();
    console.log(import.meta.env.VITE_API_URL);
    const handleCreateRoom = async (name: string) => {
     

        console.log("Creating player:", name);
        // navigate(`/board/${roomId}/${name}`);
        try {
   
            const res = await createPlayer(name);


            const serverResponse = await socket.joinGame({
                playerId: res._id,
                name: name
            });

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