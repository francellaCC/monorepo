import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/loginPage';
import BoardGamePage from '../pages/boardGamePage';
import ChatPage from '../pages/chatPage';
import JoinRoomPage from '../pages/loginPage/joinRoomPage/JoinRoomPage';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/board/:id" element={<BoardGamePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/" element={<LoginPage />} />
            <Route path="*" element={<NotFound />} />
            <Route path='/join/:id' element={<JoinRoomPage />} />
        </Routes>
    );
}

// Basic components
const NotFound = () => <div>404 - Page Not Found</div>;