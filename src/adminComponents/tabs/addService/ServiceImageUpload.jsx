import React from 'react';
import { Upload } from 'lucide-react';

const ServiceImageUpload = ({ previewUrl, handleFileChange }) => {
    return (
        <div>
            <label className="label-text">Service / Package Image</label>
            <div className="relative border-2 border-dashed border-slate-200 rounded-[2rem] p-4 hover:border-indigo-400 transition-colors bg-slate-50/50 text-center">
                <input
                    type="file" accept="image/*" onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {previewUrl ? (
                    <div className="flex items-center gap-4 justify-center">
                        <img src={previewUrl} alt="Preview" className="w-20 h-20 object-cover rounded-2xl shadow-md" />
                        <p className="text-sm text-indigo-600 font-bold">Image Selected!</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <Upload className="mx-auto text-slate-300 mb-1" size={32} />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload Image</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServiceImageUpload;
