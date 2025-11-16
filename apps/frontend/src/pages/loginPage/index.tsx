import React from 'react';
import './styles.css';
import { useNavigate } from 'react-router-dom';
import ModalBase from '../../components/Modal';
import LoginForm from '../../components/loginForm';
import { Palette, Sparkles } from 'lucide-react';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    const handleCreateRoom = (name: string) => {
        // Aquí puedes generar un ID único para la sala
        const roomId = Math.random().toString(36).substring(2, 10);
        navigate(`/board/${roomId}/${name}`);
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
                {/* <ModalBase></ModalBase> */}

                <LoginForm onCreate={handleCreateRoom} />
                {/* <button className="btn" onClick={()=>{
                    handleCreateRoom()
                }} >Crear Sala</button> */}
            
        </div>
    );
};

export default LoginPage;