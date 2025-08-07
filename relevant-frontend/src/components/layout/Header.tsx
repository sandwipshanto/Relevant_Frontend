import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, BookOpen, Home, Heart } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout, isAuthenticated } = useAuth();
    const location = useLocation();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: Home },
        { name: 'Feed', href: '/feed', icon: BookOpen },
        { name: 'Saved', href: '/saved', icon: Heart },
        { name: 'Profile', href: '/profile', icon: User },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold">R</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">Relevant</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    {isAuthenticated && (
                        <nav className="hidden md:flex space-x-8 items-center relative z-10">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        onClick={() => console.log('Nav link clicked:', item.name, item.href)}
                                        className={`inline-flex items-center px-3 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer hover:bg-gray-100 rounded-t-md relative z-10 ${isActive(item.href)
                                            ? 'border-purple-500 text-purple-600 bg-purple-50'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:bg-gray-50'
                                            }`}
                                        style={{
                                            pointerEvents: 'auto',
                                            position: 'relative',
                                            zIndex: 100
                                        }}
                                    >
                                        <Icon size={16} className="mr-2" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    )}

                    {/* User Menu */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-3">
                                <span className="text-sm text-gray-700">Hi, {user?.name || user?.email}</span>
                                <div className="flex items-center space-x-2">
                                    <Link to="/settings">
                                        <Button variant="ghost" size="sm">
                                            <Settings size={16} />
                                        </Button>
                                    </Link>
                                    <Button variant="ghost" size="sm" onClick={logout}>
                                        <LogOut size={16} />
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link to="/login">
                                    <Button variant="ghost">Login</Button>
                                </Link>
                                <Link to="/register">
                                    <Button variant="primary">Sign Up</Button>
                                </Link>
                            </div>
                        )}

                        {/* Mobile menu button */}
                        {isAuthenticated && (
                            <button
                                className="md:hidden p-2"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isAuthenticated && isMobileMenuOpen && (
                <div className="md:hidden border-t border-gray-200">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive(item.href)
                                        ? 'bg-purple-50 text-purple-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Icon size={20} className="mr-3" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </header>
    );
};
