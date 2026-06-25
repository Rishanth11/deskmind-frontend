import React from 'react';
import { Link } from 'react-router-dom';
import { 
    TicketIcon, 
    SparklesIcon, 
    ArrowsRightLeftIcon, 
    ArrowPathIcon, 
    ShieldCheckIcon 
} from '@heroicons/react/24/outline';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
            
            {/* Navigation Bar */}
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center relative z-10">
                <div className="flex items-center space-x-3">
                    <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-600/20">
                        <TicketIcon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-extrabold tracking-tight text-slate-900">DeskMind</span>
                </div>
                <div className="flex items-center space-x-4">
                    <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
                        Sign In
                    </Link>
                    <Link to="/register" className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-sm transition-all hover:shadow-md">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="container mx-auto px-6 pt-20 pb-24 text-center">
                {/* <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-full mb-8">
                    <SparklesIcon className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Powered by Groq AI</span>
                </div> */}
                
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-slate-900 max-w-4xl mx-auto leading-tight">
                    Enterprise support, <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">intelligently automated.</span>
                </h1>
                
                <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
                    Stop manually triaging tickets. DeskMind uses advanced LLMs to categorize intent, balance agent workloads dynamically, and enforce SLAs automatically.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold rounded-2xl shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5">
                        Enter Workspace
                    </Link>
                    <a href="https://github.com/rishanth11/deskmind" target="_blank" rel="noreferrer" className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-lg font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center">
                        View Documentation
                    </a>
                </div>
            </main>

            {/* Features Grid */}
            <section className="bg-white border-t border-slate-200 py-24">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Built for scale and speed.</h2>
                        <p className="text-slate-500 font-medium">Everything you need to resolve customer issues faster than ever.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Feature 1 */}
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-indigo-100 transition-colors group">
                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <SparklesIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">AI-Driven Triage</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">Instantly classify intent and generate draft responses using real-time LLM integration.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:blue-100 transition-colors group">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <ArrowsRightLeftIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Smart Load Balancing</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">Dynamically route tickets based on agent availability, presence, and active workload metrics.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:emerald-100 transition-colors group">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <ArrowPathIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Automated Lifecycle</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">Background schedulers automatically manage state transitions and archive inactive tickets.</p>
                        </div>

                        {/* Feature 4 */}
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:rose-100 transition-colors group">
                            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <ShieldCheckIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Enterprise Audit</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">100% traceability with an immutable ledger capturing all routing events and SLA compliance.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 py-8 text-center border-t border-slate-800">
                <p className="text-slate-500 text-sm font-medium">
                    &copy; {new Date().getFullYear()} DeskMind Platform. Architected by Rishanth.
                </p>
            </footer>
        </div>
    );
};

export default LandingPage;