import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheckIcon, 
  UserGroupIcon, 
  ClockIcon, 
  ArrowRightOnRectangleIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('audit'); 
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAdminData();
    }, [activeTab]);

    const fetchAdminData = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('userToken');
            if (!token) throw new Error("No authentication token found.");

            // Dynamically select the endpoint based on the active tab
            let endpoint = '';
            if (activeTab === 'audit') endpoint = '/api/admin/audit-logs';
            if (activeTab === 'teams') endpoint = '/api/admin/teams';
            if (activeTab === 'slas') endpoint = '/api/admin/slas';

            const response = await fetch(`http://localhost:8080${endpoint}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 403) throw new Error("Unauthorized. Admin access required.");
                throw new Error("Failed to fetch data");
            }

            const result = await response.json();
            setData(result);
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

    const getTabClass = (tabName) => {
        return activeTab === tabName 
            ? "w-full flex items-center px-4 py-3 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-xl font-medium shadow-sm transition-all"
            : "w-full flex items-center px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl font-medium transition-all border border-transparent";
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
            
            {/* Sidebar */}
            <div className="w-64 bg-slate-900 text-white flex flex-col justify-between shadow-2xl z-10">
                <div className="p-6">
                    <div className="flex items-center space-x-3 mb-1">
                        <ShieldCheckIcon className="w-8 h-8 text-purple-400" />
                        <h2 className="text-2xl font-extrabold tracking-tight">DeskMind</h2>
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 pl-11">Admin Console</p>
                    <div className="w-full h-px bg-slate-800 mb-8"></div>
                    
                    <nav className="space-y-2">
                        <button onClick={() => setActiveTab('audit')} className={getTabClass('audit')}>
                            <ClipboardDocumentListIcon className="w-5 h-5 mr-3" />
                            Audit Ledger
                        </button>
                        <button onClick={() => setActiveTab('teams')} className={getTabClass('teams')}>
                            <UserGroupIcon className="w-5 h-5 mr-3" />
                            Support Teams
                        </button>
                        <button onClick={() => setActiveTab('slas')} className={getTabClass('slas')}>
                            <ClockIcon className="w-5 h-5 mr-3" />
                            SLA Configs
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
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-1">
                        {activeTab === 'audit' && 'System Audit Ledger'}
                        {activeTab === 'teams' && 'Team Routing Configuration'}
                        {activeTab === 'slas' && 'Service Level Agreements (SLAs)'}
                    </h1>
                    <p className="text-slate-500 font-medium">
                        {activeTab === 'audit' && 'Immutable record of system actions and routing events.'}
                        {activeTab === 'teams' && 'Manage AI categories and team assignments.'}
                        {activeTab === 'slas' && 'Configure priority-based response deadlines.'}
                    </p>
                </div>

                {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl font-medium text-sm">{error}</div>}

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
                        </div>
                    ) : data.length === 0 ? (
                        <div className="text-center p-16">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No records found</h3>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    {activeTab === 'audit' && (
                                        <>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Timestamp</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Action</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Performed By</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Details</th>
                                        </>
                                    )}
                                    {activeTab === 'teams' && (
                                        <>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Team ID</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Team Name</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">AI Category Route</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Agents Assigned</th>
                                        </>
                                    )}
                                    {activeTab === 'slas' && (
                                        <>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Priority Level</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Deadline (Hours)</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data.map((item, index) => (
                                    <tr key={item.id || index} className="hover:bg-slate-50/50 transition-colors">
                                        {activeTab === 'audit' && (
                                            <>
                                                <td className="px-6 py-4 text-sm font-medium text-slate-500 whitespace-nowrap">
                                                    {new Date(item.timestamp).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                                        {item.action}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-slate-900">{item.performedBy}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600">{item.details}</td>
                                            </>
                                        )}
                                        {activeTab === 'teams' && (
                                            <>
                                                <td className="px-6 py-4 text-sm font-bold text-slate-500">#{item.id}</td>
                                                <td className="px-6 py-4 text-sm font-bold text-slate-900">{item.name}</td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                                        {item.handlesCategory}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    {item.agents ? item.agents.length : 0} agent(s)
                                                </td>
                                            </>
                                        )}
                                        {activeTab === 'slas' && (
                                            <>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-900 text-white">
                                                        {item.priority}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-slate-900">{item.deadlineHours} Hours</td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;