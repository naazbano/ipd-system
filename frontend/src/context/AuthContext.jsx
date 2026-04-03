import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(sessionStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Agar token hai toh refresh par user data dobara fetch karein
        const storedUser = sessionStorage.getItem('user');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, [token]);

    // Login Function
    // AuthContext.jsx ke login function mein ye change karein
const login = async (email, password) => {
    try {
        const res = await axios.post('http://localhost:4000/api/auth/login', { email, password });
        
        // DHAYAN DEIN: Backend direct response de raha hai, res.data.user nahi
        const userData = res.data; 

        setUser(userData);
        setToken(userData.token);

        sessionStorage.setItem('token', userData.token);
        sessionStorage.setItem('user', JSON.stringify(userData));

        return { success: true, role: userData.role };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Login failed" };
    }
};
    // Logout Function
    const logout = () => {
        setUser(null);
        setToken(null);
        sessionStorage.clear();
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};