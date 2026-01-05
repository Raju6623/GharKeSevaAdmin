import React, { useState } from 'react';
import axios from 'axios';
import { Upload, PlusCircle, CheckCircle2, AlertCircle, Loader2, ListPlus, X } from 'lucide-react';

const AdminAddService = () => {
    // --- UPDATED CATEGORIES FROM "YOUR CODE" ---
    const categories = [
        { label: "AC - Split AC", value: "Split AC" },
        { label: "AC - Window AC", value: "Window AC" },
        { label: "Appliance - Washing Machine", value: "Washing Machine" },
        { label: "Appliance - Refrigerator", value: "Refrigerator" },
        { label: "Appliance - Microwave", value: "Microwave" },
        { label: "Plumbing - Repair", value: "Repair" },
        { label: "Plumbing - Installation", value: "Installation" },
        { label: "Carpenter - General Repair", value: "General Repair" },
        { label: "Carpenter - New Assembly", value: "New Assembly" },
        { label: "Electrician - Repair", value: "Repair" },
        { label: "Electrician - Installation", value: "Installation" },
        { label: "Maid - One-Time", value: "One-Time" },
        { label: "Maid - Subscription", value: "Subscription" },
        { label: "Painting - Full Home", value: "Full Home" },
        { label: "Painting - Room/Wall", value: "Room/Wall" },
        { label: "Pest - General Pest", value: "General Pest" },
        { label: "Pest - Specialized", value: "Specialized" },
        { label: "RO - Routine Service", value: "Routine Service" },
        { label: "RO - Repair & Parts", value: "Repair & Parts" },
        { label: "Smart Lock - Installation", value: "Installation" },
        { label: "Smart Lock - Repair & Support", value: "Repair & Support" }
    ];

    const [formData, setFormData] = useState({
        packageName: '',
        serviceCategory: 'Split AC', // Default value
        priceAmount: '',
        estimatedTime: '',
        description: '', 
    });

    const [inclusionInput, setInclusionInput] = useState('');
    const [inclusions, setInclusions] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addInclusion = () => {
        if (inclusionInput.trim()) {
            setInclusions([...inclusions, inclusionInput.trim()]);
            setInclusionInput('');
        }
    };

    const removeInclusion = (index) => {
        setInclusions(inclusions.filter((_, i) => i !== index));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file)); 
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        const data = new FormData();
        data.append('packageName', formData.packageName);
        data.append('serviceCategory', formData.serviceCategory);
        data.append('priceAmount', formData.priceAmount);
        data.append('estimatedTime', formData.estimatedTime);
        data.append('description', formData.description); 
        
        inclusions.forEach(item => data.append('inclusions[]', item));
        
        if (imageFile) {
            data.append('packageImage', imageFile);
        }

        try {
            const res = await axios.post('http://localhost:3001/api/auth/admin/services/add', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.success) {
                setMessage({ type: 'success', text: `Service Created! ID: ${res.data.serviceId}` });
                setFormData({ packageName: '', serviceCategory: 'Split AC', priceAmount: '', estimatedTime: '', description: '' });
                setInclusions([]); 
                setImageFile(null);
                setPreviewUrl(null);
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.error || "Upload failed" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8 flex justify-center items-center font-sans">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-xl p-10 border border-slate-100">
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-blue-600 p-2 rounded-xl text-white">
                        <PlusCircle size={24} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Add New Service</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Package Name */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Package Name</label>
                        <input 
                            required name="packageName" value={formData.packageName} onChange={handleChange}
                            placeholder="e.g. Jet Pump Deep Cleaning"
                            className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 transition-all outline-none font-bold text-slate-700"
                        />
                    </div>

                    {/* Description Field */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Service Description</label>
                        <textarea 
                            name="description" 
                            value={formData.description} 
                            onChange={handleChange}
                            placeholder="Describe the inclusions and service quality..."
                            rows="2"
                            className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none resize-none font-medium"
                        ></textarea>
                    </div>

                    {/* Checklist Inclusions */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Service Inclusions (Checklist)</label>
                        <div className="flex gap-2 mb-3">
                            <input 
                                value={inclusionInput}
                                onChange={(e) => setInclusionInput(e.target.value)}
                                placeholder="e.g. Indoor Unit Jet Wash"
                                className="flex-1 px-5 py-3 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            />
                            <button 
                                type="button" 
                                onClick={addInclusion}
                                className="bg-slate-900 text-white p-3 rounded-2xl hover:bg-slate-800 transition-all"
                            >
                                <ListPlus size={20} />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {inclusions.map((item, index) => (
                                <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2 border border-blue-100">
                                    {item}
                                    <X size={14} className="cursor-pointer hover:text-red-500" onClick={() => removeInclusion(index)} />
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Category Selector & Price */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Category</label>
                            <select 
                                name="serviceCategory" 
                                value={formData.serviceCategory} 
                                onChange={handleChange}
                                className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none font-bold text-blue-600 cursor-pointer"
                            >
                                {categories.map((cat, index) => (
                                    <option key={index} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Price (₹)</label>
                            <input 
                                required type="number" name="priceAmount" value={formData.priceAmount} onChange={handleChange}
                                placeholder="599"
                                className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none font-black"
                            />
                        </div>
                    </div>

                    {/* Estimated Time */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Estimated Time</label>
                        <input 
                            required name="estimatedTime" value={formData.estimatedTime} onChange={handleChange}
                            placeholder="e.g. 45-60 mins"
                            className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                        />
                    </div>

                    {/* Image Upload Area */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Service Image</label>
                        <div className="relative border-2 border-dashed border-slate-200 rounded-[2rem] p-4 hover:border-blue-400 transition-colors bg-slate-50/50 text-center">
                            <input 
                                type="file" accept="image/*" onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            {previewUrl ? (
                                <div className="flex items-center gap-4">
                                    <img src={previewUrl} alt="Preview" className="w-20 h-20 object-cover rounded-2xl shadow-md" />
                                    <p className="text-sm text-blue-600 font-bold">Image Selected!</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <Upload className="mx-auto text-slate-300 mb-1" size={32} />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload Image</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Feedback Message */}
                    {message.text && (
                        <div className={`p-4 rounded-2xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                            {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                            <span className="text-sm font-medium">{message.text}</span>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button 
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-100 transition-all flex justify-center items-center gap-2 active:scale-95 disabled:bg-slate-300 uppercase italic"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Create Service Package'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminAddService;