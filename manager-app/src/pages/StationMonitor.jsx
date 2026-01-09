import React, { useEffect, useState } from 'react';
import { ChefHat, AlertCircle, Clock } from 'lucide-react';
import api from '../services/api';

const StationCard = ({ name, category, load, avgTime, status }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
        <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${status === 'Overloaded' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    <ChefHat size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">{name}</h3>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">{category}</p>
                </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                status === 'Overloaded' ? 'bg-red-100 text-red-600' : 
                status === 'Busy' ? 'bg-orange-100 text-orange-600' : 
                'bg-green-100 text-green-600'
            }`}>
                {status}
            </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs text-slate-400 mb-1">Active Orders</p>
                <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-blue-500" />
                    <span className="font-bold text-slate-700">{load} items</span>
                </div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs text-slate-400 mb-1">Avg Prep Time</p>
                <div className="flex items-center gap-2">
                    <Clock size={16} className="text-orange-500" />
                    <span className="font-bold text-slate-700">{avgTime}m</span>
                </div>
            </div>
        </div>
        
        {/* Load Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
                className={`h-full rounded-full transition-all duration-500 ${
                    load > 10 ? 'bg-red-500' : load > 5 ? 'bg-orange-500' : 'bg-green-500'
                }`} 
                style={{ width: `${Math.min((load / 15) * 100, 100)}%` }}
            />
        </div>
    </div>
);

const StationMonitor = () => {
    const [stations, setStations] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/kitchen/stats');
                setStations(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchStats();
        // Poll every 5 seconds for live updates
        const interval = setInterval(fetchStats, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-8 space-y-8">
            <header>
                <h1 className="text-2xl font-bold text-slate-800">Kitchen Monitor</h1>
                <p className="text-slate-500">Live output & load balancing</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stations.map(station => (
                    <StationCard key={station.id} {...station} />
                ))}
            </div>
        </div>
    );
};

export default StationMonitor;
