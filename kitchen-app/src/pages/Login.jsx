import React from 'react';
import { ChefHat } from 'lucide-react';
import { useStation } from '../context/StationContext';

// Hardcoded for demo, typically fetched from backend
const STATIONS = [
  { id: 'S-001', name: 'South Indian Chef', category: 'south_indian' },
  { id: 'S-002', name: 'Chinese Chef', category: 'chinese' },
  { id: 'S-003', name: 'Bar Manager', category: 'cocktails' },
];

const Login = () => {
  const { login } = useStation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
       <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <ChefHat size={40} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Kitchen Display System</h1>
            <p className="text-gray-500 mb-8">Select your station to begin</p>

            <div className="space-y-3">
                {STATIONS.map((station) => (
                    <button
                        key={station.id}
                        onClick={() => login(station)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-green-50 border border-gray-100 hover:border-green-200 rounded-xl transition-all group"
                    >
                        <span className="font-semibold text-gray-700 group-hover:text-green-700">{station.name}</span>
                        <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded border border-gray-100 group-hover:border-green-100">{station.category}</span>
                    </button>
                ))}
            </div>
       </div>
    </div>
  );
};

export default Login;
