import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  KeyIcon,
  TicketIcon,
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const ForgotPassword = () => {
    // State to track which step of the process we are on
    const [step, setStep] = useState(1); 
    
    // Form inputs
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    
    // Feedback messages
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Triggered when they request the OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');
        
        try {
            await authService.forgotPassword(email);
            setMessage("OTP sent! Check your email inbox.");
            setStep(2); // Move to the next screen
        } catch (err) {
            setError(err.message || "Failed to send OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Triggered when they submit the new password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            await authService.resetPassword(email, otp, newPassword);
            setMessage("Password reset successfully! Redirecting...");
            
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.message || "Failed to reset password. Check your OTP.");
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
                            Reset Your
                            <br />
                            <span className="text-blue-400">Password</span>
                        </h2>
                        <p className="text-gray-400 text-lg font-medium">
                            We'll help you get back into your account securely
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

            {/* Right Side - Forgot Password Form */}
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
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            {step === 1 ? (
                                <EnvelopeIcon className="w-8 h-8" />
                            ) : (
                                <KeyIcon className="w-8 h-8" />
                            )}
                        </div>
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
                            {step === 1 ? 'Reset Password' : 'Create New Password'}
                        </h2>
                        <p className="text-gray-500 font-medium text-sm">
                            {step === 1 
                                ? 'Enter your email to receive a 6-digit OTP' 
                                : `Enter the OTP sent to ${email}`
                            }
                        </p>
                    </div>

                    {/* Feedback Banners */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></span>
                            {error}
                        </div>
                    )}
                    {message && (
                        <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-xl border border-emerald-100 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mr-2"></span>
                            {message}
                        </div>
                    )}

                    {/* STEP 1: Request OTP */}
                    {step === 1 && (
                        <form onSubmit={handleSendOtp} className="space-y-5">
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
                                        placeholder="you@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)} 
                                        required 
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white outline-none transition-all text-sm font-medium placeholder:text-gray-400"
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
                                        Sending OTP...
                                    </>
                                ) : (
                                    'Send OTP'
                                )}
                            </button>
                        </form>
                    )}

                    {/* STEP 2: Verify OTP & New Password */}
                    {step === 2 && (
                        <form onSubmit={handleResetPassword} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    6-Digit OTP
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <KeyIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input 
                                        type="text" 
                                        placeholder="••••••"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)} 
                                        required 
                                        maxLength="6"
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white outline-none transition-all text-sm font-medium placeholder:text-gray-400 tracking-[0.3em]"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input 
                                        type="password" 
                                        placeholder="Create a strong password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)} 
                                        required 
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white outline-none transition-all text-sm font-medium placeholder:text-gray-400"
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
                                        Updating...
                                    </>
                                ) : (
                                    'Confirm New Password'
                                )}
                            </button>
                        </form>
                    )}

                    {/* Navigation Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <Link 
                            to="/login" 
                            className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors group"
                        >
                            <ArrowLeftIcon className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to login
                        </Link>
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

export default ForgotPassword;