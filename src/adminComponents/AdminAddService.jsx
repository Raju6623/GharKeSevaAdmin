import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { CheckCircle2, AlertCircle, Loader2, Tag, Layers, Star, Trash2, Edit2, X } from 'lucide-react';
import { io } from 'socket.io-client';
import { API_URL, BASE_URL } from '../config';

const socket = io(BASE_URL);
import { fetchAdminServices } from '../redux/slices/adminSlice';

// Sub-components
import ServiceFormHeader from './tabs/addService/ServiceFormHeader';
import ServiceTypeSelector from './tabs/addService/ServiceTypeSelector';
import ServicePricingSection from './tabs/addService/ServicePricingSection';
import ServiceMarketingSection from './tabs/addService/ServiceMarketingSection';
import InclusionsManager from './tabs/addService/InclusionsManager';
import ServiceImageUpload from './tabs/addService/ServiceImageUpload';
import ServiceDetailsManager from './tabs/addService/ServiceDetailsManager';
import AdminCoupons from './AdminCoupons';
import VendorOffersTab from './tabs/VendorOffersTab';

// Constants
import { categoryMapping, unitMapping } from './constants/serviceConstants';

function AdminAddService() {
    const dispatch = useDispatch();
    const { services, loading: servicesLoading } = useSelector((state) => state.admin);

    const [mainCategory, setMainCategory] = useState("AC");
    const [subType, setSubType] = useState("Split AC");
    const [serviceAction, setServiceAction] = useState("Service");
    const [serviceType, setServiceType] = useState("service"); // 'service', 'package', 'bestseller', 'limited'
    const [isPackage, setIsPackage] = useState(false);

    // Fetch services for the sidebar when category changes
    useEffect(() => {
        if (serviceType === 'service' || serviceType === 'package') {
            dispatch(fetchAdminServices(subType || mainCategory));
        }
    }, [dispatch, mainCategory, subType, serviceType]);

    // Handle Type Change
    const handleServiceTypeChange = (type) => {
        setServiceType(type);
        const isPkg = type !== 'service';
        setIsPackage(isPkg);

        // Auto-set tags
        let tag = '';
        if (type === 'package') tag = 'Package';
        if (type === 'bestseller') tag = 'Best Seller';
        if (type === 'limited') tag = 'Limited Offer';

        setFormData(prev => ({ ...prev, tag }));
    };

    const [formData, setFormData] = useState({
        packageName: '', priceAmount: '', estimatedTime: '', description: '',
        note: '', optionsCount: '', discount: '', rating: '', reviewCount: '',
        tag: '', originalPrice: ''
    });

    // Detailed States
    const [variants, setVariants] = useState([]);
    const [trustContent, setTrustContent] = useState({ title: '', points: [] });
    const [tipsContent, setTipsContent] = useState({ title: '', points: [] });

    const [pkgIncName, setPkgIncName] = useState('');
    const [pkgIncDetail, setPkgIncDetail] = useState('');
    const [packageInclusions, setPackageInclusions] = useState([]);
    const [inclusionInput, setInclusionInput] = useState('');
    const [inclusions, setInclusions] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [trustImageFile, setTrustImageFile] = useState(null);
    const [tipsImageFile, setTipsImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [perUnitRate, setPerUnitRate] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const handleEdit = (service) => {
        setIsEditing(true);
        setEditingId(service._id);
        setFormData({
            packageName: service.packageName,
            priceAmount: service.priceAmount,
            estimatedTime: service.estimatedTime,
            description: service.description || '',
            note: service.note || '',
            optionsCount: service.optionsCount || '',
            discount: service.discount || '',
            rating: service.rating || '',
            reviewCount: service.reviewCount || '',
            tag: service.tag || '',
            originalPrice: service.originalPrice || service.priceAmount
        });
        setInclusions(service.inclusions || []);
        setPackageInclusions(service.includedServices || []);
        setVariants(service.variants || []);
        setTrustContent(service.trustContent || { title: '', points: [] });
        setTipsContent(service.aftercareTips || { title: '', points: [] });

        setIsPackage(service.isPackage || false);
        setServiceType(service.isPackage ? 'package' : 'service');
        if (service.perUnitCost) {
            const match = service.perUnitCost.match(/₹(\d+)/);
            if (match) setPerUnitRate(match[1]);
        }
        setPreviewUrl(service.packageImage?.startsWith('http') ? service.packageImage : `${BASE_URL}/${service.packageImage}`);

        // Sync Main Category and Action/Sub-Type for UI selectors
        if (service.category) setMainCategory(service.category);
        if (service.serviceCategory) setServiceAction(service.serviceCategory);

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // REAL-TIME UPDATE LISTENER
    useEffect(() => {
        socket.on('service_update', (data) => {
            console.log("🔄 [Admin Add] Real-time Service Update:", data);
            const category = subType || mainCategory;
            // Only refresh if the update belongs to the current category being viewed
            if (data.category === category || data.type === 'delete_all') {
                dispatch(fetchAdminServices(category));
            }
        });

        return () => {
            socket.off('service_update');
        };
    }, [dispatch, subType, mainCategory]);

    const handleDelete = async (serviceId, category) => {
        if (!window.confirm('Are you sure you want to delete this service?')) return;
        try {
            const res = await axios.delete(`${API_URL}/admin/services/${serviceId}?category=${category}`);
            if (res.data.success) {
                setMessage({ type: 'success', text: 'Service deleted successfully!' });
                dispatch(fetchAdminServices(subType || mainCategory));
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete service' });
        }
    };

    const handleDeleteAll = async () => {
        const category = subType || mainCategory;
        if (!window.confirm(`⚠️ DANGER: Are you sure you want to delete ALL services in ${category}? This action is irreversible.`)) return;
        try {
            const res = await axios.delete(`${API_URL}/admin/services/all?category=${category}`);
            if (res.data.success) {
                setMessage({ type: 'success', text: `All ${category} services deleted!` });
                dispatch(fetchAdminServices(category));
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to bulk delete services' });
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditingId(null);
        setFormData({
            packageName: '', priceAmount: '', estimatedTime: '', description: '',
            note: '', optionsCount: '', discount: '', rating: '', reviewCount: '',
            tag: '', originalPrice: ''
        });
        setPerUnitRate(''); setInclusions([]); setPackageInclusions([]);
        setVariants([]); setTrustContent({ title: '', points: [] }); setTipsContent({ title: '', points: [] });
        setImageFile(null); setTrustImageFile(null); setTipsImageFile(null); setPreviewUrl(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let updatedData = { ...formData, [name]: value };

        if (name === 'originalPrice' || name === 'discount') {
            const original = parseFloat(name === 'originalPrice' ? value : formData.originalPrice) || 0;
            const disc = parseFloat(name === 'discount' ? value : formData.discount) || 0;
            if (original > 0) {
                updatedData.priceAmount = Math.round(original - (original * disc / 100));
            }
        }
        setFormData(updatedData);
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

        let finalName = formData.packageName;

        // AUTO-PREFIX GENDER FOR SALON (Strict Isolation)
        if (mainCategory === 'Salon' || mainCategory === 'salon') {
            const genderPrefix = subType.toLowerCase().includes('women') ? 'Women' : 'Men';
            if (!finalName.toLowerCase().includes(genderPrefix.toLowerCase())) {
                finalName = `${genderPrefix} ${finalName}`;
            }
        }

        if (subType && !finalName.toLowerCase().includes(subType.toLowerCase())) {
            finalName = `${subType} ${finalName}`;
        }
        let finalCategory = subType || mainCategory;
        if (mainCategory === 'Appliances') {
            finalCategory = subType;
        }

        const data = new FormData();
        data.append('packageName', finalName);
        data.append('serviceCategory', finalCategory);
        data.append('category', mainCategory); // Add this line
        data.append('priceAmount', formData.priceAmount);
        data.append('estimatedTime', formData.estimatedTime);
        data.append('description', formData.description);
        data.append('note', formData.note);
        data.append('optionsCount', formData.optionsCount);
        data.append('isPackage', isPackage);
        data.append('discount', formData.discount);
        data.append('rating', formData.rating);
        data.append('reviewCount', formData.reviewCount);
        data.append('tag', formData.tag);

        // Append Detailed Fields
        data.append('variants', JSON.stringify(variants));
        data.append('trustContent', JSON.stringify(trustContent));
        data.append('aftercareTips', JSON.stringify(tipsContent));

        if (isPackage) {
            data.append('includedServices', JSON.stringify(packageInclusions));
        } else {
            inclusions.forEach(item => data.append('inclusions[]', item));
        }

        if (perUnitRate) {
            const unit = unitMapping[mainCategory] || "Service";
            data.append('perUnitCost', `₹${perUnitRate} per ${unit}`);
        }

        if (imageFile) data.append('packageImage', imageFile);
        if (trustImageFile) data.append('trustImage', trustImageFile);
        if (tipsImageFile) data.append('tipsImage', tipsImageFile);

        try {
            const url = isEditing
                ? `${API_URL}/admin/services/${editingId}`
                : `${API_URL}/admin/services/add`;

            const method = isEditing ? 'put' : 'post';

            const res = await axios({
                method,
                url,
                data,
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.success) {
                setMessage({ type: 'success', text: isEditing ? 'Service Updated!' : `Service Created! ID: ${res.data.serviceId}` });
                if (!isEditing) {
                    setFormData({
                        tag: '', originalPrice: ''
                    });
                    setPerUnitRate(''); setInclusions([]); setPackageInclusions([]);
                    setVariants([]); setTrustContent({ title: '', points: [] }); setTipsContent({ title: '', points: [] });
                    setImageFile(null); setPreviewUrl(null);
                } else {
                    setIsEditing(false);
                    setEditingId(null);
                }
                // Refresh sidebar
                dispatch(fetchAdminServices(subType || mainCategory));
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.error || "Upload failed" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 lg:p-12 font-sans">
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Main Form Column */}
                <div className="lg:col-span-8 bg-white rounded-[2.5rem] shadow-xl p-6 md:p-10 border border-slate-100">
                    <ServiceFormHeader serviceType={serviceType} onTypeChange={handleServiceTypeChange} />

                    {serviceType === 'coupon' ? (
                        <AdminCoupons isEmbedded={true} />
                    ) : serviceType === 'vendoroffer' ? (
                        <VendorOffersTab />
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <ServiceTypeSelector
                                {...{ mainCategory, setMainCategory, subType, setSubType, serviceAction, setServiceAction }}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="label-text">{isPackage ? 'Package Name' : 'Service Name'}</label>
                                    <input
                                        required name="packageName" value={formData.packageName} onChange={handleChange}
                                        placeholder={isPackage ? "e.g. Super Saver Bundle" : "e.g. Power Jet Service"}
                                        className="input-field"
                                    />
                                </div>
                            </div>

                            <ServicePricingSection
                                {...{ formData, handleChange, perUnitRate, setPerUnitRate, mainCategory }}
                            />

                            <div>
                                <label className="label-text">Description / Subtitle</label>
                                <textarea
                                    name="description" value={formData.description} onChange={handleChange}
                                    placeholder="Brief description..." rows="2" className="input-field resize-none"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="label-text">Note (Optional)</label>
                                    <input name="note" value={formData.note} onChange={handleChange} placeholder="e.g. Visitation fee applicable" className="input-field" />
                                </div>
                                <div>
                                    <label className="label-text">Options Count (Optional)</label>
                                    <input type="number" name="optionsCount" value={formData.optionsCount} onChange={handleChange} placeholder="e.g. 6" className="input-field" />
                                </div>
                            </div>

                            <div>
                                <label className="label-text">Estimated Time</label>
                                <input required name="estimatedTime" value={formData.estimatedTime} onChange={handleChange} placeholder="e.g. 45-60 mins" className="input-field font-bold" />
                            </div>

                            <div>
                                <label className="label-text">Service Badge / Tag (e.g. SALE, 10 MIN, NEW)</label>
                                <div className="flex gap-3 items-center">
                                    <input
                                        name="tag"
                                        value={formData.tag}
                                        onChange={handleChange}
                                        placeholder="e.g. NEW"
                                        className="input-field flex-1"
                                    />
                                    <div className="flex gap-2">
                                        {['NEW', 'SALE', 'BESTSELLER', '10 MIN'].map(quickTag => (
                                            <button
                                                key={quickTag}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, tag: quickTag })}
                                                className="px-3 py-2 bg-slate-100 hover:bg-indigo-100 text-[10px] font-black rounded-xl transition-colors"
                                            >
                                                {quickTag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <InclusionsManager
                                {...{
                                    isPackage, pkgIncName, setPkgIncName, pkgIncDetail, setPkgIncDetail,
                                    packageInclusions, addPackageInclusion: () => {
                                        if (pkgIncName.trim()) {
                                            setPackageInclusions([...packageInclusions, { name: pkgIncName.trim(), detail: pkgIncDetail.trim() || 'Included' }]);
                                            setPkgIncName(''); setPkgIncDetail('');
                                        }
                                    },
                                    removePackageInclusion: (idx) => setPackageInclusions(packageInclusions.filter((_, i) => i !== idx)),
                                    inclusionInput, setInclusionInput, inclusions,
                                    addInclusion: () => {
                                        if (inclusionInput.trim()) {
                                            setInclusions([...inclusions, inclusionInput.trim()]);
                                            setInclusionInput('');
                                        }
                                    },
                                    removeInclusion: (idx) => setInclusions(inclusions.filter((_, i) => i !== idx))
                                }}
                            />

                            <ServiceImageUpload previewUrl={previewUrl} handleFileChange={handleFileChange} />

                            <ServiceDetailsManager
                                variants={variants} setVariants={setVariants}
                                trustContent={trustContent} setTrustContent={setTrustContent}
                                tipsContent={tipsContent} setTipsContent={setTipsContent}
                                trustImageFile={trustImageFile}
                                setTrustImageFile={setTrustImageFile}
                                tipsImageFile={tipsImageFile}
                                setTipsImageFile={setTipsImageFile}
                            />

                            {message.text && (
                                <div className={`p-4 rounded-2xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                    {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                    <span className="text-sm font-medium">{message.text}</span>
                                </div>
                            )}

                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`flex-1 ${isEditing ? 'bg-amber-500 hover:bg-amber-600' : 'bg-primary hover:bg-primary-dark'} text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all flex justify-center items-center gap-2 active:scale-95 disabled:bg-slate-300 uppercase tracking-wider`}
                                >
                                    {loading ? <Loader2 className="animate-spin text-white" /> : (isEditing ? 'Update Service' : (isPackage ? 'Create Package' : 'Create Service'))}
                                </button>

                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="px-8 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-all uppercase text-xs tracking-widest"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    )}
                </div>

                {/* Sidebar Column: Existing Services */}
                <div className="lg:col-span-4 space-y-6 sticky top-12">
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-secondary leading-none tracking-tight">Existing Data</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">In {subType || mainCategory}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {services && services.length > 0 && (
                                    <button
                                        onClick={handleDeleteAll}
                                        className="p-2 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-xl transition-all mr-2"
                                        title="Delete All Packages"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                                <Layers size={20} className="text-primary" />
                            </div>
                        </div>

                        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                            {servicesLoading ? (
                                <div className="space-y-4 animate-pulse">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex gap-4 p-3 bg-slate-50 rounded-2xl">
                                            <div className="w-16 h-16 bg-slate-200 rounded-xl"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                                                <div className="h-2 bg-slate-200 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : services && services.length > 0 ? (
                                services.map((s) => (
                                    <div key={s._id} className="flex gap-4 p-3 hover:bg-slate-50 rounded-2xl transition group border border-transparent hover:border-slate-100 cursor-default">
                                        <div className="w-16 h-16 bg-white border border-slate-100 rounded-xl overflow-hidden shrink-0 shadow-sm">
                                            <img
                                                src={s.packageImage?.startsWith('http') ? s.packageImage : `${BASE_URL}/${s.packageImage}`}
                                                alt=""
                                                className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-secondary text-sm truncate leading-tight mb-1">{s.packageName}</h4>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-bold text-primary">₹{s.priceAmount}</span>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => handleEdit(s)}
                                                        className="p-1.5 hover:bg-primary/10 text-primary rounded-lg transition-colors bg-primary/5"
                                                    >
                                                        <Edit2 size={13} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(s._id, s.serviceCategory)}
                                                        className="p-1.5 hover:bg-red-100 text-red-500 rounded-lg transition-colors bg-red-50"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="flex items-center text-[9px] text-slate-400 font-bold">
                                                    <Star size={9} className="text-yellow-400 fill-yellow-400 mr-0.5" />
                                                    {s.rating || '4.8'}
                                                </div>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-1.5 py-0.5 rounded">{s.serviceCategory}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 text-center">
                                    <Tag size={32} className="mx-auto text-slate-200 mb-2" />
                                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-loose">No services in this<br />category yet</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tip Card */}
                    <div className="bg-secondary p-6 rounded-3xl text-white shadow-xl shadow-secondary/10 relative overflow-hidden group">
                        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/40 transition-all"></div>
                        <h4 className="font-bold uppercase text-[10px] tracking-widest mb-2 text-primary">Pro Tip</h4>
                        <p className="text-[11px] font-medium leading-relaxed text-slate-300">
                            Check existing services to ensure naming consistency and competitive pricing. Duplicate services might confuse customers.
                        </p>
                    </div>
                </div>

                <style>{`
                    .label-text { display: block; font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem; }
                    .input-field { width: 100%; padding: 0.75rem 1.25rem; border-radius: 1rem; background-color: #f8fafc; border: 1px solid #eef2f6; outline: none; transition: all 0.2s; color: #1a1c21; font-weight: 500; font-size: 0.875rem; }
                    .input-field:focus { border-color: #0c8182; background-color: white; box-shadow: 0 0 0 4px rgba(12, 129, 130, 0.1); }
                    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                    .no-scrollbar::-webkit-scrollbar { display: none; }
                `}</style>
            </div>
        </div>
    );
};

export default AdminAddService;
