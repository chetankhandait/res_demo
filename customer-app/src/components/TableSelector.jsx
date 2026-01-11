import React, { useState } from 'react';
import { Armchair, Check } from 'lucide-react';

const TableSelector = ({ initialTable = '', onConfirm, onCancel }) => {
  const [tableNum, setTableNum] = useState(initialTable.replace('T-', ''));

  const handleConfirm = () => {
    if (!tableNum) return;
    const formatted = `T-${tableNum.padStart(3, '0')}`;
    onConfirm(formatted);
  };

  return (
    <div className="animate-in zoom-in-95 duration-200 w-full max-w-sm mx-auto bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-green-600">
            <Armchair size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Select Your Table</h3>
        <p className="text-sm text-gray-500">Please enter your table number</p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="flex items-center text-4xl font-black text-gray-900 tracking-wider border-b-2 border-green-500 pb-2 px-8">
          <span className="text-2xl text-gray-400 mr-2 font-medium">T -</span>
          <input
             type="text"
             value={tableNum}
             onChange={(e) => setTableNum(e.target.value.replace(/\D/g, '').slice(0, 3))}
             className="w-24 text-center focus:outline-none placeholder:text-gray-200"
             placeholder="000"
             autoFocus
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {onCancel && (
            <button 
                onClick={onCancel}
                className="py-2 px-2 rounded-xl font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
                Cancel
            </button>
        )}
       <button 
  onClick={handleConfirm}
  disabled={!tableNum}
  className={`py-2 px-2 rounded-xl font-bold text-white shadow-lg transition-all 
    flex flex-wrap items-center justify-center text-center
    ${onCancel ? '' : 'col-span-2'} 
    ${!tableNum 
      ? 'bg-gray-300 shadow-none' 
      : 'bg-green-600 hover:bg-green-700 shadow-green-200'
    }`}
>
  <span className="leading-tight break-words">
    Confirm Table
  </span>
</button>

      </div>
    </div>
  );
};

export default TableSelector;
