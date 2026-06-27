import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    TicketIcon, 
    ExclamationTriangleIcon,
    ArrowRightOnRectangleIcon,
    UserGroupIcon,
    ChartBarIcon,
    ArrowsRightLeftIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

const ManagerDashboard = () => {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Escalation state
    const [showEscalateModal, setShowEscalateModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [agents, setAgents] = useState([]);
    const [selectedAgentId, setSelectedAgentId] = useState('');
    const [escalating, setEscalating] = useState(false);

    const API_BASE = 'https://deskmind-3kq3.onrender.com';

    useEffect(() => {
        fetchSupervisorData();
        fetchAgents();
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

            const [analyticsRes, ticketsRes] = await Promise.all([
                fetch(`${API_BASE}/api/analytics/dashboard`, { headers }),
                fetch(`${API_BASE}/api/tickets/all`, { headers })
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

    const fetchAgents = async () => {
        try {
            const token = localStorage.getItem('userToken');
            const response = await fetch(`${API_BASE}/api/admin/agents`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setAgents(await response.json());
            }
        } catch (err) {
            console.error("Failed to load agents", err);
        }
    };

    const handleOpenEscalate = (ticket) => {
        setSelectedTicket(ticket);
        setSelectedAgentId('');
        setShowEscalateModal(true);
    };

    const handleEscalate = async (e) => {
        e.preventDefault();
        if (!selectedAgentId) return;
        setEscalating(true);
        try {
            const token = localStorage.getItem('userToken');
            const response = await fetch(
                `${API_BASE}/api/tickets/${selectedTicket.id}/escalate?agentId=${selectedAgentId}`,
                {
                    method: 'PUT',
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );
            if (!response.ok) throw new Error("Failed to escalate ticket");
            setShowEscalateModal(false);
            setSelectedTicket(null);
            fetchSupervisorData();
        } catch (err) {
            alert(err.message);
        } finally {
            setEscalating(false);
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

    const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none transition-all text-sm font-medium text-slate-900";

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
            
            {/* Sidebar */}
            <div className="w-64 bg-slate-900 text-white flex flex-col justify-between shadow-2xl z-10">
                <div className="p-6">
                    <div className="flex items-center space-x-3 mb-1">
                        <TicketIcon className="w-8 h-8 text-teal-400" />
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

            {/* Main Content */}
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

                        {/* Global Ticket Queue */}
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
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Action</th>
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
                                            <td className="px-6 py-4 text-right">
                                                {ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' && (
                                                    <button
                                                        onClick={() => handleOpenEscalate(ticket)}
                                                        className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
                                                    >
                                                        <ArrowsRightLeftIcon className="w-3.5 h-3.5 mr-1" />
                                                        Escalate
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {tickets.length === 0 && (
                                        <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-500">No active tickets in the system.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>

            {/* Escalate Modal */}
            {showEscalateModal && selectedTicket && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-xl font-extrabold text-slate-900">Escalate Ticket</h2>
                            <button onClick={() => setShowEscalateModal(false)} className="text-slate-400 hover:text-slate-600">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <p className="text-sm text-slate-500 mb-6">
                            Reassigning <span className="font-bold text-slate-700">{selectedTicket.ticketNumber}</span> — currently assigned to <span className="font-bold text-orange-600">{selectedTicket.agentName}</span>
                        </p>
                        <form onSubmit={handleEscalate} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Select New Agent</label>
                                <select
                                    required
                                    value={selectedAgentId}
                                    onChange={(e) => setSelectedAgentId(e.target.value)}
                                    className={inputClass}
                                >
                                    <option value="" disabled>Choose an agent...</option>
                                    {agents
                                        .filter(a => a.id !== selectedTicket.agentId)
                                        .map(agent => (
                                            <option key={agent.id} value={agent.id}>
                                                {agent.name} ({agent.email})
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                            <button
                                type="submit"
                                disabled={escalating || !selectedAgentId}
                                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
                            >
                                {escalating ? 'Escalating...' : 'Confirm Escalation'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagerDashboard;