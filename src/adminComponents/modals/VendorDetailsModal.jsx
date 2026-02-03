import React from 'react';
import { X as CloseIcon, CheckCircle2, MapPin, Wallet } from 'lucide-react';

const VendorDetailsModal = ({ vendor, onClose, onVerify, onDelete, onBlock }) => {
    // Initialize with existing message if present
    const [adminNote, setAdminNote] = React.useState(vendor?.verificationMessage || '');

    if (!vendor) return null;

    return (
        <div className="fixed inset-0 z[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm z-[100]">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] md:rounded-[2.5rem] shadow-2xl relative p-6 md:p-8">
                <button onClick={onClose} className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors z-10">
                    <CloseIcon size={20} className="text-slate-500" />
                </button>

                <div className="flex flex-col md:flex-row gap-8 mb-8">
                    <div className="w-32 h-32 rounded-3xl bg-slate-100 border-4 border-white shadow-lg overflow-hidden shrink-0">
                        <img src={vendor.vendorPhoto || 'https://placehold.co/150'} className="w-full h-full object-cover" alt="Vendor" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-3xl font-black text-slate-900 leading-none">{vendor.firstName} {vendor.lastName}</h2>
                            {vendor.isVerified ?
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><CheckCircle2 size={12} /> Verified</span> :
                                <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Pending</span>
                            }
                        </div>
                        <p className="text-blue-600 font-bold uppercase text-xs tracking-wider mb-4">{vendor.vendorCategory} • {vendor.experience || 0} Years Exp.</p>

                        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                            <div><span className="font-bold text-slate-400 text-xs uppercase">Phone:</span> <span className="font-semibold text-slate-700">{vendor.userPhone}</span></div>
                            <div><span className="font-bold text-slate-400 text-xs uppercase">Alt:</span> <span className="font-semibold text-slate-700">{vendor.alternatePhone || '-'}</span></div>
                            <div><span className="font-bold text-slate-400 text-xs uppercase">Email:</span> <span className="font-semibold text-slate-700">{vendor.userEmail}</span></div>
                            <div><span className="font-bold text-slate-400 text-xs uppercase">ID:</span> <span className="font-semibold text-slate-700">{vendor.customUserId}</span></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-4 flex items-center gap-2"><MapPin size={16} /> Address Details</h3>
                        <p className="font-medium text-slate-600 leading-relaxed text-sm">{vendor.vendorAddress || `${vendor.vendorStreet}, ${vendor.vendorCity}, ${vendor.vendorState}`}</p>
                        <div className="mt-2 flex gap-2">
                            <span className="bg-white px-3 py-1 rounded-lg text-xs font-bold text-slate-500 shadow-sm">{vendor.vendorCity}</span>
                            <span className="bg-white px-3 py-1 rounded-lg text-xs font-bold text-slate-500 shadow-sm">{vendor.vendorPincode}</span>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-4 flex items-center gap-2"><Wallet size={16} /> Banking & KYC</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between border-b border-slate-200 pb-2">
                                <span className="text-xs font-bold text-slate-400 uppercase">Bank Name</span>
                                <span className="text-sm font-semibold text-slate-700">{vendor.bankName || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-200 pb-2">
                                <span className="text-xs font-bold text-slate-400 uppercase">Account No.</span>
                                <span className="text-sm font-semibold text-slate-700">{vendor.accountNumber || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-200 pb-2">
                                <span className="text-xs font-bold text-slate-400 uppercase">IFSC Code</span>
                                <span className="text-sm font-semibold text-slate-700">{vendor.ifscCode || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between pt-1">
                                <span className="text-xs font-bold text-slate-400 uppercase">Aadhar / PAN</span>
                                <div className="text-right">
                                    <span className="block text-xs font-semibold text-slate-700">{vendor.aadharNumber}</span>
                                    <span className="block text-xs font-semibold text-slate-500">{vendor.panNumber}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Document Verification Section */}
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-8">
                    <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-blue-500" /> Verify Documents
                    </h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'Aadhar Front', key: 'aadharFront' },
                            { label: 'Aadhar Back', key: 'aadharBack' },
                            { label: 'PAN Card', key: 'panCard' },
                            { label: 'Experience Cert', key: 'experienceCert' }
                        ].map((doc, idx) => (
                            <div key={idx} className="space-y-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{doc.label}</span>
                                <div className="aspect-[4/3] rounded-2xl bg-white border border-slate-200 overflow-hidden group relative cursor-pointer shadow-sm hover:shadow-md transition-all">
                                    {vendor[doc.key] ? (
                                        <>
                                            <img src={vendor[doc.key]} className="w-full h-full object-cover" alt={doc.label} />
                                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                                onClick={() => window.open(vendor[doc.key], '_blank')}>
                                                <span className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] text-white font-bold uppercase tracking-widest border border-white/30">View Full</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                            <CloseIcon size={24} strokeWidth={1} />
                                            <span className="text-[8px] font-black uppercase tracking-tighter mt-1">Not Uploaded</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Admin Note Section */}
                <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 mb-8">
                    <h3 className="font-black text-amber-900 text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="bg-amber-100 p-1 rounded-md"><CloseIcon size={12} className="text-amber-600" /></span>
                        Admin Note / Rejection Reason
                    </h3>
                    <textarea
                        className="w-full h-24 rounded-xl border-0 bg-white p-4 text-sm font-medium text-red-600 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400 shadow-sm resize-none"
                        placeholder="e.g. Please upload a clear Aadhar card image..."
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                    />
                    <p className="mt-2 text-[10px] text-amber-700/60 font-bold uppercase tracking-wide">
                        * This message will be shown to the vendor if you Reject or keep them Pending.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={onClose} className="w-full sm:flex-1 py-4 rounded-2xl border border-slate-200 text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-colors">Close</button>

                    {!vendor.isVerified && (
                        <>
                            {/* Reject / Update Message Button */}
                            <button
                                onClick={() => onVerify(vendor, adminNote, false)}
                                className="w-full sm:flex-1 py-4 rounded-2xl bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">
                                Update Note / Reject
                            </button>

                            {/* Verify & Approve Button */}
                            <button
                                onClick={() => onVerify(vendor, "", true)}
                                className="w-full sm:flex-[2] py-4 rounded-2xl bg-emerald-500 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all">
                                <CheckCircle2 size={18} className="inline mr-2" /> Verify & Approve
                            </button>
                        </>
                    )}
                </div>

                {/* Security / Danger Zone */}
                <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-6 border-t border-slate-100">
                    <button
                        onClick={() => onBlock(vendor.customUserId, adminNote || "Security Concern")}
                        className="w-full sm:flex-1 py-4 rounded-2xl bg-amber-500 text-white font-black text-xs uppercase tracking-widest hover:bg-amber-600 transition-colors shadow-lg shadow-amber-100">
                        Block Vendor
                    </button>
                    <button
                        onClick={() => onDelete(vendor.customUserId)}
                        className="w-full sm:flex-1 py-4 rounded-2xl bg-red-500 text-white font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-colors shadow-lg shadow-red-100">
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VendorDetailsModal;
