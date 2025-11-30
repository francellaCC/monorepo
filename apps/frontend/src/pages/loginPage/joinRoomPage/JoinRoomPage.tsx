import { Sparkles } from 'lucide-react'
import LoginForm from '../../../components/loginForm'
import '../styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import { getGameRoom } from '../../../api/gameRoomService';
import { useSocket } from '../../../api/conexion';
import { createPlayer } from '../../../api/playerService';

export default function JoinRoomPage() {
    const { id } = useParams<{ id: string, user: string }>();

    const socket = useSocket();
    const navigate = useNavigate();
    console.log(id)
    const handleJoinRoom = async (name: string) => {

        const res = await getGameRoom(id!);
        console.log(res)

        if (res.ok) {
            try {
                await socket.connect();
                const player = await createPlayer(name);
                console.log("Creating player:", player);
                const serverResponse = await socket.joinGame({
                    playerId: player._id,
                    name: name
                });

               
                console.log("🔥 Server response:", serverResponse);
                localStorage.setItem("socketId", serverResponse.socketId);
                localStorage.setItem("playerId", serverResponse.playerId);

                navigate(`/board/${id}`);
            } catch (error) {
                console.error("Error joining room:", error);
            }
        } else {
            console.error("Room does not exist");
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
            <LoginForm onCreate={handleJoinRoom} text={"Unirse a la sala"} />
        </div>
    )
}
