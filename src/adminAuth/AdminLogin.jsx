import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
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

    const inputClass = "w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:border-primary focus:bg-white outline-none transition-all";
    const labelClass = "text-[11px] font-bold uppercase text-slate-500 mb-1.5 block tracking-wider";

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl shadow-slate-200/50 flex flex-col md:row overflow-hidden border border-slate-100">

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
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className={labelClass}>Password</label>
                            </div>
                            <input
                                name="userPassword"
                                type="password"
                                value={formData.userPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className={inputClass}
                                required
                            />
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
        </div>
    );
};

export default AdminLogin;
