import React, { createContext, useContext, useEffect, useReducer } from 'react';
import type { ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import type { AuthState, User, LoginForm, RegisterForm } from '../types';
import { apiService } from '../services/api';

interface AuthContextType extends AuthState {
    login: (credentials: LoginForm) => Promise<void>;
    register: (data: RegisterForm) => Promise<void>;
    logout: () => void;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_USER'; payload: { user: User; token: string } }
    | { type: 'UPDATE_USER'; payload: User }
    | { type: 'LOGOUT' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_USER':
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
                loading: false,
            };
        case 'UPDATE_USER':
            return {
                ...state,
                user: action.payload,
            };
        case 'LOGOUT':
            return {
                isAuthenticated: false,
                user: null,
                token: null,
                loading: false,
            };
        default:
            return state;
    }
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        isAuthenticated: false,
        user: null,
        token: localStorage.getItem('token'),
        loading: true,
    });

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await apiService.getCurrentUser();
                    if (response.success) {
                        dispatch({
                            type: 'SET_USER',
                            payload: { user: response.user, token },
                        });
                    } else {
                        localStorage.removeItem('token');
                        dispatch({ type: 'LOGOUT' });
                    }
                } catch (error) {
                    console.error('Auth initialization failed:', error);
                    localStorage.removeItem('token');
                    dispatch({ type: 'LOGOUT' });
                }
            } else {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };

        initAuth();
    }, []);

    const login = async (credentials: LoginForm) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const response = await apiService.login(credentials);

            if (response.success) {
                localStorage.setItem('token', response.token);
                dispatch({
                    type: 'SET_USER',
                    payload: { user: response.user, token: response.token },
                });
                toast.success('Login successful!');
            }
        } catch (error: any) {
            const message = error.response?.data?.msg || 'Login failed';
            toast.error(message);
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const register = async (data: RegisterForm) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const response = await apiService.register(data);

            if (response.success) {
                localStorage.setItem('token', response.token);
                dispatch({
                    type: 'SET_USER',
                    payload: { user: response.user, token: response.token },
                });
                toast.success('Registration successful!');
            }
        } catch (error: any) {
            const message = error.response?.data?.msg || 'Registration failed';
            toast.error(message);
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        dispatch({ type: 'LOGOUT' });
        toast.success('Logged out successfully');
    };

    const updateUser = (user: User) => {
        dispatch({ type: 'UPDATE_USER', payload: user });
    };

    const value: AuthContextType = {
        ...state,
        login,
        register,
        logout,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
