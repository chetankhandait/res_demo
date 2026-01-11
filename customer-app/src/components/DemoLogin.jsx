import React, { useState } from 'react';
import { Smartphone, ArrowRight, ChefHat } from 'lucide-react';

const DemoLogin = ({ onLogin }) => {
  const [mobile, setMobile] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mobile.length >= 10) {
      onLogin(mobile);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full animate-in fade-in duration-500 py-6">
      <div className="w-24 h-24 bg-gradient-to-tr from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-8 shadow-green-200 shadow-xl">
        <ChefHat size={48} className="text-white" />
      </div>

      <div className="text-center space-y-2 mb-10">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome to RoyDish</h2>
        <p className="text-gray-500">Experience premium dining at your fingertips</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 ml-1">Mobile Number</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Smartphone size={20} />
            </div>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="Enter your mobile number"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium text-lg tracking-wide placeholder:text-gray-300 shadow-sm"
              autoFocus
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={mobile.length < 10}
          className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-xl shadow-gray-200 hover:bg-black active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 group"
        >
          <span>Continue</span>
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </form>

      <p className="mt-8 text-xs text-center text-gray-400">
        By checking in, you agree to our Terms & Conditions
      </p>
    </div>
  );
};

export default DemoLogin;
