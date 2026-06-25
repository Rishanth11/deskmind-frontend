import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    BriefcaseIcon, 
    TicketIcon, 
    ExclamationTriangleIcon,
    ArrowRightOnRectangleIcon,
    UserGroupIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';

const ManagerDashboard = () => {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSupervisorData();
    }, []);

    const fetchSupervisorData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('userToken');
            if (!token) throw new Error("No authentication token found.");

            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            // Fetch both Analytics and Tickets simultaneously
            const [analyticsRes, ticketsRes] = await Promise.all([
                fetch('http://localhost:8080/api/analytics/dashboard', { headers }),
                fetch('http://localhost:8080/api/tickets/all', { headers })
            ]);

            if (!analyticsRes.ok || !ticketsRes.ok) {
                if (analyticsRes.status === 403 || ticketsRes.status === 403) {
                    handleLogout();
                    throw new Error("Session expired or unauthorized.");
                }
                throw new Error("Failed to fetch dashboard data");
            }

            setMetrics(await analyticsRes.json());
            setTickets(await ticketsRes.json());
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    const getStatusBadge = (status) => {
        if (status === 'OPEN') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        if (status === 'IN_PROGRESS') return 'bg-blue-50 text-blue-700 border-blue-200';
        if (status === 'RESOLVED') return 'bg-purple-50 text-purple-700 border-purple-200';
        return 'bg-slate-50 text-slate-700 border-slate-200';
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
            
            {/* Sidebar - Teal Theme */}
            <div className="w-64 bg-slate-900 text-white flex flex-col justify-between shadow-2xl z-10">
                <div className="p-6">
                    <div className="flex items-center space-x-3 mb-1">
                        <BriefcaseIcon className="w-8 h-8 text-teal-400" />
                        <h2 className="text-2xl font-extrabold tracking-tight">DeskMind</h2>
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 pl-11">Supervisor Console</p>
                    <div className="w-full h-px bg-slate-800 mb-8"></div>
                    
                    <nav className="space-y-2">
                        <button className="w-full flex items-center px-4 py-3 bg-teal-600/20 text-teal-400 border border-teal-500/30 rounded-xl font-medium shadow-sm transition-all">
                            <ChartBarIcon className="w-5 h-5 mr-3" />
                            Live Overview
                        </button>
                        <button onClick={() => navigate('/admin/analytics')} className="w-full flex items-center px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl font-medium transition-all border border-transparent">
                            <ChartBarIcon className="w-5 h-5 mr-3" />
                            Full Analytics
                        </button>
                    </nav>
                </div>
                
                <div className="p-6">
                    <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-2.5 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl font-medium transition-colors">
                        <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" /> Logout
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 px-8 py-10 overflow-y-auto">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Live Operations</h1>
                        <p className="text-slate-500 font-medium">Monitor global queue health and agent workloads.</p>
                    </div>
                    <button onClick={fetchSupervisorData} className="px-4 py-2 text-sm font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors border border-teal-200">
                        Refresh Data
                    </button>
                </div>

                {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl font-medium text-sm">{error}</div>}

                {loading || !metrics ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
                    </div>
                ) : (
                    <>
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
                                <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center">
                                    <TicketIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-500 uppercase">Total Open</p>
                                    <p className="text-2xl font-extrabold text-slate-900">{metrics.totalOpenTickets}</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
                                <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">
                                    <UserGroupIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-500 uppercase">Active Agents</p>
                                    <p className="text-2xl font-extrabold text-slate-900">{metrics.agentPerformance.length}</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100 flex items-center space-x-4">
                                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                                    <ExclamationTriangleIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-red-500 uppercase">SLA Breaches</p>
                                    <p className="text-2xl font-extrabold text-red-600">{metrics.slaBreaches}</p>
                                </div>
                            </div>
                        </div>

                        {/* Unified Table: Queue Oversight */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="text-lg font-bold text-slate-900">Global Ticket Queue</h3>
                            </div>
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Ticket ID</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Issue</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Category</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Assigned Agent</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {tickets.map(ticket => (
                                        <tr key={ticket.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-sm font-bold text-teal-600">{ticket.ticketNumber}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-slate-900">{ticket.title}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-slate-600">{ticket.category}</td>
                                            <td className="px-6 py-4">
                                                <span className={`text-sm font-bold ${ticket.agentName === 'Unassigned' ? 'text-red-500 bg-red-50 px-2 py-1 rounded' : 'text-slate-700'}`}>
                                                    {ticket.agentName}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${getStatusBadge(ticket.status)}`}>
                                                    {ticket.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {tickets.length === 0 && (
                                        <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-500">No active tickets in the system.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ManagerDashboard;