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
        { icon: Users, value: '10K+', label: 'Active Users' },
        { icon: TrendingUp, value: '95%', label: 'Relevance Rate' },
        { icon: Star, value: '4.9', label: 'User Rating' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-20 -z-10">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,theme(colors.purple.500/0.1),transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,theme(colors.pink.500/0.1),transparent_50%)]"></div>
            </div>

            {/* Hero Section */}
            <div className="relative isolate px-6 pt-14 lg:px-8">
                {/* Gradient Orbs */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-pulse -z-10"></div>
                <div className="absolute top-40 right-10 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000 -z-10"></div>

                <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56">
                    <div className="text-center">
                        <div className="mb-8 flex justify-center">
                            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-purple-300 ring-1 ring-purple-300/20 hover:ring-purple-300/30 transition-all duration-300">
                                🚀 Now with AI-powered content discovery
                            </div>
                        </div>

                        <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white sm:text-7xl leading-tight">
                            Cut Through the Noise with{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                Relevant
                            </span>
                        </h1>

                        <p className="mt-8 text-xl leading-8 text-gray-300 max-w-3xl mx-auto">
                            A personal content curator powered by AI that learns your interests and delivers only the most relevant information.
                            <span className="block mt-2 text-purple-300 font-medium">Say goodbye to information overload forever.</span>
                        </p>

                        <div className="mt-12 flex items-center justify-center gap-x-6">
                            <Link to="/register">
                                <Button size="lg" className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                                    Get Started Free
                                    <ArrowRight className="ml-2" size={20} />
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="ghost" size="lg" className="px-8 py-4 text-white border-2 border-white/20 hover:border-white/40 hover:bg-white/10 backdrop-blur-sm font-semibold text-lg transition-all duration-300">
                                    <Play className="mr-2" size={20} />
                                    Watch Demo
                                </Button>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl backdrop-blur-sm mb-3">
                                        <stat.icon className="h-6 w-6 text-purple-400" />
                                    </div>
                                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                                    <div className="text-sm text-gray-400">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 sm:py-32 bg-white/5 backdrop-blur-sm">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-6">
                            Why Choose Relevant?
                        </h2>
                        <p className="text-xl leading-8 text-gray-300">
                            We use advanced AI to understand your interests and curate content that truly matters to you.
                        </p>
                    </div>
                    <div className="mx-auto mt-20 max-w-5xl">
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            {features.map((feature) => (
                                <Card key={feature.title} className="relative bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl group">
                                    <CardContent className="p-8">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                                                <feature.icon className="h-8 w-8 text-white" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                                        </div>
                                        <p className="text-gray-300 leading-relaxed text-lg">
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
            <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-8">
                            Ready to discover relevant content?
                        </h2>
                        <p className="mx-auto max-w-2xl text-xl leading-8 text-purple-100 mb-12">
                            Join thousands of users who have already cut through the noise and found their perfect content feed.
                            Start your journey to personalized content discovery today.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link to="/register">
                                <Button size="lg" className="px-12 py-4 bg-white text-purple-600 hover:bg-gray-100 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                                    Start Free Today
                                    <ArrowRight className="ml-2" size={20} />
                                </Button>
                            </Link>
                            <div className="text-white/80 text-sm">
                                ✨ No credit card required • ⚡ Setup in 2 minutes
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
