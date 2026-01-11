import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTable } from '../context/TableContext';
import { ScanLine } from 'lucide-react';
import DemoLogin from '../components/DemoLogin';
import TableSelector from '../components/TableSelector';

const Landing = () => {
    const navigate = useNavigate();
    const { tableId, setTableId } = useTable();
    
    const [step, setStep] = useState(() => {
        // If user already entered phone, skip to table
        return localStorage.getItem('customer_phone') ? 'table' : 'login';
    });
    
    // Check for existing active order to show "Track" button
    const lastOrderId = localStorage.getItem('last_order_id');
    
    useEffect(() => {
        // If tableId is already set, redirect to menu
        if (tableId) {
            navigate('/menu');
        }
    }, [tableId, navigate]);

    const handleLogin = (phone) => {
        localStorage.setItem('customer_phone', phone);
        setStep('table');
    };

    const handleTableConfirm = (tid) => {
        if (tid) {
            setTableId(tid);
            localStorage.setItem('restaurant_table_id', tid);
            navigate('/menu');
        }
    };

    return (
        <div className="flex flex-col items-center h-screen w-full bg-white overflow-hidden absolute inset-0">
            <div className="w-full h-full flex flex-col justify-center max-w-md mx-auto p-6 relative">
                
                {step === 'login' && (
                    <DemoLogin onLogin={handleLogin} />
                )}

                {step === 'table' && (
                    <div className="w-full animate-in slide-in-from-right duration-300">
                         <div className="mb-8 flex justify-center">
                            <button 
                                onClick={() => setStep('login')} 
                                className="text-sm text-gray-400 font-medium hover:text-gray-600 transition-colors"
                            >
                                ← Back to Login
                            </button>
                         </div>
                         
                         <TableSelector onConfirm={handleTableConfirm} />
                         
                         {lastOrderId && (
                             <div className="mt-12 scale-95 opacity-0 animate-[fade-in_0.5s_0.2s_forwards] flex justify-center">
                                <button 
                                    onClick={() => navigate(`/track/${lastOrderId}`)}
                                    className="px-6 py-3 bg-white border border-green-100 text-green-600 rounded-xl shadow-sm text-sm font-bold flex items-center gap-2 hover:bg-green-50 transition-colors"
                                >
                                    <ScanLine size={16} />
                                    <span>Track Order #{lastOrderId.slice(0,8)}</span>
                                </button>
                             </div>
                         )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Landing;
