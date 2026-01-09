import React from 'react';

const MenuCategory = ({ categories, activeCategory, onSelect }) => {
  return (
    <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap
            ${activeCategory === cat 
              ? 'bg-green-600 text-white shadow-md transform scale-105' 
              : 'bg-white text-gray-600 border border-gray-100'
            }`}
        >
          {cat.replace('_', ' ')}
        </button>
      ))}
    </div>
  );
};

export default MenuCategory;
