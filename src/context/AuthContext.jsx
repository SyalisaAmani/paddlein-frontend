
import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("paddle-user");

        return savedUser ? JSON.parse(savedUser) : null;
    });

    const logout = async () => {
        try {
            await api.post("/logout");
        } catch (error) {
            console.error("Logout API error:", error);
        } finally {
            localStorage.removeItem("paddle-token");
            localStorage.removeItem("paddle-user");
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext);
}
