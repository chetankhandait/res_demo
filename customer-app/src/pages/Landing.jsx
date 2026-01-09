import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTable } from '../context/TableContext';
import { ScanLine, UtensilsCrossed } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();
    const { tableId, setTableId } = useTable();
    const [inputTable, setInputTable] = useState('');
    
    useEffect(() => {
        // If tableId is already set (from URL or LocalStorage), redirect to menu
        if (tableId) {
            navigate('/menu');
        }
    }, [tableId, navigate]);

    const handleStart = () => {
        let tid = inputTable.trim().toUpperCase();
        
        // Auto-format "1" -> "T-001"
        if (/^\d+$/.test(tid)) {
            tid = `T-${tid.padStart(3, '0')}`;
        }
        
        if (tid) {
            setTableId(tid);
            localStorage.setItem('restaurant_table_id', tid);
            navigate('/menu');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600 animate-pulse">
               <UtensilsCrossed size={40} />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to RoyDish</h2>
            <p className="text-gray-500 mb-8">Scan QR code on your table or enter table number to start ordering.</p>
            
            <div className="w-full max-w-xs space-y-4">
                 <div>
                    <input 
                        type="text" 
                        placeholder="Enter Table Number (e.g., T-001)" 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-center text-lg uppercase font-medium"
                        value={inputTable}
                        onChange={(e) => setInputTable(e.target.value.toUpperCase())}
                    />
                 </div>
                 
                 <button 
                    onClick={handleStart}
                    disabled={!inputTable}
                    className="w-full py-3.5 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                 >
                    Start Ordering
                 </button>
            </div>
            
            <div className="mt-12 text-sm text-gray-400 flex items-center gap-2">
                <ScanLine size={16} />
                <span>Scan QR Code for instant access</span>
            </div>
        </div>
    );
};

export default Landing;
