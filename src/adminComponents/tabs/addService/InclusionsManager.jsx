import React from 'react';
import { Layers, PlusCircle, X, ListPlus } from 'lucide-react';

const InclusionsManager = ({
    isPackage,
    pkgIncName, setPkgIncName,
    pkgIncDetail, setPkgIncDetail,
    packageInclusions, addPackageInclusion, removePackageInclusion,
    inclusionInput, setInclusionInput,
    inclusions, addInclusion, removeInclusion
}) => {
    return (
        <div className="space-y-6">
            {isPackage ? (
                <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100">
                    <div className="flex items-center gap-2 mb-4 text-emerald-800">
                        <Layers size={18} />
                        <h3 className="font-bold text-sm uppercase tracking-wide">Package Inclusions</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3">
                        <input
                            value={pkgIncName} onChange={(e) => setPkgIncName(e.target.value)}
                            placeholder="Service Name (e.g. Waxing)"
                            className="md:col-span-2 input-field bg-white"
                        />
                        <input
                            value={pkgIncDetail} onChange={(e) => setPkgIncDetail(e.target.value)}
                            placeholder="Details (e.g. Full arms + legs)"
                            className="md:col-span-2 input-field bg-white"
                        />
                        <button type="button" onClick={addPackageInclusion} className="bg-emerald-600 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-700 transition">
                            <PlusCircle size={20} />
                        </button>
                    </div>

                    <div className="space-y-2">
                        {packageInclusions.map((pkg, idx) => (
                            <div key={idx} className="flex justify-between items-start bg-white p-3 rounded-xl border border-emerald-100 shadow-sm">
                                <div>
                                    <div className="font-bold text-slate-800 text-sm">{pkg.name}</div>
                                    <div className="text-xs text-slate-500">{pkg.detail}</div>
                                </div>
                                <button type="button" onClick={() => removePackageInclusion(idx)} className="text-red-400 hover:text-red-600">
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                        {packageInclusions.length === 0 && <p className="text-xs text-emerald-600/60 font-medium italic text-center py-2">No inclusions added yet.</p>}
                    </div>
                </div>
            ) : (
                <div>
                    <label className="label-text">Service Inclusions (Checklist)</label>
                    <div className="flex gap-2 mb-3">
                        <input
                            value={inclusionInput} onChange={(e) => setInclusionInput(e.target.value)}
                            placeholder="e.g. Indoor Unit Jet Wash" className="input-field flex-1"
                        />
                        <button type="button" onClick={addInclusion} className="bg-slate-900 text-white p-3 rounded-2xl hover:bg-slate-800 transition-all">
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
            )}
        </div>
    );
};

export default InclusionsManager;
