import React, { useEffect } from 'react';
import { categoryMapping } from '../../constants/serviceConstants';

const ServiceTypeSelector = ({ mainCategory, setMainCategory, subType, setSubType, serviceAction, setServiceAction }) => {
    const currentCategory = categoryMapping[mainCategory];

    // Resolve actions: handle both array and object-mapped-by-subtype structures
    let actionsList = [];
    if (currentCategory) {
        if (Array.isArray(currentCategory.actions)) {
            actionsList = currentCategory.actions;
        } else if (typeof currentCategory.actions === 'object' && currentCategory.actions !== null) {
            actionsList = currentCategory.actions[subType] || [];
        }
    }

    // Auto-reset serviceAction if it's not valid for the current subType/actions list
    useEffect(() => {
        if (actionsList.length > 0) {
            const isValid = actionsList.some(act => act.value === serviceAction);
            if (!isValid) {
                setServiceAction(actionsList[0].value);
            }
        }
    }, [actionsList, serviceAction, setServiceAction]);

    return (
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label className="label-text">Category</label>
                <select
                    value={mainCategory}
                    onChange={(e) => {
                        const newCat = e.target.value;
                        setMainCategory(newCat);
                        const newSub = categoryMapping[newCat].subTypes[0] || "";
                        setSubType(newSub);
                    }}
                    className="input-field"
                >
                    {Object.keys(categoryMapping).map(key => <option key={key} value={key}>{key}</option>)}
                </select>
            </div>

            {currentCategory.subTypes.length > 0 && (
                <div>
                    <label className="label-text">Type / Appliance</label>
                    <select
                        value={subType}
                        onChange={(e) => setSubType(e.target.value)}
                        className="input-field font-bold text-indigo-600"
                    >
                        {currentCategory.subTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
            )}

            <div>
                <label className="label-text">Service Action</label>
                <select
                    value={serviceAction}
                    onChange={(e) => setServiceAction(e.target.value)}
                    className="input-field"
                >
                    {actionsList.map((act, i) => (
                        <option key={act.value + i} value={act.value}>{act.label}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default ServiceTypeSelector;
