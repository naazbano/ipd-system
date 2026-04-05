import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../utils/utils';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(sessionStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        
        const storedUser = sessionStorage.getItem('user');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, [token]);

    
const login = async (email, password) => {
    try {
        const res = await axios.post(`${BACKEND_URL}/auth/login`, { email, password });
        
        
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