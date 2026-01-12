import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle2, ChefHat } from 'lucide-react';
import api from '../services/api';
import io from 'socket.io-client';

const RecentOrders = () => {
    const [orders, setOrders] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        fetchOrders();
        
        // Connect to socket for real-time updates
        // Note: Using a separate socket connection here or could use Context if we moved SocketProvider up
        // For Manager App, we haven't wrapped it in SocketProvider yet, so simple connection:
        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);

        newSocket.on('connect', () => {
            newSocket.emit('join-manager'); // Ensure backend supports this or just joins default
        });

        newSocket.on('new-order', (data) => {
            // Re-fetch to get full details or manually construct object
            // Creating a temp object for immediate feedback
            const newOrder = {
                order_id: data.order_id,
                table_id: data.table_id,
                total_amount: data.total_amount,
                order_status: 'pending',
                createdAt: new Date().toISOString(),
                Table: { table_id: data.table_id } // Mock structure matching API
            };
            setOrders(prev => [newOrder, ...prev]);
        });
        
        newSocket.on('order-completed', (data) => {
             setOrders(prev => prev.map(order => 
                order.order_id === data.order_id 
                    ? { ...order, order_status: 'completed' } 
                    : order
             ));
        });

        return () => newSocket.close();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders/active');
            if (Array.isArray(res.data)) {
                setOrders(res.data);
            } else {
                console.error('Invalid orders data:', res.data);
                setOrders([]);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'pending': return 'text-orange-500 bg-orange-50';
            case 'preparing': return 'text-blue-500 bg-blue-50';
            case 'ready': return 'text-green-500 bg-green-50';
            case 'completed': return 'text-gray-500 bg-gray-50';
            default: return 'text-gray-500 bg-gray-50';
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-full flex flex-col">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <ChefHat className="text-slate-400" size={20} />
                Recent Orders
            </h2>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {!Array.isArray(orders) || orders.length === 0 ? (
                    <div className="text-center text-slate-400 py-10">No active orders</div>
                ) : (
                    orders.map(order => (
                        <div key={order.order_id} className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${getStatusColor(order.order_status)}`}>
                                    {order.Table?.table_id || 'T-?'}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-700 text-sm">{order.order_id}</h4>
                                    <p className="text-xs text-slate-400">
                                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        {' • '}<span className="font-semibold text-slate-600">₹{order.total_amount}</span>
                                    </p>
                                </div>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded font-medium capitalize ${getStatusColor(order.order_status)}`}>
                                {order.order_status}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RecentOrders;
