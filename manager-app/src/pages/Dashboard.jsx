import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Users, Timer, RefreshCcw, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import RecentOrders from '../components/RecentOrders';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
            <Icon size={24} className="text-white" />
        </div>
        <div>
            <p className="text-sm text-slate-400 font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        </div>
    </div>
);

const Dashboard = () => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ revenue: 0, activeTables: 0 });

    const fetchTables = async () => {
        try {
            const res = await api.get('/tables');
            setTables(res.data);
            
            // Calc stats
            const active = res.data.filter(t => t.status === 'occupied').length;
            setStats(prev => ({ ...prev, activeTables: active }));
            
            setLoading(false);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch tables');
        }
    };

    useEffect(() => {
        fetchTables();
        const interval = setInterval(fetchTables, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    const handleFreeTable = async (tableId) => {
        if (!confirm(`Are you sure you want to free Table ${tableId}?`)) return;
        
        try {
            await api.post(`/tables/${tableId}/free`);
            toast.success(`Table ${tableId} is now free`);
            fetchTables();
        } catch (err) {
            toast.error('Failed to update table');
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Live Overview</h1>
                    <p className="text-slate-500">Real-time floor status</p>
                </div>
                <button 
                  onClick={fetchTables}
                  className="p-2 text-slate-400 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                >
                    <RefreshCcw size={20} />
                </button>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Active Tables" 
                    value={stats.activeTables} 
                    icon={Users} 
                    color="bg-blue-500" 
                />
                <StatCard 
                    title="Total Revenue" 
                    value="₹12,450" 
                    icon={DollarSign} 
                    color="bg-green-500" 
                />
                <StatCard 
                    title="Avg Wait Time" 
                    value="12m" 
                    icon={Timer} 
                    color="bg-orange-500" 
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Table Grid (Takes 2 columns) */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-bold text-slate-700">Floor Plan</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {tables.map(table => (
                            <div 
                                key={table.table_id} 
                                className={`
                                    relative h-32 rounded-2xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-[1.02]
                                    ${table.status === 'occupied' 
                                        ? 'bg-red-50 border-red-200 shadow-sm shadow-red-100' 
                                        : 'bg-green-50 border-green-200 shadow-sm shadow-green-100'
                                    }
                                `}
                                onClick={() => table.status === 'occupied' && handleFreeTable(table.table_id)}
                            >
                                <span className={`
                                    text-xl font-bold mb-1
                                    ${table.status === 'occupied' ? 'text-red-700' : 'text-green-700'}
                                `}>
                                    {table.table_id}
                                </span>
                                
                                <span className={`
                                    text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider
                                    ${table.status === 'occupied' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}
                                `}>
                                    {table.status}
                                </span>

                                <span className="absolute top-3 right-3 text-xs text-slate-400 flex items-center gap-1">
                                    <Users size={12} /> {table.capacity}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Recent Orders (Takes 1 column) */}
                <div className="h-[600px]">
                     <RecentOrders />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
