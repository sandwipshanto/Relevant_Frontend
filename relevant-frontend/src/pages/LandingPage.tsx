import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Target, Brain, Shield } from 'lucide-react';
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

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative isolate px-6 pt-14 lg:px-8">
                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                            Cut Through the Noise with{' '}
                            <span className="text-primary-600">Relevant</span>
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            A personal content curator that learns your interests and delivers only the most relevant information.
                            Say goodbye to information overload.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link to="/register">
                                <Button size="lg" className="px-8">
                                    Get Started
                                    <ArrowRight className="ml-2" size={20} />
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="ghost" size="lg">
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Why Choose Relevant?
                        </h2>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            We use advanced AI to understand your interests and curate content that truly matters to you.
                        </p>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2 xl:grid-cols-4">
                            {features.map((feature) => (
                                <Card key={feature.title} className="relative">
                                    <CardContent className="p-6">
                                        <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                                            <feature.icon className="h-5 w-5 flex-none text-primary-600" aria-hidden="true" />
                                            {feature.title}
                                        </dt>
                                        <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                                            <p className="flex-auto">{feature.description}</p>
                                        </dd>
                                    </CardContent>
                                </Card>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-primary-600">
                <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Ready to discover relevant content?
                        </h2>
                        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-200">
                            Join thousands of users who have already cut through the noise and found their perfect content feed.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link to="/register">
                                <Button variant="secondary" size="lg" className="bg-white text-primary-600 hover:bg-gray-50">
                                    Start Free Today
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
