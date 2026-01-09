import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { IndianRupee, TrendingUp, Users } from 'lucide-react';
import api from '../services/api';

const Analytics = () => {
    const [metrics, setMetrics] = useState({ revenue: 0, ordersPerDay: 0, occupancyRate: 0 });
    const [data, setData] = useState({ hourly: [], categories: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [metricsRes, hourlyRes, categoryRes] = await Promise.all([
                    api.get('/analytics/today'),
                    api.get('/analytics/hourly-sales'),
                    api.get('/analytics/popular-categories')
                ]);
                
                setMetrics(metricsRes.data);
                setData({ hourly: hourlyRes.data, categories: categoryRes.data });
                setLoading(false);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-2xl font-bold text-slate-800">Business Analytics</h1>
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                            <IndianRupee size={24} />
                        </div>
                        <span className="text-slate-500 font-medium">Daily Revenue</span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-800">₹{metrics.revenue}</h3>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                            <TrendingUp size={24} />
                        </div>
                        <span className="text-slate-500 font-medium">Total Orders</span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-800">{metrics.ordersPerDay}</h3>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                            <Users size={24} />
                        </div>
                        <span className="text-slate-500 font-medium">Occupancy Rate</span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-800">{metrics.occupancyRate}%</h3>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sales Trend */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-[400px]">
                    <h3 className="text-lg font-bold text-slate-700 mb-6">Hourly Sales Trend</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <LineChart data={data.hourly}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip />
                            <Line type="monotone" dataKey="sales" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Popular Categories */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-[400px]">
                    <h3 className="text-lg font-bold text-slate-700 mb-6">Popular Categories</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={data.categories}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip cursor={{fill: '#f8fafc'}} />
                            <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={50} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
