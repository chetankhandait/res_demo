import React from 'react';
import { useCart } from '../context/CartContext';
import { useTable } from '../context/TableContext';
import { ShoppingBag } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const { cartCount, cartTotal } = useCart();
  const { tableId } = useTable();
  const location = useLocation();

  const isCartPage = location.pathname === '/cart';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">RoyDish</h1>
            {tableId && <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">Table {tableId}</span>}
          </div>
          <div className="flex items-center gap-2">
            {/* Could add search or profile icon here */}
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
              <div className="bg-green-600 text-white rounded-2xl shadow-lg p-4 flex justify-between items-center hover:bg-green-700 transition-colors active:scale-95 transform duration-150">
                <div className="flex flex-col">
                  <span className="text-xs text-green-100 uppercase font-semibold tracking-wider">{cartCount} ITEMS</span>
                  <span className="font-bold text-lg">₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2 font-bold">
                  View Order <ShoppingBag size={20} />
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
