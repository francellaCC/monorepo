import { Sparkles } from 'lucide-react'
import LoginForm from '../../../components/loginForm'
import '../styles.css';
import { useParams } from 'react-router-dom';

export default function JoinRoomPage() {
  const { id } = useParams<{ id: string, user: string }>();

  console.log(id)
  const handleJoinRoom=()=>{

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
