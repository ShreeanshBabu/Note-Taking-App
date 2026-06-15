import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export function AuthProvider({children}) {
    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(true);

    // Check if a valid session cookie already exists (e.g. on page refresh)
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await api.get('/auth/me');
                setUser(res.data.user);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const register = async (name, email, password, confirmPassword) => {
        const res = await api.post('/auth/register', {name, email, password, confirmPassword});
        setUser(res.data.user);
    };

    const login = async (email, password) => {
        const res = await api.post('/auth/login', {email, password});
        setUser(res.data.user);
    };

    const logout = async () => {
        await api.post('/auth/logout');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{user, loading, register, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);