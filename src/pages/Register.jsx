import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  UserIcon, 
  EnvelopeIcon, 
  LockClosedIcon, 
  ArrowRightOnRectangleIcon,
  TicketIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // FIXED: Centralized API URL for production
    const API_BASE = 'https://deskmind-3kq3.onrender.com';

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            // FIXED: Using API_BASE instead of localhost
            const response = await fetch(`${API_BASE}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Registration failed');
            }

            alert("Account created successfully! Please log in.");
            navigate('/login');
            
        } catch (error) {
            setError(error.message || 'Failed to create account. Please try again.');
            console.error("Registration error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100/50">
            {/* Left Side - Brand Section */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-12 flex-col justify-between relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                </div>

                {/* Brand Content */}
                <div className="relative z-10">
                    <div className="flex items-center space-x-3">
                        <TicketIcon className="w-12 h-12 text-blue-400" />
                        <div>
                            <h1 className="text-3xl font-extrabold text-white tracking-tight">DeskMind</h1>
                            <p className="text-blue-400 text-sm font-medium">Support Platform</p>
                        </div>
                    </div>

                    <div className="mt-16">
                        <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
                            Join DeskMind
                            <br />
                            <span className="text-blue-400">Get Started Today</span>
                        </h2>
                        <p className="text-gray-400 text-lg font-medium">
                            Create your account and streamline your support experience
                        </p>
                    </div>

                    {/* Feature List */}
                    <div className="mt-12 space-y-4">
                        <div className="flex items-center space-x-4 text-gray-300">
                            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                                <ChatBubbleLeftRightIcon className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <p className="font-semibold text-white">Instant Support</p>
                                <p className="text-sm text-gray-400">Get help when you need it</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 text-gray-300">
                            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                                <CheckBadgeIcon className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <p className="font-semibold text-white">Smart Resolution</p>
                                <p className="text-sm text-gray-400">AI-powered ticket routing</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 text-gray-300">
                            <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                                <ClockIcon className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <p className="font-semibold text-white">24/7 Availability</p>
                                <p className="text-sm text-gray-400">Support around the clock</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="relative z-10">
                    <p className="text-gray-500 text-sm">
                        © 2026 DeskMind. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
                <div className="w-full max-w-md">
                    {/* Mobile Brand (visible only on small screens) */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                            <TicketIcon className="w-10 h-10 text-blue-600" />
                            <h1 className="text-2xl font-extrabold text-gray-900">DeskMind</h1>
                        </div>
                        <p className="text-sm font-medium text-blue-600">Smart Support, Faster Resolution</p>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Create Account</h2>
                        <p className="text-gray-500 font-medium text-sm">Join DeskMind to manage your support tickets</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <UserIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input 
                                    type="text" 
                                    required 
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white outline-none transition-all text-sm font-medium placeholder:text-gray-400"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input 
                                    type="email" 
                                    required 
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white outline-none transition-all text-sm font-medium placeholder:text-gray-400"
                                    placeholder="you@company.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input 
                                    type="password" 
                                    required 
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white outline-none transition-all text-sm font-medium placeholder:text-gray-400"
                                    placeholder="Create a strong password"
                                />
                            </div>
                        </div>
                        
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                                    Sign Up
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <p className="text-center text-sm text-gray-500 font-medium">
                            Already have an account?{' '}
                            <Link 
                                to="/login" 
                                className="inline-flex items-center font-bold text-blue-600 hover:text-blue-700 transition-colors hover:underline"
                            >
                                Log in
                            </Link>
                        </p>
                    </div>

                    {/* Feature Tags */}
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                            24/7 Support
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                            Secure
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                            Fast Response
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;