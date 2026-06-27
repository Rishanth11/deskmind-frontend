import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowDownTrayIcon, ChartBarIcon, ExclamationTriangleIcon, CheckCircleIcon, TicketIcon } from '@heroicons/react/24/outline';

const AnalyticsDashboard = () => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

    const API_BASE = 'https://deskmind-3kq3.onrender.com';

    useEffect(() => {
        fetchMetrics();
    }, []);

    const fetchMetrics = async () => {
        try {
            const token = localStorage.getItem('userToken');
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
            const response = await fetch(`${API_BASE}/api/analytics/export/csv`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (!response.ok) throw new Error("Export failed");
            
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

    if (loading) return <div className="flex justify-center items-center h-screen bg-slate-50"><div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-indigo-600"></div></div>;
    if (error) return <div className="p-4 sm:p-8 text-red-600 bg-red-50 min-h-screen">{error}</div>;

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-8 sm:py-8 font-sans">
            <div className="max-w-7xl mx-auto">
                
                {/* Header & Export (Stacked on mobile, row on desktop) */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center">
                            <ChartBarIcon className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-indigo-600 flex-shrink-0" /> 
                            Performance Analytics
                        </h1>
                        <p className="text-sm sm:text-base text-slate-500 mt-1 font-medium">Monitor ticket volume, agent performance, and system health.</p>
                    </div>
                    <button 
                        onClick={handleExportCSV} 
                        className="w-full sm:w-auto flex items-center justify-center px-4 py-2.5 sm:py-2 bg-slate-900 text-white text-sm sm:text-base font-bold rounded-xl shadow-sm hover:bg-slate-800 transition-colors"
                    >
                        <ArrowDownTrayIcon className="w-5 h-5 mr-2" /> Export to CSV
                    </button>
                </div>

                {/* KPI Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
                        <div>
                            <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase">Open Tickets</p>
                            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{metrics.totalOpenTickets}</p>
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <TicketIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                    </div>
                    <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
                        <div>
                            <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase">Resolved Today</p>
                            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">{metrics.resolvedToday}</p>
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                    </div>
                    <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-red-200 flex items-center justify-between sm:col-span-2 lg:col-span-1">
                        <div>
                            <p className="text-xs sm:text-sm font-bold text-red-500 uppercase">Active SLA Breaches</p>
                            <p className="text-2xl sm:text-3xl font-extrabold text-red-600 mt-1">{metrics.slaBreaches}</p>
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <ExclamationTriangleIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                    </div>
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    {/* Bar Chart: Tickets per Day */}
                    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 sm:mb-6">Ticket Volume (Last 30 Days)</h3>
                        <div className="h-64 sm:h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={metrics.ticketsPerDay}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="date" tick={{fontSize: 10, fill: '#64748b'}} tickLine={false} axisLine={false} />
                                    <YAxis tick={{fontSize: 10, fill: '#64748b'}} tickLine={false} axisLine={false} width={30} />
                                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px'}} />
                                    <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Pie Chart: Categories */}
                    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 sm:mb-4">Ticket Distribution by Category</h3>
                        <div className="h-56 sm:h-64 flex justify-center flex-1">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={metrics.ticketsByCategory} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={5} dataKey="count" nameKey="category">
                                        {metrics.ticketsByCategory.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px'}} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        {/* Custom Legend */}
                        <div className="flex flex-wrap justify-center gap-3 mt-4 sm:mt-2">
                            {metrics.ticketsByCategory.map((entry, index) => (
                                <div key={entry.category} className="flex items-center text-xs sm:text-sm font-medium text-slate-600">
                                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full mr-1.5 sm:mr-2 flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                    <span className="truncate max-w-[100px] sm:max-w-none">{entry.category} ({entry.count})</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Agent Performance Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900">Agent Performance (Resolved Tickets)</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[400px]">
                            <thead>
                                <tr className="bg-slate-50">
                                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-bold text-slate-500 uppercase">Agent Name</th>
                                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-bold text-slate-500 uppercase text-right sm:text-left">Total Tickets Resolved</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {metrics.agentPerformance.map((agent, index) => (
                                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 font-bold text-sm sm:text-base text-slate-900">{agent.agentName}</td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-slate-600 text-right sm:text-left">
                                            <span className="inline-flex items-center px-2 sm:px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs sm:text-sm font-bold">
                                                {agent.ticketsHandled} resolved
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {metrics.agentPerformance.length === 0 && (
                                    <tr><td colSpan="2" className="px-4 sm:px-6 py-8 text-center text-sm text-slate-500 font-medium">No resolved tickets yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AnalyticsDashboard;