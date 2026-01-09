import React, { useEffect, useState } from 'react';
import api from '../services/api';
import MenuCategory from '../components/MenuCategory';
import MenuItemCard from '../components/MenuItemCard';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Menu = () => {
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await api.get('/menu');
      setItems(response.data);
      
      // Extract unique categories
      const uniqueCats = ['All', ...new Set(response.data.map(i => i.category))];
      setCategories(uniqueCats);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch menu', err);
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
       {/* Search Bar */}
       <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text"
            placeholder="Search for dishes..." 
            className="w-full pl-10 pr-4 py-3 bg-white border-none rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
       </div>

       {/* Categories */}
       <MenuCategory 
          categories={categories} 
          activeCategory={activeCategory} 
          onSelect={setActiveCategory} 
       />

       {/* Items Grid */}
       {loading ? (
          <div className="text-center py-10 text-gray-400">Loading menu...</div>
       ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 gap-4"
          >
             <AnimatePresence mode='popLayout'>
             {filteredItems.map(item => (
                <motion.div
                    key={item.item_id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                >
                    <MenuItemCard item={item} />
                </motion.div>
             ))}
             </AnimatePresence>
             {filteredItems.length === 0 && (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="text-center py-10 text-gray-400"
                >
                    No items found
                </motion.div>
             )}
          </motion.div>
       )}
    </div>
  );
};

export default Menu;
