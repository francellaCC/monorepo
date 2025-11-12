import React from 'react';
import './styles.css';
import { useNavigate } from 'react-router-dom';
import ModalBase from '../../components/Modal';
import LoginForm from '../../components/loginForm';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    const handleCreateRoom = (name:string) => {
        // Aquí puedes generar un ID único para la sala
        const roomId = Math.random().toString(36).substring(2, 10);
        navigate(`/board/${roomId}/${name}`);
    }
    return (
        <div className="login-container">
            {/* <ModalBase></ModalBase> */}

            <LoginForm onCreate = {handleCreateRoom}/>
                {/* <button className="btn" onClick={()=>{
                    handleCreateRoom()
                }} >Crear Sala</button> */}
        </div>
    );
};

export default LoginPage;