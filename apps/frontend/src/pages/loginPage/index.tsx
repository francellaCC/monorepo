import React from 'react';
import './styles.css';
import { useNavigate } from 'react-router-dom';
import ModalBase from '../../components/Modal';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    const handleCreateRoom = () => {
        // Aquí puedes generar un ID único para la sala
        const roomId = Math.random().toString(36).substring(2, 10);
        navigate(`/board/${roomId}`);
    }
    return (
        <div className="login-container">
            <ModalBase></ModalBase>
                <button className="btn" onClick={()=>{
                    handleCreateRoom()
                }} >Crear Sala</button>
        </div>
    );
};

export default LoginPage;