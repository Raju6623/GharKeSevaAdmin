import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageSquare, Plus, X, Image as ImageIcon, Trash2, Heart, Award, Cake, ShieldCheck, Megaphone, Search, Filter, MoreHorizontal } from 'lucide-react';
import api from '../../api/axiosConfig';
import { BASE_URL } from '../../config';
import Swal from 'sweetalert2';

const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    return `${BASE_URL}/${path.replace(/^\/+/, '')}`;
};

const CommunityManager = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all'); // all, announcement, celebration, achievement, user_post

    const [newPost, setNewPost] = useState({
        type: 'announcement',
        title: '',
        content: '',
        category: 'General'
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await api.get('/community/posts');
            setPosts(Array.isArray(res.data) ? res.data : []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleCreatePost = async () => {
        if (!newPost.title || !newPost.content) {
            Swal.fire('Error', 'Please fill all required fields', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('type', newPost.type);
        formData.append('title', newPost.title);
        formData.append('content', newPost.content);
        formData.append('category', newPost.category);
        formData.append('authorName', 'GharKeSeva Admin');
        formData.append('authorRole', 'Official');
        formData.append('isOfficial', true);
        if (selectedImage) {
            formData.append('image', selectedImage);
        }

        try {
            await api.post('/community/posts/add', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            Swal.fire('Success', 'Post shared on GS Parivaar feed!', 'success');
            setIsAdding(false);
            setNewPost({ type: 'announcement', title: '', content: '', category: 'General' });
            setSelectedImage(null);
            setPreviewUrl(null);
            fetchPosts();
        } catch (e) {
            Swal.fire('Error', 'Failed to share post', 'error');
        }
    };

    const handleDeletePost = async (postId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This post will be permanently removed from the parivaar feed!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0c8182',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'No'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/community/posts/${postId}`);
                Swal.fire('Deleted!', 'Post removed successfully.', 'success');
                fetchPosts();
            } catch (e) {
                Swal.fire('Error', 'Failed to remove post.', 'error');
            }
        }
    };

    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.authorName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || post.type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="bg-secondary p-10 rounded-[3rem] relative overflow-hidden shadow-2xl text-white group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:bg-primary/20 transition-all duration-700"></div>

                <div className="relative z-10 flex flex-col lg:flex-row justify-between lg:items-center gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-8 h-1 bg-primary rounded-full"></span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Administration</span>
                        </div>
                        <h2 className="text-4xl font-black tracking-tight uppercase italic">GS Parivaar <span className="text-primary">Community</span></h2>
                        <p className="text-slate-400 font-medium text-sm mt-2 max-w-sm italic">
                            Manage official announcements and vendor experiences.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <div className="flex bg-white/5 backdrop-blur-xl border border-white/10 p-2 rounded-2xl w-full sm:w-auto min-w-[300px]">
                            <div className="flex items-center px-4 gap-3 flex-1">
                                <Search className="text-slate-500" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search posts..."
                                    className="bg-transparent border-none outline-none text-white placeholder:text-slate-500 text-sm font-medium w-full py-2"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-2xl font-black uppercase tracking-tight shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap"
                        >
                            <Plus size={20} />
                            New Post
                        </button>
                    </div>
                </div>
            </div>

            {isAdding && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-8 rounded-[3.5rem] border-2 border-primary/10 shadow-3xl space-y-8"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                                <Megaphone size={24} />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 uppercase italic">Create Official Post</h3>
                        </div>
                        <button onClick={() => setIsAdding(false)} className="p-2 text-slate-300 hover:text-slate-600">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Post Type</label>
                                    <select
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        value={newPost.type}
                                        onChange={(e) => setNewPost({ ...newPost, type: e.target.value })}
                                    >
                                        <option value="announcement">Announcement (Official)</option>
                                        <option value="celebration">Celebration (Birthday/Anniversary)</option>
                                        <option value="achievement">Achievement (Top Performer)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Category</label>
                                    <input
                                        type="text"
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="e.g. Festival, News, Reward"
                                        value={newPost.category}
                                        onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Heading / Title</label>
                                <input
                                    type="text"
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="e.g. Happy New Year 2026!"
                                    value={newPost.title}
                                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Message Body</label>
                                <textarea
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-inner"
                                    placeholder="Write your message here..."
                                    rows={5}
                                    value={newPost.content}
                                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Cover Image (Optional)</label>
                                <div
                                    onClick={() => document.getElementById('post-img-input-admin').click()}
                                    className="w-full h-72 bg-slate-50 border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100/50 hover:border-primary/20 transition-all overflow-hidden relative group"
                                >
                                    {previewUrl ? (
                                        <>
                                            <img src={previewUrl} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <p className="text-white text-xs font-black uppercase tracking-tighter">Change Image</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="p-4 bg-white rounded-2xl shadow-sm mb-3 text-slate-300">
                                                <ImageIcon size={32} />
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Click to upload banner</p>
                                        </>
                                    )}
                                    <input type="file" id="post-img-input-admin" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={handleCreatePost}
                                    className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-tight shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-sm mb-3"
                                >
                                    Publish to GS Parivaar
                                </button>
                                <button
                                    onClick={() => setIsAdding(false)}
                                    className="w-full py-4 bg-slate-100 text-slate-400 rounded-2xl font-black uppercase tracking-tight hover:bg-slate-200 transition-all text-xs"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* SEPARATE TABLE VIEW FOR MANAGE POSTS */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-lg font-black text-secondary tracking-tight uppercase italic">Manage Feed Posts</h3>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center bg-slate-50 p-1 rounded-xl">
                            <button
                                onClick={() => setFilterType('all')}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filterType === 'all' ? 'bg-secondary text-white shadow-md' : 'text-slate-400 hover:text-secondary'}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilterType('user_post')}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filterType === 'user_post' ? 'bg-[#0c8182] text-white shadow-md' : 'text-slate-400 hover:text-secondary'}`}
                            >
                                Vendor
                            </button>
                            <button
                                onClick={() => setFilterType('announcement')}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filterType === 'announcement' ? 'bg-blue-500 text-white shadow-md' : 'text-slate-400 hover:text-secondary'}`}
                            >
                                Official
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Post</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Author</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Engagement</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Category</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 text-center">Type</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredPosts.length > 0 ? filteredPosts.map((post) => (
                                <tr key={post._id} className="hover:bg-slate-50/80 transition-all group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-100 shadow-sm shrink-0">
                                                {post.image ? (
                                                    <img src={getImageUrl(post.image)} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-200">
                                                        <ImageIcon size={20} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="max-w-xs">
                                                <h4 className="font-black text-secondary text-xs truncate">{post.title}</h4>
                                                <p className="text-[10px] font-medium text-slate-400 line-clamp-1 mt-0.5 italic">{post.content}</p>
                                                <p className="text-[9px] font-bold text-slate-300 mt-1 uppercase tracking-tighter">{new Date(post.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-[#0c8182] text-[10px] font-black overflow-hidden border border-teal-100">
                                                {post.authorImg ? <img src={getImageUrl(post.authorImg)} className="w-full h-full object-cover" /> : <ShieldCheck size={14} />}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-secondary">{post.authorName}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{post.authorRole}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col items-center">
                                                <span className="text-xs font-black text-rose-500">{post.likes?.length || 0}</span>
                                                <span className="text-[8px] font-black text-slate-300 uppercase">Likes</span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <span className="text-xs font-black text-amber-500">{post.claps || 0}</span>
                                                <span className="text-[8px] font-black text-slate-300 uppercase">Claps</span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <span className="text-xs font-black text-blue-500">{post.comments?.length || 0}</span>
                                                <span className="text-[8px] font-black text-slate-300 uppercase">Comments</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[9px] font-black rounded-lg uppercase tracking-widest">
                                            {post.category || 'General'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${post.type === 'announcement' ? 'bg-blue-50 text-blue-500' :
                                            post.type === 'celebration' ? 'bg-amber-50 text-amber-500' :
                                                post.type === 'achievement' ? 'bg-purple-50 text-purple-500' :
                                                    'bg-teal-50 text-teal-500'
                                            }`}>
                                            {post.type.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleDeletePost(post._id)}
                                                className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                                title="Delete Post"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <button className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl transition-all">
                                                <MoreHorizontal size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                                            <MessageSquare size={24} />
                                        </div>
                                        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No community posts found</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {loading && posts.length === 0 && (
                <div className="py-20 text-center">
                    <div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Synchronizing Feed...</p>
                </div>
            )}
        </div>
    );
};

export default CommunityManager;
