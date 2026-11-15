import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({children, allowedRole}) {
    const { user } = useAuth()

    // Periksa login user
    if (!user) {
        return <Navigate to="/login" replace />
    }

    // Periksa role user sesuai
    if (allowedRole && user.role !== allowedRole) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default ProtectedRoute