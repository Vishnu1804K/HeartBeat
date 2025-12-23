import React, { createContext, useState, useContext, useEffect, ReactNode, FC } from 'react';
import { authAPI, profileAPI } from '../services/api';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async (): Promise<void> => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await profileAPI.get();
                setUser(response.data);
                setIsAuthenticated(true);
            } catch {
                localStorage.removeItem('token');
                setIsAuthenticated(false);
            }
        }
        setLoading(false);
    };

    const login = async (email: string, password: string): Promise<void> => {
        const response = await authAPI.login({ email, password });
        localStorage.setItem('token', response.data.token);
        await checkAuth();
    };

    const register = async (email: string, password: string): Promise<void> => {
        await authAPI.register({ email, password });
    };

    const logout = (): void => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    };

    const updateUser = (userData: Partial<User>): void => {
        setUser((prev: User | null) => prev ? { ...prev, ...userData } : null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isAuthenticated,
            login,
            register,
            logout,
            updateUser,
            checkAuth
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
