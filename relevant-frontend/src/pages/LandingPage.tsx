import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Target, Brain, Shield, Play, TrendingUp, Users, Star } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

export const LandingPage: React.FC = () => {
    const features = [
        {
            icon: Brain,
            title: 'AI-Powered Curation',
            description: 'Our intelligent system learns your interests and finds the most relevant content just for you.',
        },
        {
            icon: Target,
            title: 'Personalized Feed',
            description: 'Get content that matches your exact interests, filtered by relevance scores.',
        },
        {
            icon: Zap,
            title: 'Smart Filtering',
            description: 'No more information overload. See only the content that matters to you.',
        },
        {
            icon: Shield,
            title: 'Privacy First',
            description: 'Your data stays yours. We only use it to improve your content experience.',
        },
    ];

    const stats = [
        { icon: Users, value: 'Beta', label: 'Early Access' },
        { icon: TrendingUp, value: '4-Stage', label: 'AI Pipeline' },
        { icon: Star, value: 'Free', label: 'To Use' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-stone-100">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-40">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-200/30 to-stone-200/30"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,theme(colors.slate.300/0.4),transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,theme(colors.stone.300/0.4),transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_80%,theme(colors.green.200/0.3),transparent_50%)]"></div>
            </div>

            {/* Hero Section */}
            <div className="relative isolate px-6 pt-14 lg:px-8">
                {/* Gradient Orbs */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-slate-400 rounded-full filter blur-3xl opacity-40 animate-pulse"></div>
                <div className="absolute top-40 right-10 w-96 h-96 bg-green-300 rounded-full filter blur-3xl opacity-35 animate-pulse delay-1000"></div>
                <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-stone-400 rounded-full filter blur-3xl opacity-30 animate-pulse delay-2000"></div>

                <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56">
                    <div className="text-center">
                        <div className="mb-8 flex justify-center">
                            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-slate-700 ring-1 ring-slate-400/50 hover:ring-slate-500/60 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm">
                                AI-powered content discovery
                            </div>
                        </div>

                        <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-stone-800 sm:text-7xl leading-tight">
                            Discover{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-green-600">
                                Relevant
                            </span>
                            {' '}Content
                        </h1>

                        <p className="mt-8 text-xl leading-8 text-slate-700 max-w-3xl mx-auto">
                            AI-powered content curation that learns your interests and finds the most relevant YouTube content for you.
                        </p>

                        <div className="mt-12 flex items-center justify-center gap-x-6">
                            <Link to="/register">
                                <Button size="lg" className="px-10 py-4 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                                    Get Started Free
                                    <ArrowRight className="ml-2" size={20} />
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="ghost" size="lg" className="px-8 py-4 text-slate-800 border-2 border-slate-400/60 hover:border-slate-500/80 hover:bg-white/70 backdrop-blur-sm font-semibold text-lg transition-all duration-300">
                                    <Play className="mr-2" size={20} />
                                    Watch Demo
                                </Button>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white/80 border border-slate-300/60 rounded-xl backdrop-blur-sm mb-3 shadow-sm">
                                        <stat.icon className="h-6 w-6 text-slate-700" />
                                    </div>
                                    <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                                    <div className="text-sm text-slate-600">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 sm:py-32 bg-white/80 backdrop-blur-sm border-t border-slate-200/50">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-6">
                            Why Choose Relevant?
                        </h2>
                        <p className="text-xl leading-8 text-slate-700">
                            We use advanced AI to understand your interests and curate content that truly matters to you.
                        </p>
                    </div>
                    <div className="mx-auto mt-20 max-w-5xl">
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            {features.map((feature) => (
                                <Card key={feature.title} className="relative bg-white/90 backdrop-blur-md border border-slate-200/60 hover:bg-white/95 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl group">
                                    <CardContent className="p-8">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                                                <feature.icon className="h-8 w-8 text-white" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-slate-900">{feature.title}</h3>
                                        </div>
                                        <p className="text-slate-700 leading-relaxed text-lg">
                                            {feature.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="relative py-24 sm:py-32 overflow-hidden">
                {/* Enhanced background gradients */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-gray-100 to-stone-100"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-white/30"></div>
                
                {/* Elegant decorative elements */}
                <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-slate-300/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-tl from-green-200/30 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-stone-200/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
                
                <div className="relative mx-auto max-w-4xl text-center px-6 lg:px-8">
                    <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-8">
                        Ready to discover relevant content?
                    </h2>
                    <p className="text-xl leading-8 text-slate-700 mb-12 max-w-2xl mx-auto">
                        Join thousands of users who have already cut through the noise and found their perfect content feed.
                        Start your journey to personalized content discovery today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <Link to="/register">
                            <Button 
                                size="lg" 
                                className="bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-0"
                            >
                                Start Free Today
                                <ArrowRight className="ml-2" size={20} />
                            </Button>
                        </Link>
                        <div className="text-slate-600 text-sm font-medium">
                            No credit card required
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
