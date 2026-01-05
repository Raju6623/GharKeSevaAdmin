import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    ShieldCheck, Mail, Lock, ArrowRight,
    CheckCircle2, AlertCircle
} from 'lucide-react';
import { loginAdmin } from '../redux/thunks/authThunk';
import { clearError } from '../redux/slices/authSlice';

const AdminLogin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading, error, success } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        userEmail: '',
        userPassword: ''
    });

    // Clear error on mount
    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    // Redirect on success
    useEffect(() => {
        if (success) {
            navigate('/admin');
        }
    }, [success, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) dispatch(clearError());
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginAdmin(formData));
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-sans">

            <div className="w-full max-w-5xl bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200 overflow-hidden flex flex-col md:flex-row border border-slate-100 animate-in fade-in zoom-in duration-500">

                {/* LEFT SIDE: BRANDING */}
                <div className="hidden md:flex md:w-1/2 bg-slate-900 p-16 flex-col justify-between text-white relative">
                    <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>

                    <div>
                        <div className="flex items-center gap-3 mb-12">
                            <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/30">
                                <ShieldCheck className="text-white" size={28} />
                            </div>
                            <span className="text-2xl font-black tracking-tighter uppercase italic">
                                GharKe<span className="text-blue-600">Seva</span>
                            </span>
                        </div>

                        <h2 className="text-5xl font-black leading-tight tracking-tighter italic">
                            CENTRAL <br />
                            <span className="text-blue-600">COMMAND</span> <br />
                            INTERFACE
                        </h2>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                        <span className="flex items-center gap-2 text-emerald-500">
                            <CheckCircle2 size={16} /> System Encrypted
                        </span>
                        <span>V 2.4.0</span>
                    </div>
                </div>

                {/* RIGHT SIDE: FORM AREA */}
                <div className="w-full md:w-1/2 p-10 md:p-20 flex flex-col justify-center">

                    <div className="mb-12 flex justify-between items-end border-b border-slate-50 pb-6">
                        <div>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
                                Admin Login
                            </h3>
                            <div className="h-1 w-8 bg-blue-600 mt-2 rounded-full"></div>
                        </div>
                        <Link
                            to="/register"
                            className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-slate-900 transition-all"
                        >
                            New Authority?
                        </Link>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-xs font-bold animate-shake">
                            <AlertCircle size={18} /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Official Admin Email</label>
                            <div className="relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input
                                    name="userEmail"
                                    type="email"
                                    value={formData.userEmail}
                                    onChange={handleChange}
                                    placeholder="admin@gharkeseva.com"
                                    className="w-full bg-slate-50 border border-transparent rounded-2xl py-5 pl-14 pr-6 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white focus:border-blue-100 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">System Access Key</label>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input
                                    name="userPassword"
                                    type="password"
                                    value={formData.userPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-50 border border-transparent rounded-2xl py-5 pl-14 pr-6 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white focus:border-blue-100 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-slate-300 flex items-center justify-center gap-3 hover:bg-blue-600 transition-all duration-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Verifying Protocols...' : 'Access Command Center'}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>

                    <p className="mt-12 text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                        Authorized Personnel Only. <br />
                        <span className="text-slate-900">All session logs are being monitored.</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
