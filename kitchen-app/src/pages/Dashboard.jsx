import React, { useEffect, useState } from 'react';
import { useStation } from '../context/StationContext';
import { useSocket } from '../context/SocketContext';
import { LogOut, RefreshCcw, Bell } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const OrderItemCard = ({ item, onStart, onComplete }) => {
    // Priority Colors
    const getPriorityColor = (score) => {
        if (score > 80) return 'border-red-500 bg-red-50'; // High
        if (score > 50) return 'border-yellow-500 bg-yellow-50'; // Medium
        return 'border-green-500 bg-green-50'; // Low
    };

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`bg-white rounded-xl shadow-sm border-l-4 p-4 flex flex-col justify-between h-full ${getPriorityColor(item.priority_score)}`}
        >
             <div className="flex justify-between items-start mb-2">
                 <div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">#{String(item.id).padStart(4, '0')}</span>
                    <h3 className="font-bold text-lg text-gray-800 leading-tight mt-1">{item.MenuItem?.name}</h3>
                    <p className="text-sm text-gray-500">{item.Order?.Table?.table_id || 'Table ?'}</p>
                 </div>
                 <div className="text-xs font-bold bg-white/80 px-2 py-1 rounded shadow-sm">
                    {Math.round(item.priority_score)} pts
                 </div>
             </div>

             <div className="mt-4 pt-4 border-t border-gray-100/50">
                 {item.status === 'queued' ? (
                     <button 
                        onClick={() => onStart(item.id)}
                        className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                     >
                        Start Cooking
                     </button>
                 ) : item.status === 'preparing' ? (
                     <button 
                        onClick={() => onComplete(item.id)}
                        className="w-full py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                     >
                        Mark Ready
                     </button>
                 ) : (
                     <div className="text-center text-green-600 font-bold py-2">Done!</div>
                 )}
             </div>
        </motion.div>
    );
};

const Dashboard = () => {
    const { station, logout } = useStation();
    const socket = useSocket();
    const [queue, setQueue] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQueue();
        
        if (socket && station) {
            // Join station room
            socket.emit('join-station', station.id);

            // Listen for queue updates
            socket.on('queue-update', (data) => {
                // If update is for my category, refresh
                if (data.category === station.category) {
                     toast('New Order!', { icon: '🔔' });
                     fetchQueue();
                }
            });

            return () => {
                socket.off('queue-update');
            };
        }
    }, [station, socket]);

    const fetchQueue = async () => {
        try {
            const res = await api.get(`/kitchen/queue/${station.id}`);
            setQueue(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            toast.error('Failed to sync queue');
            setLoading(false);
        }
    };

    const handleStart = async (itemId) => {
        try {
            // Optimistic update
            setQueue(prev => prev.map(i => i.id === itemId ? { ...i, status: 'preparing' } : i));
            await api.post(`/kitchen/items/${itemId}/start`);
            // fetchQueue(); // Ensure sync
        } catch (err) {
            toast.error('Action failed');
            fetchQueue(); // Revert
        }
    };

    const handleComplete = async (itemId) => {
        try {
            // Optimistic remove
            setQueue(prev => prev.filter(i => i.id !== itemId));
            await api.post(`/kitchen/items/${itemId}/complete`);
            toast.success('Item Ready!');
        } catch (err) {
            toast.error('Action failed');
            fetchQueue();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold text-gray-800">{station.name}</h1>
                    <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">{station.category}</span>
                </div>
                
                <div className="flex items-center gap-4">
                    <button onClick={fetchQueue} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                        <RefreshCcw size={20} />
                    </button>
                    <button onClick={logout} className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors font-medium text-sm">
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </header>

            {/* Board */}
            <div className="flex-1 p-6 overflow-x-auto">
                {loading ? (
                    <div className="text-center py-20 text-gray-400">Loading orders...</div>
                ) : queue.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-gray-300">
                        <Bell size={64} className="mb-4" />
                        <h2 className="text-2xl font-bold">All caught up!</h2>
                        <p>Waiting for new orders...</p>
                    </div>
                ) : (
                    <motion.div layout className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        <AnimatePresence>
                            {queue.map(item => (
                                <OrderItemCard 
                                    key={item.id} 
                                    item={item} 
                                    onStart={handleStart} 
                                    onComplete={handleComplete} 
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
