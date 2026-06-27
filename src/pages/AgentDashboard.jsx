import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    TicketIcon, 
    UserGroupIcon, 
    ChartBarIcon, 
    ArrowRightOnRectangleIcon,
    SparklesIcon,
    ArrowPathIcon,
    Bars3Icon, // NEW: Added for mobile sidebar toggle
    XMarkIcon  // NEW: Added for mobile modal close
} from '@heroicons/react/24/outline';

const AgentDashboard = () => {
    const navigate = useNavigate();
    
    // 1. Core State
    const [activeTab, setActiveTab] = useState('queue'); 
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState('');
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // NEW: Sidebar state

    // 2. Chat & Reply State
    const [replies, setReplies] = useState([]);
    const [replyMessage, setReplyMessage] = useState('');
    const [isInternal, setIsInternal] = useState(false);
    const [loadingReplies, setLoadingReplies] = useState(false);
    
    // 3. Track the status selected in the dropdown
    const [transitionStatus, setTransitionStatus] = useState('');

    // 4. Agent Presence State
    const [isOnline, setIsOnline] = useState(true);

    const API_BASE = 'https://deskmind-3kq3.onrender.com';

    useEffect(() => {
        fetchTickets(true); 
    }, []);

    useEffect(() => {
        if (selectedTicket) {
            fetchReplies(selectedTicket.id);
            setTransitionStatus(selectedTicket.status);
        } else {
            setReplies([]); 
            setReplyMessage('');
            setTransitionStatus('');
        }
    }, [selectedTicket]);

    // Close sidebar on mobile when tab changes
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [activeTab]);

    // ==========================================
    // API CALLS
    // ==========================================

    const handleToggleStatus = async () => {
        const newStatus = !isOnline;
        setIsOnline(newStatus); 
        
        try {
            const token = localStorage.getItem('userToken');
            const response = await fetch(`${API_BASE}/api/users/availability?available=${newStatus}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (!response.ok) throw new Error("Failed to update server");
        } catch (err) {
            setIsOnline(!newStatus); 
            alert("Network error: Could not update availability.");
        }
    };

    const fetchTickets = async (showSpinner = true) => {
        if (showSpinner) setLoading(true);
        try {
            const token = localStorage.getItem('userToken');
            if (!token) throw new Error("No authentication token found.");

            const response = await fetch(`${API_BASE}/api/tickets/agent`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 403) {
                    handleLogout();
                    throw new Error("Session expired. Please log in again.");
                }
                throw new Error("Failed to fetch tickets");
            }

            const data = await response.json();
            setTickets(data);
        } catch (err) {
            setError(err.message);
        } finally {
            if (showSpinner) setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchTickets(false); 
        setIsRefreshing(false);
    };

    const handleClaimTicket = async (id) => {
        setActionLoading(true);
        try {
            const token = localStorage.getItem('userToken');
            const response = await fetch(`${API_BASE}/api/tickets/${id}/assign`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error("Failed to claim ticket");

            const updatedTicket = await response.json();
            setTickets(tickets.map(t => t.id === id ? updatedTicket : t));
            setSelectedTicket(updatedTicket);
            
        } catch (err) {
            alert(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const fetchReplies = async (ticketId) => {
        setLoadingReplies(true);
        try {
            const token = localStorage.getItem('userToken');
            const response = await fetch(`${API_BASE}/api/tickets/${ticketId}/replies`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setReplies(data);
            }
        } catch (err) {
            console.error("Failed to fetch replies", err);
        } finally {
            setLoadingReplies(false);
        }
    };

    const handleSendReply = async () => {
        if (transitionStatus === 'RESOLVED' && !replyMessage.trim()) {
            alert("A resolution note is required to mark a ticket as Resolved.");
            return;
        }

        if (!replyMessage.trim() && transitionStatus === selectedTicket.status) return;
        
        setActionLoading(true);
        
        try {
            const token = localStorage.getItem('userToken');
            
            if (replyMessage.trim()) {
                const replyResponse = await fetch(`${API_BASE}/api/tickets/${selectedTicket.id}/replies`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: replyMessage,
                        internal: isInternal
                    })
                });

                if (!replyResponse.ok) throw new Error("Failed to send reply");
                const newReply = await replyResponse.json();
                
                setReplies([...replies, newReply]);
                setReplyMessage(''); 
            }
            
            let finalStatus = transitionStatus;
            
            if (selectedTicket.status === 'OPEN' && !isInternal && transitionStatus === 'OPEN' && replyMessage.trim()) {
                finalStatus = 'IN_PROGRESS';
            }

            if (finalStatus !== selectedTicket.status) {
                const statusRes = await fetch(`${API_BASE}/api/tickets/${selectedTicket.id}/status?status=${finalStatus}`, {
                    method: 'PUT',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (statusRes.ok) {
                    const updatedTicket = await statusRes.json();
                    setSelectedTicket(updatedTicket);
                    setTickets(tickets.map(t => t.id === updatedTicket.id ? updatedTicket : t));
                    setTransitionStatus(updatedTicket.status);
                } else {
                    throw new Error("Failed to update status");
                }
            }

        } catch (err) {
            alert(err.message);
        } finally {
            setActionLoading(false);
        }
    };
    
    const handleLogout = () => {
        localStorage.removeItem('userToken');
        navigate('/login');
    };

    // ==========================================
    // UI HELPERS & FILTERING
    // ==========================================
    
    const getPriorityBadge = (priority) => {
        if (priority === 'P1') return 'bg-red-50 text-red-700 border-red-200';
        if (priority === 'P2') return 'bg-amber-50 text-amber-700 border-amber-200';
        return 'bg-gray-50 text-gray-700 border-gray-200';
    };

    const getStatusBadge = (status) => {
        if (status === 'OPEN') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        if (status === 'IN_PROGRESS') return 'bg-blue-50 text-blue-700 border-blue-200';
        if (status === 'WAITING') return 'bg-amber-50 text-amber-700 border-amber-200';
        if (status === 'RESOLVED') return 'bg-purple-50 text-purple-700 border-purple-200';
        return 'bg-slate-50 text-slate-700 border-slate-200';
    };

    const getTabClass = (tabName) => {
        return activeTab === tabName 
            ? "w-full flex items-center px-4 py-3 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-xl font-medium shadow-sm transition-all"
            : "w-full flex items-center px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl font-medium transition-all border border-transparent";
    };

    const displayedTickets = tickets.filter(ticket => {
        if (activeTab === 'assigned') {
            return ticket.agentName !== 'Unassigned'; 
        }
        return true; 
    });

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900 relative">
            
            {/* Mobile Top Header */}
            <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center shadow-md sticky top-0 z-20">
                <div className="flex items-center space-x-2">
                    <TicketIcon className="w-6 h-6 text-indigo-400" />
                    <h2 className="text-xl font-extrabold tracking-tight">DeskMind</h2>
                </div>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 -mr-2 text-slate-300 hover:text-white transition-colors">
                    {isSidebarOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/60 z-30 md:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-white flex flex-col justify-between shadow-2xl z-40 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6">
                    <div className="hidden md:flex items-center space-x-3 mb-1">
                        <TicketIcon className="w-8 h-8 text-indigo-400" />
                        <h2 className="text-2xl font-extrabold tracking-tight">DeskMind</h2>
                    </div>
                    <p className="hidden md:block text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 pl-11">Agent Workspace</p>
                    
                    {/* Agent Presence Toggle */}
                    <div className="mb-8 pl-4 md:pl-11 flex items-center justify-between pr-2 md:pr-6 mt-4 md:mt-0">
                        <span className={`text-sm font-bold ${isOnline ? 'text-emerald-400' : 'text-slate-500'}`}>
                            {isOnline ? '🟢 Online' : '⚪ Offline'}
                        </span>
                        
                        <button 
                            onClick={handleToggleStatus}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${isOnline ? 'bg-emerald-500' : 'bg-slate-700'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isOnline ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    <div className="hidden md:block w-full h-px bg-slate-800 mb-8"></div>
                    
                    <nav className="space-y-2">
                        <button onClick={() => setActiveTab('queue')} className={getTabClass('queue')}>
                            <TicketIcon className="w-5 h-5 mr-3" />
                            Ticket Queue
                        </button>
                        <button onClick={() => setActiveTab('assigned')} className={getTabClass('assigned')}>
                            <UserGroupIcon className="w-5 h-5 mr-3" />
                            My Assigned
                        </button>
                        <button onClick={() => setActiveTab('analytics')} className={getTabClass('analytics')}>
                            <ChartBarIcon className="w-5 h-5 mr-3" />
                            Analytics
                        </button>
                    </nav>
                </div>
                
                <div className="p-6 border-t border-slate-800/50">
                    <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-2.5 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl font-medium transition-colors">
                        <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" /> Logout
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 w-full max-w-full px-4 py-6 sm:px-8 sm:py-10 overflow-y-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6 sm:mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">
                            {activeTab === 'queue' && 'Global Ticket Queue'}
                            {activeTab === 'assigned' && 'My Assigned Tickets'}
                            {activeTab === 'analytics' && 'Performance Analytics'}
                        </h1>
                        <p className="text-sm sm:text-base text-slate-500 font-medium">
                            {activeTab === 'queue' && 'Review, claim, and resolve customer issues.'}
                            {activeTab === 'assigned' && 'Tickets currently assigned to your workspace.'}
                            {activeTab === 'analytics' && 'Track helpdesk metrics and resolution times.'}
                        </p>
                    </div>
                    
                    {activeTab !== 'analytics' && (
                        <button 
                            onClick={handleRefresh} 
                            disabled={isRefreshing}
                            className="w-full sm:w-auto flex items-center justify-center px-4 py-2.5 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors border border-indigo-200 disabled:opacity-50">
                            <ArrowPathIcon className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                            {isRefreshing ? 'Refreshing...' : 'Refresh Queue'}
                        </button>
                    )}
                </div>

                {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl font-medium text-sm">{error}</div>}

                {/* Main View Logic */}
                {activeTab === 'analytics' ? (
                    <div className="space-y-6">
                        {(() => {
                            const myTickets = tickets.filter(t => t.agentName !== 'Unassigned');
                            const resolvedCount = myTickets.filter(t => t.status === 'RESOLVED').length;
                            const activeCount = myTickets.filter(t => t.status === 'IN_PROGRESS' || t.status === 'WAITING').length;
                            const slaBreaches = myTickets.filter(t => t.slaBreached && t.status !== 'RESOLVED').length;

                            return (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <TicketIcon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase">My Active Tickets</p>
                                                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{activeCount}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <SparklesIcon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase">Total Resolved</p>
                                                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{resolvedCount}</p>
                                            </div>
                                        </div>

                                        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-red-100 flex items-center space-x-4 sm:col-span-2 lg:col-span-1">
                                            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <ChartBarIcon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-xs sm:text-sm font-bold text-red-500 uppercase">My SLA Breaches</p>
                                                <p className="text-2xl sm:text-3xl font-extrabold text-red-600">{slaBreaches}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 p-6 sm:p-8 text-center text-white mt-8">
                                        <h3 className="text-lg sm:text-xl font-bold mb-2">Keep up the great work!</h3>
                                        <p className="text-slate-400 text-sm">Your performance metrics are calculated based on your currently assigned queue history.</p>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : displayedTickets.length === 0 ? (
                            <div className="text-center p-12 sm:p-16">
                                <div className="text-5xl sm:text-6xl mb-4">🎉</div>
                                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">Inbox Zero!</h3>
                                <p className="text-sm sm:text-base text-slate-500">There are no tickets in this view.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[700px]">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200">
                                            <th className="px-4 sm:px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ticket / Customer</th>
                                            <th className="px-4 sm:px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Issue</th>
                                            <th className="px-4 sm:px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Triage</th>
                                            <th className="px-4 sm:px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Agent</th>
                                            <th className="px-4 sm:px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {displayedTickets.map(ticket => (
                                            <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => setSelectedTicket(ticket)}>
                                                <td className="px-4 sm:px-6 py-4">
                                                    <div className="font-mono text-xs sm:text-sm font-bold text-indigo-600 mb-1">{ticket.ticketNumber}</div>
                                                    <div className="text-xs sm:text-sm font-medium text-slate-500">{ticket.customerName}</div>
                                                </td>
                                                <td className="px-4 sm:px-6 py-4">
                                                    <div className="text-xs sm:text-sm font-bold text-slate-900 mb-1 max-w-[200px] sm:max-w-[300px] truncate">{ticket.title}</div>
                                                </td>
                                                <td className="px-4 sm:px-6 py-4">
                                                    <div className="flex flex-wrap gap-2">
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] sm:text-xs font-bold border ${getPriorityBadge(ticket.priority)}`}>
                                                            {ticket.priority}
                                                        </span>
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] sm:text-xs font-bold border ${getStatusBadge(ticket.status)}`}>
                                                            {ticket.status}
                                                        </span>
                                                        {ticket.slaBreached && (
                                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] sm:text-xs font-bold bg-red-600 text-white shadow-sm animate-pulse">
                                                                SLA BREACHED
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 sm:px-6 py-4">
                                                    <span className={`text-xs sm:text-sm font-medium ${ticket.agentName === 'Unassigned' ? 'text-slate-400 italic' : 'text-slate-900'}`}>
                                                        {ticket.agentName}
                                                    </span>
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 text-right">
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); setSelectedTicket(ticket); }}
                                                        className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-lg transition-colors">
                                                        Review
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Ticket Review Modal */}
            {selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white sm:rounded-3xl shadow-2xl w-full h-full sm:h-auto sm:max-h-[90vh] max-w-3xl overflow-hidden flex flex-col">
                        
                        {/* Modal Header */}
                        <div className="px-5 sm:px-8 py-5 border-b border-slate-100 flex justify-between items-start bg-slate-50">
                            <div>
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className="font-mono text-xs sm:text-sm font-bold text-indigo-600">{selectedTicket.ticketNumber}</span>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold border ${getStatusBadge(selectedTicket.status)}`}>
                                        {selectedTicket.status}
                                    </span>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">{selectedTicket.title}</h3>
                            </div>
                            <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-slate-600 p-2">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>
                        
                        {/* Modal Body */}
                        <div className="p-5 sm:p-8 overflow-y-auto flex-1 bg-white">
                            
                            {/* Original Issue */}
                            <div className="mb-6 sm:mb-8">
                                <p className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Issue Description ({selectedTicket.customerName})</p>
                                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-slate-700 text-sm leading-relaxed">
                                    {selectedTicket.description}
                                </div>
                            </div>

                            {/* AI Suggestion Box */}
                            {selectedTicket.aiSuggestion && (
                                <div className="mb-6 sm:mb-8 relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 p-4 sm:p-5">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
                                        <div className="flex items-center space-x-2">
                                            <SparklesIcon className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                                            <span className="font-bold text-indigo-900 text-sm">AI Suggested Draft</span>
                                        </div>
                                        
                                        {selectedTicket.agentName !== 'Unassigned' && (
                                            <button 
                                                onClick={() => setReplyMessage(selectedTicket.aiSuggestion)}
                                                className="w-full sm:w-auto px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center"
                                            >
                                                <SparklesIcon className="w-3 h-3 mr-1" />
                                                Use Draft
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-xs sm:text-sm text-indigo-900/80 font-medium whitespace-pre-wrap">
                                        {selectedTicket.aiSuggestion}
                                    </p>
                                </div>
                            )}

                            {/* Unassigned View vs Assigned Chat View */}
                            {selectedTicket.agentName === 'Unassigned' ? (
                                <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
                                    <p className="text-slate-500 font-medium mb-4">This ticket is currently unassigned.</p>
                                    <button 
                                        onClick={() => handleClaimTicket(selectedTicket.id)}
                                        disabled={actionLoading}
                                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition-all disabled:opacity-70 mx-auto block w-full sm:w-auto">
                                        {actionLoading ? 'Assigning...' : 'Claim Ticket'}
                                    </button>
                                </div>
                            ) : (
                                <div className="border-t border-slate-100 pt-6 sm:pt-8">
                                    <p className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Conversation History</p>
                                    
                                    {/* Chat History List */}
                                    <div className="space-y-3 sm:space-y-4 mb-6">
                                        {loadingReplies ? (
                                            <p className="text-sm text-slate-500 text-center py-4">Loading conversation...</p>
                                        ) : replies.length === 0 ? (
                                            <p className="text-sm text-slate-500 text-center py-4 bg-slate-50 rounded-xl">No replies yet. Be the first to answer!</p>
                                        ) : (
                                            replies.map(reply => (
                                                <div key={reply.id} className={`p-3 sm:p-4 rounded-xl text-sm ${reply.internal ? 'bg-amber-50 border border-amber-200' : 'bg-slate-50 border border-slate-200'}`}>
                                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2 gap-1">
                                                        <span className="font-bold text-slate-900">{reply.senderName}</span>
                                                        <div className="flex items-center space-x-2">
                                                            {reply.internal && (
                                                                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-200 text-amber-800 rounded-md uppercase">Internal Note</span>
                                                            )}
                                                            <span className="text-[10px] sm:text-xs text-slate-500 font-medium">
                                                                {new Date(reply.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p className="text-slate-700 whitespace-pre-wrap text-xs sm:text-sm">{reply.message}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* Action Bar Layout */}
                                    <div className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200">
                                        <textarea 
                                            rows="4"
                                            value={replyMessage}
                                            onChange={(e) => setReplyMessage(e.target.value)}
                                            className={`w-full px-3 sm:px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:outline-none transition-all text-xs sm:text-sm font-medium resize-none ${isInternal ? 'border-amber-300 focus:ring-amber-600/20 focus:border-amber-600 placeholder:text-amber-300' : 'border-slate-200 focus:ring-indigo-600/20 focus:border-indigo-600'}`}
                                            placeholder={isInternal ? "Type a private note for other agents..." : "Type your reply to the customer here..."}
                                        />
                                        
                                        <div className="flex flex-col space-y-4 sm:space-y-3 mt-3">
                                            {/* Internal Note Toggle */}
                                            <label className="flex items-center cursor-pointer self-start">
                                                <input 
                                                    type="checkbox" 
                                                    checked={isInternal}
                                                    onChange={(e) => setIsInternal(e.target.checked)}
                                                    className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-600"
                                                />
                                                <span className="ml-2 text-xs sm:text-sm font-bold text-slate-600 select-none">Internal Note Only</span>
                                            </label>
                                            
                                            {/* Action Bar: Status Dropdown & Submit */}
                                            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-slate-100/50 sm:bg-slate-50 p-0 sm:p-3 rounded-xl sm:border border-slate-200 sm:shadow-sm">
                                                <div className="flex items-center space-x-2 w-full sm:w-auto">
                                                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase flex-shrink-0">Status:</label>
                                                    <select 
                                                        value={transitionStatus} 
                                                        onChange={(e) => setTransitionStatus(e.target.value)}
                                                        className="flex-1 sm:flex-none bg-white border border-slate-200 rounded-lg p-1.5 sm:p-2 text-xs sm:text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                                                    >
                                                        <option value="OPEN" disabled>Open</option>
                                                        <option value="IN_PROGRESS">In Progress</option>
                                                        <option value="WAITING">Waiting on Customer</option>
                                                        <option value="RESOLVED">Resolved</option>
                                                    </select>
                                                </div>
                                                <button 
                                                    onClick={handleSendReply}
                                                    disabled={actionLoading || (!replyMessage.trim() && transitionStatus === selectedTicket.status)}
                                                    className={`w-full sm:w-auto px-5 py-2.5 sm:py-2 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all disabled:opacity-70 ${isInternal ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                                                    {actionLoading ? 'Sending...' : (isInternal ? 'Save Note' : 'Submit Update')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgentDashboard;