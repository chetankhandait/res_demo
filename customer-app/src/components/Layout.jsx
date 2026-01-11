import React from 'react';
import { useCart } from '../context/CartContext';
import { useTable } from '../context/TableContext';
import { ShoppingBag, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import TableSelector from './TableSelector';

const Layout = ({ children }) => {
  const { cartCount, cartTotal } = useCart();
  const { tableId } = useTable();
  const location = useLocation();

  const isCartPage = location.pathname === '/cart';

  const [showTableSelector, setShowTableSelector] = React.useState(false);
  const { setTableId } = useTable();
  const navigate = useNavigate(); // Hook for navigation
  
  // Check for active order
  const lastOrderId = localStorage.getItem('last_order_id');

  const handleTableChange = (newId) => {
    setTableId(newId);
    localStorage.setItem('restaurant_table_id', newId);
    setShowTableSelector(false);
  };

  const handleLogout = () => {
      // Clear all session data to ensure a full demo reset
      localStorage.removeItem('customer_phone');
      localStorage.removeItem('restaurant_table_id');
      localStorage.removeItem('last_order_id');
      localStorage.removeItem('cart_items'); // Clear persisted cart
      
      // Optional: Clear cart if it persisted in local storage (if CustomCartContext does that)
      // Usually good practice to clear everything related to the user "session"
      
      window.location.href = '/'; 
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      {/* Table Selector Modal */}
      {showTableSelector && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
           <div className="w-full max-w-sm">
              <TableSelector 
                initialTable={tableId || ''} 
                onConfirm={handleTableChange} 
                onCancel={() => setShowTableSelector(false)} 
              />
           </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-20">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">RoyDish</h1>
            <div className="flex items-center gap-2 mt-0.5">
                {tableId && (
                    <button 
                      onClick={() => setShowTableSelector(true)}
                      className="text-xs text-green-700 font-bold bg-green-100/50 border border-green-200 px-2.5 py-1 rounded-full flex items-center gap-1 hover:bg-green-100 transition-colors"
                    >
                        Table {tableId}
                        {/* Tiny edit icon */}
                        <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                )}
                {lastOrderId && (
                    <Link to={`/track/${lastOrderId}`} className="text-[10px] font-bold text-white bg-green-600 px-2 py-1 rounded-full animate-pulse shadow-sm shadow-green-200">
                        Track Order
                    </Link>
                )}
            </div>
          </div>
          <div className="flex items-center gap-3">
             {/* Logout Button instead of initials */}
             {localStorage.getItem('customer_phone') && (
                 <button 
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg bg-gray-100/50 hover:bg-red-50 border border-transparent hover:border-red-100"
                 >
                    <LogOut size={14} />
                    <span>Logout</span>
                 </button>
             )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-md mx-auto w-full p-4 pb-24">
        {children}
      </main>

      {/* Floating Cart Bar (Sticky Bottom) - Only show if items exist and not on cart page */}
      {cartCount > 0 && !isCartPage && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-transparent pointer-events-none z-30">
          <div className="max-w-md mx-auto pointer-events-auto">
            <Link to="/cart">
              <div className="bg-gray-900 text-white rounded-2xl shadow-xl shadow-gray-300 p-4 flex justify-between items-center hover:bg-black transition-all active:scale-95 transform duration-150 border border-gray-800">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{cartCount} ITEMS</span>
                  <span className="font-bold text-lg">₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-3 font-bold bg-gray-800 px-4 py-2 rounded-xl">
                  View Order <ShoppingBag size={18} />
                </div>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
