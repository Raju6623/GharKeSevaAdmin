import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShieldCheck } from 'lucide-react';
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

    const inputClass = "w-full p-2.5 bg-white border border-slate-300 rounded-md text-sm font-medium focus:border-indigo-600 outline-none transition-all";
    const labelClass = "text-[10px] font-black uppercase text-slate-500 mb-1 block tracking-wider";

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-5xl bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col md:flex-row overflow-hidden">

                {/* Brand Side */}
                <div className="w-full md:w-5/12 bg-[#2d308b] p-10 text-white flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-8">
                            <ShieldCheck size={24} />
                            <span className="font-bold text-xl uppercase tracking-tighter">AdminPortal</span>
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Registration</h2>
                        <p className="text-indigo-100/60 text-sm">Create a new administrator account.</p>
                    </div>
                </div>

                {/* Form Side */}
                <div className="w-full md:w-7/12 p-10 bg-white min-h-[500px] flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-8 border-b pb-4">
                        <h3 className="text-xl font-bold text-slate-800">Register</h3>
                        <Link to="/login" className="text-indigo-600 font-bold text-xs uppercase tracking-widest">
                            Back to Login
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className={labelClass}>Full Name</label>
                            <input
                                name="userFullName"
                                type="text"
                                value={formData.userFullName}
                                onChange={handleChange}
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
                                className={inputClass}
                                required
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Password</label>
                            <input
                                name="userPassword"
                                type="password"
                                value={formData.userPassword}
                                onChange={handleChange}
                                className={inputClass}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-[#2d308b] text-white rounded font-bold mt-4 uppercase tracking-widest text-xs disabled:opacity-70"
                        >
                            {loading ? 'Creating Account...' : 'Register'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminRegister;
