import React, { useState } from 'react';
import { Shield, ArrowRight, Lock, Hexagon, Cpu, Mail, User, CheckCircle, X } from 'lucide-react';

const Onboarding = ({ onComplete }) => {
    const [isExiting, setIsExiting] = useState(false);
    const [step, setStep] = useState('welcome'); // 'welcome' | 'auth' | 'verify'
    const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
    const [loading, setLoading] = useState(false);

    const handleAuth = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep('verify');
        }, 1000);
    };

    const handleComplete = () => {
        setIsExiting(true);
        setTimeout(() => {
            onComplete();
        }, 800);
    };

    return (
        <div className={`fixed inset-0 z-[100] bg-zinc-950 flex flex-col items-center justify-center overflow-hidden transition-opacity duration-700 ${isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>

            {/* Background Ambience */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] animate-[pulse_4s_ease-in-out_infinite]" />
                <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-[pulse_6s_ease-in-out_infinite_reverse]" />
                <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                {/* Grid Lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
            </div>

            <div className={`relative z-10 flex flex-col items-center max-w-md w-full px-6 transition-all duration-700 transform ${isExiting ? 'scale-110 blur-sm' : 'scale-100 blur-0'}`}>

                {/* Logo / Icon */}
                <div className="mb-8 relative group">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full group-hover:bg-emerald-500/30 transition-all duration-500" />
                    <div className="w-24 h-24 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center relative shadow-2xl rotate-3 group-hover:rotate-0 transition-all duration-500">
                        <div className="w-16 h-16 bg-emerald-500 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500">
                            <span className="font-bold text-4xl text-black">V</span>
                        </div>
                    </div>

                    {/* Floating badges */}
                    <div className="absolute -right-4 -top-4 animate-bounce delay-100">
                        <div className="bg-zinc-900 border border-zinc-700 p-2 rounded-lg shadow-lg">
                            <Shield size={16} className="text-emerald-500" />
                        </div>
                    </div>
                    <div className="absolute -left-4 -bottom-4 animate-bounce delay-300">
                        <div className="bg-zinc-900 border border-zinc-700 p-2 rounded-lg shadow-lg">
                            <Cpu size={16} className="text-blue-500" />
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="text-center mb-10 space-y-2">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-white">
                        {step === 'welcome' && <>WELCOME TO <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">VERTO</span></>}
                        {step === 'auth' && <>VERTO <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">EXCHANGE</span></>}
                        {step === 'verify' && <>VERIFY <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">IDENTITY</span></>}
                    </h1>
                    <p className="text-zinc-400 text-sm font-light leading-relaxed max-w-xs mx-auto">
                        {step === 'welcome' && "The safest place to buy & sell hardware."}
                        {step === 'auth' && "The decentralized hardware marketplace. Secure. Anonymous."}
                        {step === 'verify' && "Upload a valid Government ID to unlock Level 2 features and reduced fees."}
                    </p>
                </div>

                {/* STEP 0: WELCOME */}
                {step === 'welcome' && (
                    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
                        {/* Features List */}
                        <div className="grid grid-cols-1 gap-3 py-2">
                            <div className="flex items-center gap-3 bg-zinc-900/40 p-3 rounded-lg border border-zinc-800/50">
                                <div className="p-2 bg-emerald-500/10 rounded-full text-emerald-400"><Lock size={16} /></div>
                                <div className="text-left">
                                    <h3 className="text-white text-xs font-bold uppercase">Secure Escrow</h3>
                                    <p className="text-zinc-500 text-[10px]">Funds held safely until you verify the item.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-zinc-900/40 p-3 rounded-lg border border-zinc-800/50">
                                <div className="p-2 bg-blue-500/10 rounded-full text-blue-400"><Shield size={16} /></div>
                                <div className="text-left">
                                    <h3 className="text-white text-xs font-bold uppercase">Identity Verified</h3>
                                    <p className="text-zinc-500 text-[10px]">Trade with verified humans, not bots.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-zinc-900/40 p-3 rounded-lg border border-zinc-800/50">
                                <div className="p-2 bg-purple-500/10 rounded-full text-purple-400"><Hexagon size={16} /></div>
                                <div className="text-left">
                                    <h3 className="text-white text-xs font-bold uppercase">Trust Scores</h3>
                                    <p className="text-zinc-500 text-[10px]">Reputation system powered by on-chain data.</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4">
                            <button
                                onClick={() => { setStep('auth'); setAuthMode('register'); }}
                                className="w-full group relative bg-white text-black font-bold uppercase tracking-widest py-4 rounded-lg overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-200 via-white to-blue-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    Get Started <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                            <button
                                onClick={() => { setStep('auth'); setAuthMode('login'); }}
                                className="w-full text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider py-3 transition-colors border border-transparent hover:border-zinc-800 rounded-lg"
                            >
                                I already have an account
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 1: AUTHENTICATION */}
                {step === 'auth' && (
                    <div className="w-full space-y-4 animate-in fade-in slide-in-from-right-8 duration-500">
                        {/* Auth Toggles */}
                        <div className="flex bg-zinc-900/50 p-1 rounded-lg mb-6 border border-zinc-800/50">
                            <button
                                onClick={() => setAuthMode('login')}
                                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all ${authMode === 'login' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => setAuthMode('register')}
                                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all ${authMode === 'register' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                Register
                            </button>
                        </div>

                        <form onSubmit={handleAuth} className="space-y-3">
                            {authMode === 'register' && (
                                <div className="group relative animate-in slide-in-from-top-2 duration-300">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User size={16} className="text-zinc-600 group-focus-within:text-emerald-500 transition-colors" />
                                    </div>
                                    <input type="text" placeholder="Username" className="w-full bg-zinc-900/50 border border-zinc-800 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-emerald-500/50 focus:bg-zinc-900 transition-all placeholder-zinc-600 text-sm" required />
                                </div>
                            )}

                            <div className="group relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    {authMode === 'login' ? <Hexagon size={16} className="text-zinc-600 group-focus-within:text-emerald-500 transition-colors" /> : <Mail size={16} className="text-zinc-600 group-focus-within:text-emerald-500 transition-colors" />}
                                </div>
                                <input
                                    type={authMode === 'login' ? "text" : "email"}
                                    placeholder={authMode === 'login' ? "Username or ID" : "Email Address"}
                                    className="w-full bg-zinc-900/50 border border-zinc-800 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-emerald-500/50 focus:bg-zinc-900 transition-all placeholder-zinc-600 text-sm"
                                    required
                                />
                            </div>

                            <div className="group relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock size={16} className="text-zinc-600 group-focus-within:text-emerald-500 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full bg-zinc-900/50 border border-zinc-800 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-emerald-500/50 focus:bg-zinc-900 transition-all placeholder-zinc-600 text-sm"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full group relative bg-white text-black font-bold uppercase tracking-widest py-4 rounded-lg overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98] mt-4 disabled:opacity-70"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-200 via-white to-blue-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {loading ? "Processing..." : (authMode === 'login' ? "Enter Exchange" : "Create Account")}
                                    {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                                </span>
                            </button>
                        </form>

                        <div className="flex justify-between items-center text-xs text-zinc-500 px-1 pt-2">
                            <button className="hover:text-emerald-400 transition-colors">Forgot Password?</button>
                            <button onClick={() => setStep('welcome')} className="hover:text-zinc-300 transition-colors">Back</button>
                        </div>
                    </div>
                )}

                {/* STEP 2: VERIFICATION */}
                {step === 'verify' && (
                    <div className="w-full space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">

                        <div className="bg-zinc-900/30 border-2 border-dashed border-zinc-700 hover:border-emerald-500/50 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer group transition-all duration-300 hover:bg-zinc-900/50">
                            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Shield className="text-zinc-400 group-hover:text-emerald-400 transition-colors" size={32} />
                            </div>
                            <p className="text-zinc-300 font-bold mb-1">Upload Government ID</p>
                            <p className="text-zinc-600 text-xs">PNG, JPG or PDF (Max 10MB)</p>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleComplete}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-widest py-4 rounded-lg transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                            >
                                Verify Now
                            </button>
                            <button
                                onClick={handleComplete}
                                className="w-full text-zinc-500 hover:text-zinc-300 text-xs font-bold uppercase tracking-wider py-3 transition-colors"
                            >
                                I'll do this later
                            </button>
                        </div>

                    </div>
                )}

            </div>

            {/* Footer */}
            <div className="absolute bottom-6 text-[10px] text-zinc-600 font-mono tracking-widest uppercase opacity-50 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500 animate-ping' : 'bg-emerald-500'}`}></div>
                System Online • v.2.0.4 • Cebu_Node
            </div>
        </div>
    );
};

export default Onboarding;
