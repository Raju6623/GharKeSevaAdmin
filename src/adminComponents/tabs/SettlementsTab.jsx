import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wallet,
    Clock,
    CheckCircle2,
    XCircle,
    ArrowUpRight,
    Building2,
    CreditCard,
    IndianRupee,
    AlertCircle,
    Filter,
    Search,
    Download,
    Eye,
    UserCheck,
    TrendingUp,
    DollarSign
} from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../../config';
import Swal from 'sweetalert2';

const SettlementsTab = () => {
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('PENDING'); // PENDING, PAID, ALL
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        fetchWithdrawals();
    }, [filter]);

    const fetchWithdrawals = async () => {
        setLoading(true);
        try {
            const url = filter === 'ALL'
                ? `${BASE_URL}/api/auth/admin/payouts`
                : `${BASE_URL}/api/auth/admin/payouts?status=${filter}`;
            const res = await axios.get(url);
            setWithdrawals(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error('Failed to fetch withdrawals:', error);
            setWithdrawals([]);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (requestId) => {
        const { value: formValues } = await Swal.fire({
            title: 'Approve Payout',
            html: `
                <div class="text-left space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">Payment Reference / UTR</label>
                        <input id="paymentRef" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm" placeholder="Enter UTR or transaction ID">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">Admin Note (Optional)</label>
                        <textarea id="adminNote" class="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm" rows="3" placeholder="Any remarks..."></textarea>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Confirm Payout',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#0c8182',
            preConfirm: () => {
                return {
                    paymentReference: document.getElementById('paymentRef').value,
                    adminNote: document.getElementById('adminNote').value
                };
            }
        });

        if (formValues) {
            setProcessingId(requestId);
            try {
                await axios.put(`${BASE_URL}/api/auth/admin/payouts/approve/${requestId}`, formValues);
                Swal.fire('Success!', 'Payout approved and marked as paid.', 'success');
                fetchWithdrawals();
            } catch (error) {
                Swal.fire('Error', error.response?.data?.error || 'Failed to approve payout', 'error');
            } finally {
                setProcessingId(null);
            }
        }
    };

    const stats = {
        pending: withdrawals.filter(w => w.status === 'PENDING').length,
        pendingAmount: withdrawals.filter(w => w.status === 'PENDING').reduce((sum, w) => sum + w.amount, 0),
        paid: withdrawals.filter(w => w.status === 'PAID').length,
        paidAmount: withdrawals.filter(w => w.status === 'PAID').reduce((sum, w) => sum + w.amount, 0)
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
            {/* Header */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Vendor Settlements</h2>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Manage withdrawal requests and payouts</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-2xl">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Auto-sync</span>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    icon={<Clock size={20} />}
                    label="Pending Requests"
                    value={stats.pending}
                    subValue={`₹${stats.pendingAmount.toLocaleString('en-IN')}`}
                    color="amber"
                />
                <StatsCard
                    icon={<CheckCircle2 size={20} />}
                    label="Paid This Month"
                    value={stats.paid}
                    subValue={`₹${stats.paidAmount.toLocaleString('en-IN')}`}
                    color="emerald"
                />
                <StatsCard
                    icon={<TrendingUp size={20} />}
                    label="Processing Time"
                    value="24-48h"
                    subValue="Average"
                    color="indigo"
                />
                <StatsCard
                    icon={<DollarSign size={20} />}
                    label="Total Volume"
                    value={`₹${(stats.pendingAmount + stats.paidAmount).toLocaleString('en-IN')}`}
                    subValue="All Time"
                    color="slate"
                />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                {['PENDING', 'PAID', 'ALL'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${filter === status
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                                : 'bg-white text-slate-400 border border-slate-200 hover:border-indigo-300'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Withdrawal Requests Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                            <Wallet size={20} />
                        </div>
                        <h3 className="text-lg font-black text-slate-800 tracking-tight uppercase">Withdrawal Requests</h3>
                    </div>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{withdrawals.length} Total</span>
                </div>

                {loading ? (
                    <div className="py-20 flex items-center justify-center">
                        <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                    </div>
                ) : withdrawals.length > 0 ? (
                    <div className="divide-y divide-slate-50">
                        {withdrawals.map((req) => (
                            <WithdrawalRequestRow
                                key={req._id}
                                request={req}
                                onApprove={handleApprove}
                                onViewDetails={setSelectedRequest}
                                isProcessing={processingId === req._id}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 flex flex-col items-center justify-center text-slate-300">
                        <div className="w-16 h-16 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-center mb-6">
                            <AlertCircle size={32} />
                        </div>
                        <p className="text-sm font-black uppercase tracking-widest">No {filter.toLowerCase()} requests</p>
                        <p className="text-xs font-medium mt-1">Check back later</p>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedRequest && (
                    <DetailModal request={selectedRequest} onClose={() => setSelectedRequest(null)} />
                )}
            </AnimatePresence>
        </div>
    );
};

const StatsCard = ({ icon, label, value, subValue, color = 'indigo' }) => {
    const colorClasses = {
        amber: 'bg-amber-50 text-amber-600 border-amber-100',
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
        slate: 'bg-slate-50 text-slate-600 border-slate-100'
    };

    return (
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${colorClasses[color]}`}>
                {icon}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
            <p className="text-2xl font-black text-slate-800 tracking-tight mb-1">{value}</p>
            <p className="text-xs font-bold text-slate-400">{subValue}</p>
        </div>
    );
};

const WithdrawalRequestRow = ({ request, onApprove, onViewDetails, isProcessing }) => {
    const statusConfig = {
        PENDING: { color: 'amber', icon: Clock, label: 'Pending' },
        PAID: { color: 'emerald', icon: CheckCircle2, label: 'Paid' },
        REJECTED: { color: 'rose', icon: XCircle, label: 'Rejected' }
    };

    const config = statusConfig[request.status] || statusConfig.PENDING;
    const StatusIcon = config.icon;

    return (
        <div className="p-6 hover:bg-slate-50/50 transition-colors group">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Left: Vendor Info */}
                <div className="flex items-start gap-5 flex-1">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-${config.color}-50 text-${config.color}-600`}>
                        <StatusIcon size={20} />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                            <p className="text-sm font-black text-slate-800">Vendor {request.vendorId}</p>
                            <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-${config.color}-100 text-${config.color}-800`}>
                                {config.label}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span>{new Date(request.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                            {request.bankDetails?.bankName && (
                                <>
                                    <span className="text-slate-200">•</span>
                                    <span className="text-indigo-500">{request.bankDetails.bankName}</span>
                                </>
                            )}
                            {request.bankDetails?.accountNumber && (
                                <>
                                    <span className="text-slate-200">•</span>
                                    <span>A/C •••• {String(request.bankDetails.accountNumber).slice(-4)}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Middle: Amount */}
                <div className="text-left lg:text-right">
                    <p className="text-2xl font-black text-slate-800 tracking-tight mb-1">₹{request.amount.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Withdrawal Amount</p>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => onViewDetails(request)}
                        className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
                        title="View Details"
                    >
                        <Eye size={18} />
                    </button>

                    {request.status === 'PENDING' && (
                        <button
                            onClick={() => onApprove(request._id)}
                            disabled={isProcessing}
                            className="px-6 py-3 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            {isProcessing ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <CheckCircle2 size={16} />
                            )}
                            Approve
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const DetailModal = ({ request, onClose }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
                <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-slate-800">Withdrawal Details</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Request ID: {request._id.slice(-8)}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                        <XCircle size={24} />
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    {/* Amount Section */}
                    <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-[2rem] text-white">
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">Withdrawal Amount</p>
                        <p className="text-4xl font-black tracking-tighter">₹{request.amount.toLocaleString('en-IN')}</p>
                    </div>

                    {/* Bank Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DetailField label="Account Holder" value={request.bankDetails?.accountHolder} />
                        <DetailField label="Account Number" value={request.bankDetails?.accountNumber} />
                        <DetailField label="IFSC Code" value={request.bankDetails?.ifscCode} />
                        <DetailField label="Bank Name" value={request.bankDetails?.bankName} />
                    </div>

                    {/* Status & Timing */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DetailField label="Status" value={request.status} />
                        <DetailField label="Requested On" value={new Date(request.createdAt).toLocaleString('en-IN')} />
                        {request.processedAt && (
                            <DetailField label="Processed On" value={new Date(request.processedAt).toLocaleString('en-IN')} />
                        )}
                        {request.paymentReference && (
                            <DetailField label="Payment Reference" value={request.paymentReference} />
                        )}
                    </div>

                    {request.adminNote && (
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Admin Note</p>
                            <p className="text-sm font-medium text-slate-700 leading-relaxed">{request.adminNote}</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

const DetailField = ({ label, value }) => (
    <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
        <p className="text-sm font-black text-slate-800 tracking-tight">{value || '-'}</p>
    </div>
);

export default SettlementsTab;
