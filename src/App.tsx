import { Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CallRoomPage from './pages/CallRoomPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/call/:roomId" element={<CallRoomPage />} />
      <Route path="/delivery/support" element={<Navigate to="/" replace />} />
      <Route path="/admin" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
