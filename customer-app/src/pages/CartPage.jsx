import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useTable } from '../context/TableContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const CartPage = () => {
    const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
    const { tableId } = useTable();
    const navigate = useNavigate();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Trash2 className="text-gray-400" size={32} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
                <button 
                  onClick={() => navigate('/menu')}
                  className="px-8 py-3 bg-green-600 text-white font-bold rounded-xl shadow hover:bg-green-700"
                >
                  Browse Menu
                </button>
            </div>
        );
    }

    const handleCheckout = async () => {
        if (!tableId) {
            toast.error('Table session invalid. Please scan QR again.');
            return;
        }
        
        setIsCheckingOut(true);
        const toastId = toast.loading('Initiating payment...');
        
        try {
             // 1. Initiate Payment Order on Backend
             const paymentResponse = await api.post('/payment/initiate', { amount: cartTotal });
             const { id, amount, currency } = paymentResponse.data;
             
             // 2. Open Razorpay Modal
             const options = {
                key: "rzp_test_S1i9681Y2RCCmg", // Provided Key ID
                amount: amount, 
                currency: currency,
                name: "RoyDish Restaurant",
                description: `Bill Payment - Table ${tableId}`,
                image: "https://placehold.co/100x100?text=RD", // App Logo
                
                // Only pass order_id if it's a REAL order (not our mock fallback)
                // Razorpay mocks start with "order_mock_" which aren't valid on real servers
                ...(id && !id.startsWith('order_mock_') ? { order_id: id } : {}),

                handler: async function (response) {
                    toast.loading('Verifying payment...', { id: toastId });
                    
                    try {
                        // 3. Verify Payment
                        const verifyRes = await api.post('/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id || id, // use backend id if ad-hoc
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature || 'ad_hoc_signature'
                        });

                        if (verifyRes.data.status === 'success') {
                            // 4. Create Order in Backend
                            const orderData = {
                                table_id: tableId,
                                total_amount: cartTotal,
                                payment_id: response.razorpay_payment_id,
                                items: cartItems.map(i => ({ menu_item_id: i.item_id, quantity: i.quantity }))
                            };
                            
                            const orderRes = await api.post('/orders/create', orderData);
                            
                            if (orderRes.data.order) {
                                toast.success('Order placed successfully!', { id: toastId });
                                clearCart();
                                // Persist order ID for tracking
                                localStorage.setItem('last_order_id', orderRes.data.order.order_id);
                                navigate(`/track/${orderRes.data.order.order_id}`);
                            }
                        } else {
                            toast.error('Payment verification failed', { id: toastId });
                        }
                    } catch (err) {
                        console.error(err);
                        toast.error('Order creation failed', { id: toastId });
                    }
                },
                prefill: {
                    name: "Guest User",
                    contact: "9999999999",
                    email: "guest@rolydish.com" 
                },
                theme: {
                    color: "#10B981"
                },
                modal: {
                    ondismiss: function() {
                        toast.dismiss(toastId);
                        toast.error('Payment cancelled');
                        setIsCheckingOut(false);
                    }
                }
            };
            
            if (!window.Razorpay) {
                toast.error('Payment gateway failed to load. Please refresh.');
                setIsCheckingOut(false);
                return;
            }

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                toast.error(response.error.description);
                setIsCheckingOut(false);
            });
            rzp.open();
             
        } catch (err) {
            console.error(err);
            toast.error('Checkout failed. Please try again.', { id: toastId });
            setIsCheckingOut(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                 <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-xl font-bold">Your Cart</h2>
            </div>

            <div className="space-y-4">
                {cartItems.map((item) => (
                    <div key={item.item_id} className="flex gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
                        <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-gray-100" />
                        
                        <div className="flex-1 flex flex-col justify-between">
                            <div className="flex justify-between">
                                <h3 className="font-bold text-sm line-clamp-1">{item.name}</h3>
                                <span className="font-bold">₹{item.price * item.quantity}</span>
                            </div>
                            
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-xs text-gray-400">₹{item.price} each</span>
                                
                                <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1">
                                    <button onClick={() => updateQuantity(item.item_id, -1)} className="p-0.5"><div className="w-4 h-0.5 bg-gray-400"></div></button>
                                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.item_id, 1)} className="p-0.5 text-gray-600 font-bold">+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bill Details */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50 space-y-3">
                <h3 className="font-bold text-gray-900 text-sm">Bill Details</h3>
                <div className="flex justify-between text-sm text-gray-500">
                    <span>Item Total</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                    <span>Taxes (5%)</span>
                    <span>₹{(cartTotal * 0.05).toFixed(2)}</span>
                </div>
                <div className="border-t border-dashed border-gray-200 my-2"></div>
                <div className="flex justify-between font-bold text-lg">
                    <span>To Pay</span>
                    <span>₹{(cartTotal * 1.05).toFixed(2)}</span>
                </div>
            </div>

            {/* Pay Button */}
            <button 
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-4 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 active:scale-95 transition-all flex justify-between items-center px-6 disabled:opacity-70 disabled:scale-100"
            >
                <span>{isCheckingOut ? 'Processing...' : 'Proceed to Pay'}</span>
                {!isCheckingOut && <span>₹{(cartTotal * 1.05).toFixed(2)} <ChevronRight className="inline ml-1" size={20} /></span>}
            </button>
        </div>
    );
};

export default CartPage;
