import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Settings, Compass, Home, Bookmark, UserCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout, isAuthenticated } = useAuth();
    const location = useLocation();

    const navigation = [
        { name: 'Home', href: '/home', icon: Home, description: 'Your personalized feed' },
        { name: 'Discover', href: '/discover', icon: Compass, description: 'Explore trending content' },
        { name: 'Saved', href: '/saved', icon: Bookmark, description: 'Your bookmarked content' },
        { name: 'You', href: '/you', icon: UserCircle, description: 'Profile & settings' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/50 fixed top-0 left-0 right-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold">R</span>
                            </div>
                            <span className="text-xl font-bold text-slate-900">Relevant</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    {isAuthenticated && (
                        <nav className="hidden md:flex space-x-1 items-center relative z-10">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        title={item.description}
                                        className={`group inline-flex items-center px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer relative z-10 ${isActive(item.href)
                                            ? 'bg-slate-100 text-slate-700 shadow-sm'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-700'
                                            }`}
                                        style={{
                                            pointerEvents: 'auto',
                                            position: 'relative',
                                            zIndex: 100
                                        }}
                                    >
                                        <Icon size={18} className="mr-2" />
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
                <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md">
                    <div className="px-4 pt-4 pb-6 space-y-2">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${isActive(item.href)
                                        ? 'bg-slate-100 text-slate-700 shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-700'
                                        }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Icon size={20} className="mr-3" />
                                    <div>
                                        <div className="font-semibold">{item.name}</div>
                                        <div className="text-xs text-slate-500">{item.description}</div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </header>
    );
};
