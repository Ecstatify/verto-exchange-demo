import React, { useEffect, useState } from 'react';
import { LogOut, Power, Shield, ArrowRight } from 'lucide-react';

const Signout = ({ onReconnect }) => {
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsComplete(true);
                    return 100;
                }
                return prev + 2;
            });
        }, 20);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col items-center justify-center overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[100px] animate-[pulse_4s_ease-in-out_infinite]" />
                <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-zinc-600/10 rounded-full blur-[120px] animate-[pulse_6s_ease-in-out_infinite_reverse]" />
                <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                {/* Grid Lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6 text-center">

                <div className="mb-8 relative">
                    <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center relative shadow-2xl">
                        <Power size={32} className={`transition-all duration-1000 ${isComplete ? 'text-zinc-600' : 'text-red-500 animate-pulse'}`} />
                    </div>
                    {/* Ring Progress */}
                    <svg className="absolute inset-0 w-20 h-20 -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="48" fill="none" stroke="#27272a" strokeWidth="2" />
                        <circle
                            cx="50" cy="50" r="48" fill="none" stroke="#ef4444" strokeWidth="2"
                            strokeDasharray="301.59"
                            strokeDashoffset={301.59 - (301.59 * progress) / 100}
                            className="transition-all duration-100 ease-out"
                        />
                    </svg>
                </div>

                <h1 className="text-3xl font-bold text-white mb-2 tracking-tighter">
                    {isComplete ? 'DISCONNECTED' : 'SIGNING OUT...'}
                </h1>

                <p className="text-zinc-500 text-sm mb-8 font-mono">
                    {isComplete ? 'Session link terminated.' : 'Closing secure connection to Verto Node...'}
                </p>

                <div className={`w-full transition-all duration-700 ${isComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-lg mb-6 max-w-sm mx-auto">
                        <div className="flex items-center gap-3 mb-2">
                            <Shield className="text-zinc-600" size={16} />
                            <p className="text-zinc-400 text-xs font-bold uppercase">Data Protection</p>
                        </div>
                        <p className="text-zinc-500 text-[10px] leading-relaxed">
                            Your local session keys have been wiped from memory. No transaction data was retained on this device.
                        </p>
                    </div>

                    <button
                        onClick={onReconnect}
                        className="group bg-white text-black font-bold uppercase tracking-widest px-8 py-3 rounded overflow-hidden transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto"
                    >
                        Reconnect <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

            </div>

            <div className="absolute bottom-6 text-[10px] text-zinc-700 font-mono tracking-widest uppercase">
                Secure Connection Terminated
            </div>
        </div>
    );
};

export default Signout;
