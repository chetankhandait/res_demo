import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const MenuItemCard = ({ item }) => {
  const { addToCart, removeFromCart, cartItems } = useCart();
  
  // Check if item is in cart to show quantity controls vs Add button
  const cartItem = cartItems.find(i => i.item_id === item.item_id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => {
    addToCart(item);
    if (quantity === 0) toast.success(`Added ${item.name}`);
  };

  const handleRemove = () => {
      // Logic handled in context to remove if 0, but here we just call addToCart with negative or custom logic
      // Actually Context has updateQuantity. Let's use addToCart for adding and custom for remove?
      // Context has `removeFromCart` (removes all) or `updateQuantity`.
      // Let's assume user wants to decrement.
      // We need a decrement function in context or use addToCart logic if it handles negative? 
      // Context snippet: updateQuantity(itemId, delta)
      
      // But I don't see updateQuantity exposed in MenuItemCard? 
      // Wait, I saw it in CartContext.jsx in previous turn.
      // "updateQuantity"
      
      // Let's stick to what we have in context.
      // If CartContext has updateQuantity, use it.
      // Re-reading CartContext content:
      // export const CartProvider = ... value={{ ..., updateQuantity ... }}
      
      // Wait, I need to check if I can access updateQuantity. Yes.
  };
  
  // Helper to access context functions properly inside component
  const { updateQuantity } = useCart();

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
       {/* Image */}
       <div className="w-28 h-28 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden shadow-sm relative group">
          <img 
            src={item.image_url} 
            alt={item.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => e.target.src = 'https://placehold.co/100?text=No+Image'}
            loading="lazy"
          />
          {/* subtle overlay gradient */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
       </div>

       {/* Details */}
       <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
               <h3 className="font-bold text-gray-900 line-clamp-1">{item.name}</h3>
               {/* <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500">{item.base_prep_time}m</span> */}
            </div>
            <p className="text-xs text-gray-500 line-clamp-2 mt-1">{item.description}</p>
          </div>

          <div className="flex justify-between items-end mt-3">
             <span className="font-bold text-lg">₹{item.price}</span>
             
             {quantity === 0 ? (
                 <button 
                   onClick={handleAdd}
                   className="bg-gray-100 text-green-700 hover:bg-green-600 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                 >
                    ADD
                 </button>
             ) : (
                 <div className="flex items-center gap-3 bg-green-50 rounded-lg px-2 py-1">
                    <button 
                      onClick={() => updateQuantity(item.item_id, -1)}
                      className="w-7 h-7 flex items-center justify-center bg-white text-green-700 rounded-md shadow-sm border border-green-100 active:scale-90 transition-transform"
                    >
                       <Minus size={14} strokeWidth={3} />
                    </button>
                    <span className="font-bold text-green-800 w-4 text-center">{quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.item_id, 1)}
                      className="w-7 h-7 flex items-center justify-center bg-green-600 text-white rounded-md shadow-md active:scale-90 transition-transform"
                    >
                       <Plus size={14} strokeWidth={3} />
                    </button>
                 </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default MenuItemCard;
