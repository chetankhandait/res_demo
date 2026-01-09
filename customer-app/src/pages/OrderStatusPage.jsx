import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { CheckCircle2, CircleDashed, ChefHat, Clock, AlertCircle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const OrderStatusPage = () => {
    const { orderId } = useParams();
    const socket = useSocket();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrder();
        
        if (socket) {
            // Join table room isn't enough, we need to listen for specific order updates if possible,
            // or just listen to table updates.
            // Backend emits 'order-ready' to table room.
            
            socket.on('order-ready', (data) => {
                if (data.order_id === orderId) {
                    toast.success('Your order is ready!', { duration: 5000 });
                    fetchOrder(); // Refresh to get updated status
                }
            });

            return () => {
                socket.off('order-ready');
            };
        }
    }, [orderId, socket]);

    const fetchOrder = async () => {
        try {
            const res = await api.get(`/orders/${orderId}/status`);
            setOrder(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load order status');
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading status...</div>;
    if (!order) return <div className="p-8 text-center text-red-500">Order not found</div>;

    const getStatusStep = () => {
        switch(order.order_status) {
            case 'pending': return 1;
            case 'preparing': return 2;
            case 'ready': return 3;
            case 'completed': return 4;
            default: return 0;
        }
    };

    const currentStep = getStatusStep();

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-green-50 text-center">
                <div className="inline-block p-4 bg-green-50 rounded-full mb-4">
                    {order.order_status === 'ready' || order.order_status === 'completed' ? (
                        <CheckCircle2 size={48} className="text-green-600" />
                    ) : (
                        <ChefHat size={48} className="text-green-600 animate-bounce" />
                    )}
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {order.order_status === 'ready' ? 'Enjoy your meal!' : 'We are cooking!'}
                </h2>
                <p className="text-gray-500 text-sm">Order #{orderId.slice(-6)}</p>
                
                {/* Status Steps */}
                <div className="flex justify-between items-center mt-8 px-4 relative">
                    {/* Line */}
                    <div className="absolute top-1/2 left-4 right-4 h-1 bg-gray-100 -z-10"></div>
                    <div className="absolute top-1/2 left-4 right-4 h-1 bg-green-500 -z-10 transition-all duration-500" style={{ width: `${(currentStep - 1) * 33}%` }}></div>

                    {[
                        { label: 'Sent', step: 1 },
                        { label: 'Cooking', step: 2 },
                        { label: 'Ready', step: 3 },
                        { label: 'Done', step: 4 }
                    ].map((s) => (
                        <div key={s.step} className="flex flex-col items-center bg-white">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${currentStep >= s.step ? 'border-green-500 bg-green-500 text-white' : 'border-gray-200 bg-white text-gray-300'}`}>
                                {currentStep >= s.step ? <CheckCircle2 size={16} /> : <CircleDashed size={16} />}
                            </div>
                            <span className={`text-xs mt-2 font-medium ${currentStep >= s.step ? 'text-green-600' : 'text-gray-400'}`}>{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Items List */}
            <div className="bg-white p-5 rounded-2xl shadow-sm space-y-4">
                <h3 className="font-bold text-gray-900">Items Ordered</h3>
                {order.OrderItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${item.status === 'ready' ? 'bg-green-500' : 'bg-yellow-400'}`}></div>
                            <div>
                                <p className="font-medium text-gray-800">{item.MenuItem?.name}</p>
                                <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                            </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded font-medium ${
                            item.status === 'ready' ? 'bg-green-100 text-green-700' : 'bg-yellow-50 text-yellow-700'
                        }`}>
                            {item.status}
                        </span>
                    </div>
                ))}
            </div>

            <button onClick={() => navigate('/menu')} className="w-full py-3 text-green-600 font-bold border border-green-200 rounded-xl hover:bg-green-50">
                Order More
            </button>
        </div>
    );
};

export default OrderStatusPage;
