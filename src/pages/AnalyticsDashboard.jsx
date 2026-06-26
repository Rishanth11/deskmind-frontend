import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowDownTrayIcon, ChartBarIcon, ExclamationTriangleIcon, CheckCircleIcon, TicketIcon } from '@heroicons/react/24/outline';

const AnalyticsDashboard = () => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

    // FIXED: Added the production API URL
    const API_BASE = 'https://deskmind-3kq3.onrender.com';

    useEffect(() => {
        fetchMetrics();
    }, []);

    const fetchMetrics = async () => {
        try {
            const token = localStorage.getItem('userToken');
            // FIXED: Replaced localhost with dynamic API_BASE
            const response = await fetch(`${API_BASE}/api/analytics/dashboard`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Failed to load analytics");
            const data = await response.json();
            setMetrics(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleExportCSV = async () => {
        try {
            const token = localStorage.getItem('userToken');
            // FIXED: Replaced localhost with dynamic API_BASE
            const response = await fetch(`${API_BASE}/api/analytics/export/csv`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (!response.ok) throw new Error("Export failed");
            
            // Trigger file download in browser
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'tickets_export.csv';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
    if (error) return <div className="p-8 text-red-600 bg-red-50">{error}</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                
                {/* Header & Export */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center">
                            <ChartBarIcon className="w-8 h-8 mr-3 text-indigo-600" /> Performance Analytics
                        </h1>
                        <p className="text-slate-500 mt-1 font-medium">Monitor ticket volume, agent performance, and system health.</p>
                    </div>
                    <button onClick={handleExportCSV} className="flex items-center px-4 py-2 bg-slate-900 text-white font-bold rounded-lg shadow-sm hover:bg-slate-800 transition-colors">
                        <ArrowDownTrayIcon className="w-5 h-5 mr-2" /> Export to CSV
                    </button>
                </div>

                {/* KPI Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase">Open Tickets</p>
                            <p className="text-3xl font-extrabold text-slate-900 mt-1">{metrics.totalOpenTickets}</p>
                        </div>
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                            <TicketIcon className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase">Resolved Today</p>
                            <p className="text-3xl font-extrabold text-emerald-600 mt-1">{metrics.resolvedToday}</p>
                        </div>
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                            <CheckCircleIcon className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-200 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-red-500 uppercase">Active SLA Breaches</p>
                            <p className="text-3xl font-extrabold text-red-600 mt-1">{metrics.slaBreaches}</p>
                        </div>
                        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                            <ExclamationTriangleIcon className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Bar Chart: Tickets per Day */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Ticket Volume (Last 30 Days)</h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={metrics.ticketsPerDay}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} tickLine={false} axisLine={false} />
                                    <YAxis tick={{fontSize: 12, fill: '#64748b'}} tickLine={false} axisLine={false} />
                                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                    <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Pie Chart: Categories */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Ticket Distribution by Category</h3>
                        <div className="h-72 flex justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={metrics.ticketsByCategory} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="count" nameKey="category">
                                        {metrics.ticketsByCategory.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        {/* Custom Legend */}
                        <div className="flex flex-wrap justify-center gap-4 mt-2">
                            {metrics.ticketsByCategory.map((entry, index) => (
                                <div key={entry.category} className="flex items-center text-sm font-medium text-slate-600">
                                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                    {entry.category} ({entry.count})
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Agent Performance Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900">Agent Performance (Resolved Tickets)</h3>
                    </div>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Agent Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Total Tickets Resolved</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {metrics.agentPerformance.map((agent, index) => (
                                <tr key={index} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-900">{agent.agentName}</td>
                                    <td className="px-6 py-4 font-medium text-slate-600">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700">
                                            {agent.ticketsHandled} resolved
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {metrics.agentPerformance.length === 0 && (
                                <tr><td colSpan="2" className="px-6 py-8 text-center text-slate-500 font-medium">No resolved tickets yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default AnalyticsDashboard;