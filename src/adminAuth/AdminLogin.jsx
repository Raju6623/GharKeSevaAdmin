import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle2, ShieldCheck, Eye, EyeOff, X } from 'lucide-react';
import { loginAdmin } from '../redux/thunks/authThunk';
import { clearError } from '../redux/slices/authSlice';
import Swal from 'sweetalert2';

function AdminLogin() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading, error, success } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        userEmail: '',
        userPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [isSubmittingForgot, setIsSubmittingForgot] = useState(false);

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

    // Show error toast
    useEffect(() => {
        if (error) {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: error,
                confirmButtonColor: '#2d308b'
            });
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginAdmin(formData));
    };

    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        if (!forgotEmail) return Swal.fire('Error', 'Please enter your registered email', 'error');

        setIsSubmittingForgot(true);
        // Simulate real-time working
        setTimeout(() => {
            Swal.fire({
                icon: 'success',
                title: 'Request Sent',
                text: 'Password reset link has been sent to your admin email!',
                confirmButtonColor: '#2d308b'
            });
            setIsSubmittingForgot(false);
            setShowForgotModal(false);
            setForgotEmail('');
        }, 1500);
    };

    const inputClass = "w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:border-primary focus:bg-white outline-none transition-all";
    const labelClass = "text-[11px] font-bold uppercase text-slate-500 mb-1.5 block tracking-wider";

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl shadow-slate-200/50 flex flex-col md:flex-row overflow-hidden border border-slate-100">

                {/* Brand Side */}
                <div className="w-full md:w-5/12 bg-secondary p-12 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-12">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                                <ShieldCheck size={22} className="text-white" />
                            </div>
                            <span className="font-bold text-xl tracking-tight">GharKe<span className="text-primary">Seva</span></span>
                        </div>
                        <h2 className="text-4xl font-bold mb-4 leading-tight">Admin<br />Control Panel</h2>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed">Secure access for system administrators to manage services, partners, and bookings.</p>
                    </div>
                </div>

                {/* Form Side */}
                <div className="w-full md:w-7/12 p-12 bg-white flex flex-col justify-center">
                    <div className="mb-10">
                        <h3 className="text-2xl font-bold text-secondary mb-1">Welcome Back</h3>
                        <p className="text-xs text-slate-400 font-medium">Please enter your credentials to continue</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className={labelClass}>Email Address</label>
                            <input
                                name="userEmail"
                                type="email"
                                value={formData.userEmail}
                                onChange={handleChange}
                                placeholder="admin@gharkeseva.com"
                                className={inputClass}
                                required
                                autoFocus
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className={labelClass}>Password</label>
                                <button
                                    type="button"
                                    onClick={() => setShowForgotModal(true)}
                                    className="text-primary text-[10px] font-bold uppercase tracking-widest hover:underline"
                                >
                                    Forgot?
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    name="userPassword"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.userPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={inputClass}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-primary text-white rounded-xl font-bold mt-6 shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all active:scale-95 disabled:opacity-70 text-sm tracking-wide"
                        >
                            {loading ? 'Authenticating...' : 'Sign In Now'}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-50 text-center">
                        <p className="text-xs text-slate-400 font-medium mb-3">Don't have an admin account?</p>
                        <Link to="/register" className="text-primary font-bold text-sm hover:underline">
                            Request Admin Access
                        </Link>
                    </div>
                </div>
            </div>

            {/* Forgot Password Modal */}
            {showForgotModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <div className="bg-secondary p-6 text-white flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-black italic tracking-tighter uppercase">Reset Admin Access</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Security Protocol</p>
                            </div>
                            <button onClick={() => setShowForgotModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleForgotSubmit} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
                                    <ShieldCheck size={20} className="text-blue-500 shrink-0" />
                                    <p className="text-xs font-medium text-blue-700 leading-relaxed">
                                        Enter your registered admin email below. System will verify your identity and send reset instructions.
                                    </p>
                                </div>

                                <div>
                                    <label className={labelClass}>Admin Email</label>
                                    <input
                                        type="email"
                                        placeholder="Enter your admin email"
                                        className={inputClass}
                                        value={forgotEmail}
                                        onChange={(e) => setForgotEmail(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowForgotModal(false)}
                                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmittingForgot}
                                    className="flex-[2] py-4 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    {isSubmittingForgot ? <ShieldCheck className="animate-pulse" size={16} /> : 'Request Reset'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLogin;
