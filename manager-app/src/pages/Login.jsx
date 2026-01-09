import React, { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = ({ onLogin }) => {
  const [code, setCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple hardcoded check for demo
    if (code === 'admin') {
      onLogin();
    } else {
      toast.error('Invalid access code');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white">
       <div className="w-full max-w-sm">
            <div className="text-center mb-10">
                <div className="mx-auto w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4">
                    <Lock size={32} />
                </div>
                <h1 className="text-3xl font-bold mb-2">Manager Access</h1>
                <p className="text-slate-400">Enter your secure code to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                    type="password" 
                    placeholder="Access Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-800 border border-slate-700 rounded-xl focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all placeholder:text-slate-500 text-lg"
                    autoFocus
                />
                <button 
                    type="submit"
                    className="w-full py-4 bg-green-600 hover:bg-green-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
                >
                    <span>Login to Dashboard</span>
                    <ArrowRight size={20} />
                </button>
            </form>
       </div>
    </div>
  );
};

export default Login;
