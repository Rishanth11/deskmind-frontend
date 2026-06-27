import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    TicketIcon, 
    UserGroupIcon, 
    ClockIcon, 
    ArrowRightOnRectangleIcon,
    ClipboardDocumentListIcon,
    ChartBarIcon,
    PlusIcon,
    UserPlusIcon,
    UserIcon,
    TrashIcon,
    NoSymbolIcon,
    CheckCircleIcon,
    XMarkIcon,
    ArrowsRightLeftIcon // NEW: Added swap icon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('audit'); 
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // --- Modal States ---
    const [showStaffModal, setShowStaffModal] = useState(false);
    const [showTeamModal, setShowTeamModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showMoveModal, setShowMoveModal] = useState(false); // NEW: Move Modal state
    const [selectedTeamId, setSelectedTeamId] = useState(null);

    // --- Agent Dropdown & Move States ---
    const [availableAgents, setAvailableAgents] = useState([]);
    const [moveData, setMoveData] = useState({ agentId: '', oldTeamId: '', newTeamId: '', agentName: '' });

    // --- Form States ---
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: 'AGENT',
        teamName: '', handlesCategory: '', agentId: ''
    });

    const API_BASE = 'https://deskmind-3kq3.onrender.com';

    useEffect(() => {
        fetchAdminData();
        if (activeTab === 'teams' || activeTab === 'staff') {
            fetchAgentsList();
        }
    }, [activeTab]);

    const fetchAdminData = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('userToken');
            if (!token) throw new Error("No authentication token found.");

            let endpoint = '';
            if (activeTab === 'audit') endpoint = '/api/admin/audit-logs';
            if (activeTab === 'teams') endpoint = '/api/admin/teams';
            if (activeTab === 'slas') endpoint = '/api/admin/slas';
            if (activeTab === 'staff') endpoint = '/api/admin/staff/all';

            const response = await fetch(`${API_BASE}${endpoint}`, {
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

    const fetchAgentsList = async () => {
        try {
            const token = localStorage.getItem('userToken');
            const response = await fetch(`${API_BASE}/api/admin/agents`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setAvailableAgents(data);
            }
        } catch (err) {
            console.error("Failed to load agents", err);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ==========================================
    // API ACTIONS
    // ==========================================

    const handleCreateStaff = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('userToken');
            const response = await fetch(`${API_BASE}/api/admin/staff`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name, email: formData.email, password: formData.password, role: formData.role
                })
            });
            if (!response.ok) throw new Error("Failed to create staff");
            setShowStaffModal(false);
            setFormData({ ...formData, name: '', email: '', password: '' });
            alert(`${formData.role} created successfully!`);
            fetchAdminData();
            fetchAgentsList();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleToggleStaffStatus = async (staffId) => {
        try {
            const token = localStorage.getItem('userToken');
            const response = await fetch(`${API_BASE}/api/admin/staff/${staffId}/toggle-status`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Failed to update status");
            fetchAdminData();
        } catch (err) { alert(err.message); }
    };

    const handleDeleteStaff = async (staffId) => {
        if (!window.confirm("Are you sure you want to permanently delete this user? This cannot be undone.")) return;
        try {
            const token = localStorage.getItem('userToken');
            const response = await fetch(`${API_BASE}/api/admin/staff/${staffId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Failed to delete staff");
            fetchAdminData();
            fetchAgentsList();
        } catch (err) { alert(err.message); }
    };

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('userToken');
            const response = await fetch(`${API_BASE}/api/admin/teams`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: formData.teamName, handlesCategory: formData.handlesCategory })
            });
            if (!response.ok) throw new Error("Failed to create team");
            setShowTeamModal(false);
            setFormData({ ...formData, teamName: '', handlesCategory: '' });
            fetchAdminData();
        } catch (err) { alert(err.message); }
    };

    const handleAssignAgent = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('userToken');
            const response = await fetch(`${API_BASE}/api/admin/teams/${selectedTeamId}/agents/${formData.agentId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Failed to assign agent");
            setShowAssignModal(false);
            setFormData({ ...formData, agentId: '' });
            fetchAdminData();
        } catch (err) { alert(err.message); }
    };

    const handleRemoveAgentFromTeam = async (teamId, agentId) => {
        if(!window.confirm("Remove this agent from the team? They will be unassigned.")) return;
        try {
            const token = localStorage.getItem('userToken');
            const response = await fetch(`${API_BASE}/api/admin/teams/${teamId}/agents/${agentId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Failed to remove agent");
            fetchAdminData();
            fetchAgentsList();
        } catch (err) { alert(err.message); }
    };

    // NEW: Handle Moving Agent between teams
    const handleMoveAgent = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('userToken');
            const response = await fetch(`${API_BASE}/api/admin/teams/${moveData.oldTeamId}/agents/${moveData.agentId}/move/${moveData.newTeamId}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Failed to move agent");
            setShowMoveModal(false);
            setMoveData({ agentId: '', oldTeamId: '', newTeamId: '', agentName: '' });
            fetchAdminData();
        } catch (err) { alert(err.message); }
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

    const assignedAgentIds = activeTab === 'teams' ? data.flatMap(team => team.agents?.map(a => a.id) || []) : [];
    const unassignedAgents = availableAgents.filter(agent => !assignedAgentIds.includes(agent.id));

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
            
            {/* Sidebar */}
            <div className="w-64 bg-slate-900 text-white flex flex-col justify-between shadow-2xl z-10">
                <div className="p-6">
                    <div className="flex items-center space-x-3 mb-1">
                        <TicketIcon className="w-8 h-8 text-purple-400" />
                        <h2 className="text-2xl font-extrabold tracking-tight">DeskMind</h2>
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 pl-11">Admin Console</p>
                    <div className="w-full h-px bg-slate-800 mb-8"></div>
                    
                    <nav className="space-y-2">
                        <button onClick={() => setActiveTab('audit')} className={getTabClass('audit')}>
                            <ClipboardDocumentListIcon className="w-5 h-5 mr-3" /> Audit Ledger
                        </button>
                        <button onClick={() => setActiveTab('teams')} className={getTabClass('teams')}>
                            <UserGroupIcon className="w-5 h-5 mr-3" /> Support Teams
                        </button>
                        <button onClick={() => setActiveTab('staff')} className={getTabClass('staff')}>
                            <UserIcon className="w-5 h-5 mr-3" /> Staff Directory
                        </button>
                        <button onClick={() => setActiveTab('slas')} className={getTabClass('slas')}>
                            <ClockIcon className="w-5 h-5 mr-3" /> SLA Configs
                        </button>
                        <button onClick={() => navigate('/admin/analytics')} className="w-full flex items-center px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl font-medium transition-all border border-transparent">
                            <ChartBarIcon className="w-5 h-5 mr-3" /> Performance Analytics
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
            <div className="flex-1 px-8 py-10 overflow-y-auto relative">
                
                {/* Header Section */}
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 mb-1">
                            {activeTab === 'audit' && 'System Audit Ledger'}
                            {activeTab === 'teams' && 'Team Routing Configuration'}
                            {activeTab === 'staff' && 'Global Staff Directory'}
                            {activeTab === 'slas' && 'Service Level Agreements (SLAs)'}
                        </h1>
                        <p className="text-slate-500 font-medium">
                            {activeTab === 'audit' && 'Immutable record of system actions and routing events.'}
                            {activeTab === 'teams' && 'Manage AI categories and team assignments.'}
                            {activeTab === 'staff' && 'Manage Agents, Supervisors, and system access.'}
                            {activeTab === 'slas' && 'Configure priority-based response deadlines.'}
                        </p>
                    </div>

                    <div className="flex space-x-3">
                        {activeTab === 'staff' && (
                            <button onClick={() => setShowStaffModal(true)} className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 font-bold rounded-lg hover:bg-indigo-200 transition">
                                <UserPlusIcon className="w-5 h-5 mr-2" /> Add Staff
                            </button>
                        )}
                        {activeTab === 'teams' && (
                            <button onClick={() => setShowTeamModal(true)} className="flex items-center px-4 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition">
                                <PlusIcon className="w-5 h-5 mr-2" /> Create Team
                            </button>
                        )}
                    </div>
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
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Team Name</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">AI Route</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Agents</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                                        </>
                                    )}
                                    {activeTab === 'staff' && (
                                        <>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">User Name</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Role</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Manage</th>
                                        </>
                                    )}
                                    {activeTab === 'slas' && (
                                        <>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Priority Level</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Deadline</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data.map((item, index) => (
                                    <tr key={item.id || index} className="hover:bg-slate-50/50 transition-colors">
                                        {activeTab === 'audit' && (
                                            <>
                                                <td className="px-6 py-4 text-sm font-medium text-slate-500 whitespace-nowrap">{new Date(item.timestamp).toLocaleString()}</td>
                                                <td className="px-6 py-4"><span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">{item.action}</span></td>
                                                <td className="px-6 py-4 text-sm font-medium text-slate-900">{item.performedBy}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600">{item.details}</td>
                                            </>
                                        )}
                                        {activeTab === 'teams' && (
                                            <>
                                                <td className="px-6 py-4 text-sm font-bold text-slate-900">{item.name}</td>
                                                <td className="px-6 py-4"><span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">{item.handlesCategory}</span></td>
                                                <td className="px-6 py-4">
                                                    {item.agents && item.agents.length > 0 ? (
                                                        <div className="flex flex-wrap gap-2">
                                                            {item.agents.map(agent => (
                                                                <span key={agent.id} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 group">
                                                                    {agent.name}
                                                                    
                                                                    {/* NEW: Move Agent Button */}
                                                                    <button 
                                                                        onClick={() => {
                                                                            setMoveData({ agentId: agent.id, oldTeamId: item.id, newTeamId: '', agentName: agent.name });
                                                                            setShowMoveModal(true);
                                                                        }}
                                                                        className="ml-2 text-slate-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                        title="Move to another team"
                                                                    >
                                                                        <ArrowsRightLeftIcon className="w-3.5 h-3.5" />
                                                                    </button>

                                                                    <button 
                                                                        onClick={() => handleRemoveAgentFromTeam(item.id, agent.id)}
                                                                        className="ml-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                        title="Remove from team"
                                                                    >
                                                                        <XMarkIcon className="w-3.5 h-3.5" />
                                                                    </button>
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm font-medium text-slate-400 italic">No agents assigned</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button 
                                                        onClick={() => { setSelectedTeamId(item.id); setShowAssignModal(true); }}
                                                        className="text-sm font-bold text-purple-600 hover:text-purple-800"
                                                    >
                                                        + Assign Agent
                                                    </button>
                                                </td>
                                            </>
                                        )}
                                        {activeTab === 'staff' && (
                                            <>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-bold text-slate-900">{item.name}</div>
                                                    <div className="text-xs font-medium text-slate-500">{item.email}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${item.role === 'MANAGER' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                                                        {item.role === 'MANAGER' ? 'Global Supervisor' : 'Support Agent'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${item.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                        {item.isActive ? 'Active' : 'Blocked'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end space-x-2">
                                                        <button 
                                                            onClick={() => handleToggleStaffStatus(item.id)}
                                                            className={`p-1.5 rounded-lg border transition-colors ${item.isActive ? 'text-slate-400 border-slate-200 hover:text-amber-600 hover:bg-amber-50 hover:border-amber-200' : 'text-emerald-600 border-emerald-200 bg-emerald-50 hover:bg-emerald-100'}`}
                                                            title={item.isActive ? "Block User" : "Unblock User"}
                                                        >
                                                            {item.isActive ? <NoSymbolIcon className="w-5 h-5" /> : <CheckCircleIcon className="w-5 h-5" />}
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteStaff(item.id)}
                                                            className="p-1.5 text-slate-400 border border-slate-200 rounded-lg hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
                                                            title="Delete User"
                                                        >
                                                            <TrashIcon className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                        {activeTab === 'slas' && (
                                            <>
                                                <td className="px-6 py-4"><span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-900 text-white">{item.priority}</span></td>
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

            {/* --- MODALS --- */}
            
            {showStaffModal && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
                        <h2 className="text-xl font-bold mb-4">Add New Staff</h2>
                        <form onSubmit={handleCreateStaff} className="space-y-4">
                            <input name="name" onChange={handleInputChange} placeholder="Full Name" required className="w-full p-2 border rounded-lg bg-slate-50" />
                            <input name="email" type="email" onChange={handleInputChange} placeholder="Email Address" required className="w-full p-2 border rounded-lg bg-slate-50" />
                            <input name="password" type="password" onChange={handleInputChange} placeholder="Temporary Password" required className="w-full p-2 border rounded-lg bg-slate-50" />
                            <select name="role" onChange={handleInputChange} className="w-full p-2 border rounded-lg font-medium bg-slate-50">
                                <option value="AGENT">Support Agent (Team Member)</option>
                                <option value="MANAGER">Global Supervisor (Manager)</option>
                            </select>
                            <div className="flex justify-end space-x-2 pt-4">
                                <button type="button" onClick={() => setShowStaffModal(false)} className="px-4 py-2 text-slate-500 hover:text-slate-700 font-medium">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700">Create Staff</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showTeamModal && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
                        <h2 className="text-xl font-bold mb-4">Create Support Team</h2>
                        <form onSubmit={handleCreateTeam} className="space-y-4">
                            <input name="teamName" onChange={handleInputChange} placeholder="Team Name (e.g. Billing Squad)" required className="w-full p-2 border rounded-lg bg-slate-50" />
                            <input name="handlesCategory" onChange={handleInputChange} placeholder="AI Route Category (e.g. BILLING)" required className="w-full p-2 border rounded-lg bg-slate-50" />
                            <div className="flex justify-end space-x-2 pt-4">
                                <button type="button" onClick={() => setShowTeamModal(false)} className="px-4 py-2 text-slate-500 hover:text-slate-700 font-medium">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700">Create Team</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showAssignModal && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
                        <h2 className="text-xl font-bold mb-4">Assign Agent to Team</h2>
                        <form onSubmit={handleAssignAgent} className="space-y-4">
                            <select 
                                name="agentId" 
                                onChange={handleInputChange} 
                                value={formData.agentId}
                                required 
                                className="w-full p-2 border rounded-lg bg-slate-50 text-slate-700"
                            >
                                <option value="" disabled>Select an available Agent...</option>
                                {unassignedAgents.map(agent => (
                                    <option key={agent.id} value={agent.id}>
                                        {agent.name} ({agent.email})
                                    </option>
                                ))}
                                {unassignedAgents.length === 0 && (
                                    <option value="" disabled>No available agents to assign.</option>
                                )}
                            </select>

                            <div className="flex justify-end space-x-2 pt-4">
                                <button type="button" onClick={() => setShowAssignModal(false)} className="px-4 py-2 text-slate-500 hover:text-slate-700 font-medium">Cancel</button>
                                <button type="submit" disabled={unassignedAgents.length === 0} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 disabled:opacity-50">Assign</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* NEW: Move Agent Modal */}
            {showMoveModal && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
                        <h2 className="text-xl font-bold mb-4">Move {moveData.agentName}</h2>
                        <form onSubmit={handleMoveAgent} className="space-y-4">
                            <select 
                                required
                                value={moveData.newTeamId}
                                onChange={(e) => setMoveData({...moveData, newTeamId: e.target.value})}
                                className="w-full p-2 border rounded-lg bg-slate-50 text-slate-700"
                            >
                                <option value="" disabled>Select destination team...</option>
                                {/* Only show teams that are NOT the agent's current team */}
                                {data.filter(t => t.id !== moveData.oldTeamId).map(team => (
                                    <option key={team.id} value={team.id}>
                                        {team.name} ({team.handlesCategory})
                                    </option>
                                ))}
                            </select>
                            <div className="flex justify-end space-x-2 pt-4">
                                <button type="button" onClick={() => setShowMoveModal(false)} className="px-4 py-2 text-slate-500 hover:text-slate-700 font-medium">Cancel</button>
                                <button type="submit" disabled={!moveData.newTeamId} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50">Move Agent</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;