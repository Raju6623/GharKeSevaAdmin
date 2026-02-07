import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { registerAdmin } from '../redux/thunks/authThunk';
import { clearError } from '../redux/slices/authSlice';
import Swal from 'sweetalert2';

function AdminRegister() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        userFullName: '',
        userEmail: '',
        userPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: error,
                confirmButtonColor: '#2d308b'
            });
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const resultAction = await dispatch(registerAdmin(formData));

        if (registerAdmin.fulfilled.match(resultAction)) {
            Swal.fire({
                icon: 'success',
                title: 'Account Created',
                text: 'Please login to continue.',
                confirmButtonColor: '#2d308b'
            }).then(() => {
                navigate('/login');
            });
        }
    };

    const inputClass = "w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:border-primary focus:bg-white outline-none transition-all";
    const labelClass = "text-[11px] font-bold uppercase text-slate-500 mb-1.5 block tracking-wider";

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl shadow-slate-200/50 flex flex-col md:flex-row overflow-hidden border border-slate-100">

                {/* Brand Side */}
                <div className="w-full md:w-5/12 bg-secondary p-12 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute -left-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-12">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                                <ShieldCheck size={22} className="text-white" />
                            </div>
                            <span className="font-bold text-xl tracking-tight">GharKe<span className="text-primary">Seva</span></span>
                        </div>
                        <h2 className="text-4xl font-bold mb-4 leading-tight">Admin<br />Registration</h2>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed">Join the administration team to efficiently manage the service marketplace and partner operations.</p>
                    </div>
                </div>

                {/* Form Side */}
                <div className="w-full md:w-7/12 p-12 bg-white flex flex-col justify-center">
                    <div className="mb-10">
                        <h3 className="text-2xl font-bold text-secondary mb-1">Create Admin Account</h3>
                        <p className="text-xs text-slate-400 font-medium">Please provide your details to request access</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className={labelClass}>Full Name</label>
                            <input
                                name="userFullName"
                                type="text"
                                value={formData.userFullName}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className={inputClass}
                                required
                            />
                        </div>
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
                            <label className={labelClass}>Password</label>
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
                            {loading ? 'Creating Account...' : 'Register as Admin'}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-50 text-center">
                        <p className="text-xs text-slate-400 font-medium mb-3">Already have an account?</p>
                        <Link to="/login" className="text-primary font-bold text-sm hover:underline">
                            Login to Control Panel
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminRegister;
