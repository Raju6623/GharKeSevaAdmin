import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Star, Tag, Pencil, Search } from 'lucide-react';
import EditServiceModal from '../modals/EditServiceModal';
import { getImageUrl } from '../../config';

const ServicesTab = ({ services, selectedCategory, onCategoryChange, onDeleteService, onUpdateService }) => {
    const [editingService, setEditingService] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const categories = [
        'All Services', 'AC', 'Plumbing', 'Electrician', 'Carpenter',
        'RO', 'Salon', 'HouseMaid', 'Painting', 'Smart Lock', 'Appliances'
    ];

    const filteredServices = (services || []).filter(s =>
        s.packageName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.tag?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter italic uppercase">Service Catalog</h2>
                <Link to="/add-service" className="bg-slate-900 text-white px-6 py-2 rounded-full font-bold text-xs hover:bg-slate-800 transition shadow-lg shadow-slate-200">
                    + Add New Service
                </Link>
            </div>

            {/* Filters & Search Row */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Category Filter */}
                <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar px-1">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => onCategoryChange(cat)}
                            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${selectedCategory === cat
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                                : 'bg-white text-slate-400 border border-slate-100 hover:border-blue-200 hover:text-blue-500'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="w-full lg:w-80 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search service name..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-blue-500/10 outline-none transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredServices.length > 0 ? filteredServices.map(service => (
                    <div key={service._id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition group relative">
                        {/* Badge Tag */}
                        {service.tag && (
                            <div className="absolute top-4 left-4 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-sm z-10">
                                {service.tag}
                            </div>
                        )}

                        <div className="aspect-video bg-gray-50 rounded-xl mb-4 overflow-hidden relative">
                            <img
                                src={getImageUrl(service.packageImage)}
                                alt={service.packageName}
                                className="w-full h-full object-cover"
                            />
                            {/* Discount Badge */}
                            {service.discount > 0 && (
                                <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur text-emerald-700 text-[10px] font-black px-2 py-1 rounded-lg">
                                    {service.discount}% OFF
                                </div>
                            )}
                        </div>

                        <h3 className="font-black text-slate-900 leading-tight mb-1 truncate">{service.packageName}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">{service.serviceCategory}</p>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                                <span className="font-black text-slate-900">₹{service.priceAmount}</span>
                                <div className="flex items-center text-xs text-slate-400 ml-2 font-bold">
                                    <Star size={12} className="text-yellow-400 fill-yellow-400 mr-0.5" />
                                    {service.rating || '0.0'}
                                </div>
                            </div>

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setEditingService(service)}
                                    className="text-blue-400 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-full transition"
                                    title="Edit Service"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to delete this service?')) {
                                            onDeleteService({ id: service._id, category: service.serviceCategory });
                                        }
                                    }}
                                    className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition"
                                    title="Delete Service"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                        <Tag size={40} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No services found</p>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editingService && (
                <EditServiceModal
                    service={editingService}
                    onClose={() => setEditingService(null)}
                    onUpdate={onUpdateService}
                />
            )}
        </div>
    );
};

export default ServicesTab;
