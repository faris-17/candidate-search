import { Navigate, Outlet } from 'react-router-dom';
import { tokenStorage } from './tokenStorage';

export default function ProtectedRoute() {
    return tokenStorage.get() ? <Outlet /> : <Navigate to="/login" replace />;
}