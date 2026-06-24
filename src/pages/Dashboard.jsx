import React, { useState, useEffect } from 'react';
import { getMyTickets, createTicket } from '../services/ticketService';
import { useNavigate } from 'react-router-dom';
import { 
  TicketIcon, 
  PlusIcon, 
  ArrowRightOnRectangleIcon,
  InboxIcon,
  XMarkIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  WrenchScrewdriverIcon,
  CurrencyDollarIcon,
  QuestionMarkCircleIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [submitting, setSubmitting] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async () => {
        try {
            const data = await getMyTickets();
            setTickets(data);
        } catch (error) {
            console.error("Error fetching tickets:", error);
            if(error.message.includes("403")) {
                localStorage.removeItem('userToken');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const newTicket = await createTicket(formData);
            setTickets([newTicket, ...tickets]); 
            setShowModal(false);
            setFormData({ title: '', description: '' });
        } catch (error) {
            alert("Failed to create ticket. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        navigate('/login');
    };

    // Category Icon Mapping
    const getCategoryIcon = (category) => {
        const icons = {
            'TECHNICAL': <WrenchScrewdriverIcon className="w-3 h-3 mr-1.5" />,
            'BILLING': <CurrencyDollarIcon className="w-3 h-3 mr-1.5" />,
            'ACCOUNT': <ShieldCheckIcon className="w-3 h-3 mr-1.5" />,
            'GENERAL': <GlobeAltIcon className="w-3 h-3 mr-1.5" />,
            'SUPPORT': <QuestionMarkCircleIcon className="w-3 h-3 mr-1.5" />,
            'FEATURE': <CpuChipIcon className="w-3 h-3 mr-1.5" />,
        };
        return icons[category] || <QuestionMarkCircleIcon className="w-3 h-3 mr-1.5" />;
    };

    // Category Color Mapping
    const getCategoryColor = (category) => {
        const colors = {
            'TECHNICAL': 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20',
            'BILLING': 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20',
            'ACCOUNT': 'bg-purple-50 text-purple-700 ring-1 ring-purple-600/20',
            'GENERAL': 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20',
            'SUPPORT': 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20',
            'FEATURE': 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/20',
        };
        return colors[category] || 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20';
    };

    // Badge Styling Helpers
    const getPriorityBadge = (priority) => {
        const styles = {
            'P1': 'bg-red-50 text-red-700 ring-1 ring-red-600/20',
            'P2': 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20',
            'P3': 'bg-green-50 text-green-700 ring-1 ring-green-600/20',
        };
        return styles[priority] || 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20';
    };

    const getPriorityIcon = (priority) => {
        if (priority === 'P1') return <ExclamationTriangleIcon className="w-3 h-3 mr-1" />;
        if (priority === 'P2') return <ClockIcon className="w-3 h-3 mr-1" />;
        return <InformationCircleIcon className="w-3 h-3 mr-1" />;
    };

    const getStatusBadge = (status) => {
        const styles = {
            'OPEN': 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20',
            'RESOLVED': 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20',
            'CLOSED': 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20',
            'IN_PROGRESS': 'bg-purple-50 text-purple-700 ring-1 ring-purple-600/20',
        };
        return styles[status] || 'bg-slate-50 text-slate-700 ring-1 ring-slate-600/20';
    };

    const getStatusIcon = (status) => {
        if (status === 'OPEN') return <CheckCircleIcon className="w-3 h-3 mr-1" />;
        if (status === 'RESOLVED') return <CheckCircleIcon className="w-3 h-3 mr-1" />;
        return <ClockIcon className="w-3 h-3 mr-1" />;
    };

    // Ticket statistics
    const totalTickets = tickets.length;
    const openTickets = tickets.filter(t => t.status === 'OPEN').length;
    const resolvedTickets = tickets.filter(t => t.status === 'RESOLVED').length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50 flex font-sans text-gray-900">
            
            {/* Sidebar */}
            <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col justify-between shadow-2xl z-10">
                <div className="p-6">
                    <div className="flex items-center space-x-2 mb-1">
                        <TicketIcon className="w-8 h-8 text-blue-400" />
                        <h2 className="text-2xl font-extrabold tracking-tight">DeskMind</h2>
                    </div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-widest ml-10">Customer Portal</p>
                    
                    <div className="w-full h-px bg-gradient-to-r from-gray-700/50 to-transparent my-6"></div>
                    
                    <nav className="space-y-1">
                        <button className="w-full flex items-center px-4 py-3 bg-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95">
                            <TicketIcon className="w-5 h-5 mr-3" />
                            My Tickets
                        </button>
                    </nav>
                </div>
                
                <div className="p-6 border-t border-gray-700/50">
                    <button 
                        onClick={handleLogout} 
                        className="w-full flex items-center justify-center px-4 py-2.5 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-xl font-medium transition-all group">
                        <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 px-8 py-10 md:px-12 overflow-y-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Support Tickets</h1>
                        <p className="text-gray-500 font-medium">Manage and track your helpdesk requests</p>
                    </div>
                    <button 
                        onClick={() => setShowModal(true)}
                        className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-0.5 active:scale-95">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        New Ticket
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Tickets</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{totalTickets}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                <TicketIcon className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Open</p>
                                <p className="text-2xl font-bold text-emerald-600 mt-1">{openTickets}</p>
                            </div>
                            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                                <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Resolved</p>
                                <p className="text-2xl font-bold text-blue-600 mt-1">{resolvedTickets}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                <CheckCircleIcon className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                        <p className="mt-4 text-sm font-medium text-gray-500">Loading tickets...</p>
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <InboxIcon className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No tickets found</h3>
                        <p className="text-gray-500">You don't have any open support requests right now.</p>
                        <button 
                            onClick={() => setShowModal(true)}
                            className="mt-6 inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all">
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Create your first ticket
                        </button>
                    </div>
                ) : (
                    /* Tickets Table */
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/80 border-b border-gray-100">
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ticket ID</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {tickets.map(ticket => (
                                        <tr key={ticket.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                                            <td className="px-6 py-4 font-mono text-sm font-semibold text-gray-500">#{ticket.ticketNumber}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{ticket.title}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(ticket.category)}`}>
                                                    {getCategoryIcon(ticket.category)}
                                                    {ticket.category || 'GENERAL'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getPriorityBadge(ticket.priority)}`}>
                                                    {getPriorityIcon(ticket.priority)}
                                                    {ticket.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(ticket.status)}`}>
                                                    {getStatusIcon(ticket.status)}
                                                    {ticket.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Ticket Modal */}
            {showModal && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm transition-opacity"
                        onClick={() => setShowModal(false)}
                    />
                    
                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            {/* Modal Header */}
                            <div className="px-8 pt-8 pb-6 border-b border-gray-100 flex items-start justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-1">Create New Ticket</h3>
                                    <p className="text-sm text-gray-500 font-medium">Describe your issue and we'll route it correctly</p>
                                </div>
                                <button 
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors -mt-2 -mr-2"
                                >
                                    <XMarkIcon className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                            
                            {/* Modal Body */}
                            <div className="p-8">
                                <form onSubmit={handleCreateTicket} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Problem Title <span className="text-red-500">*</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            required 
                                            value={formData.title}
                                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white outline-none transition-all text-sm font-medium placeholder:text-gray-400"
                                            placeholder="e.g., Cannot connect to database"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Description <span className="text-red-500">*</span>
                                        </label>
                                        <textarea 
                                            required 
                                            rows="4"
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white outline-none transition-all text-sm font-medium resize-none placeholder:text-gray-400"
                                            placeholder="Describe your issue in detail..."
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-3 pt-2">
                                        <button 
                                            type="button" 
                                            onClick={() => setShowModal(false)}
                                            className="px-6 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            disabled={submitting}
                                            className="flex items-center px-6 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-95">
                                            {submitting ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Creating...
                                                </>
                                            ) : (
                                                'Submit Ticket'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;