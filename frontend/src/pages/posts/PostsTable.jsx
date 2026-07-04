import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { postApi } from '../../api/services';
import Modal from '../../components/Modal';
import useToastStore from '../../store/useToastStore';

const CATEGORIES = ['', 'Technology', 'Lifestyle', 'Travel', 'Business', 'Health', 'Other'];

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
    status === 'published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-amber-50 text-amber-700 border border-amber-200/60'
  }`}>
    {status}
  </span>
);

const CategoryBadge = ({ cat }) => {
  const colors = {
    Technology: 'bg-slate-900 text-white border-slate-950',
    Lifestyle: 'bg-slate-100 text-slate-800 border-slate-200',
    Travel: 'bg-slate-100 text-slate-800 border-slate-200',
    Business: 'bg-slate-100 text-slate-800 border-slate-200',
    Health: 'bg-slate-100 text-slate-800 border-slate-200',
    Other: 'bg-slate-100 text-slate-800 border-slate-200'
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors[cat] || colors.Other}`}>{cat}</span>;
};

export default function PostsTable() {
  const navigate = useNavigate();
  const showToast = useToastStore(s => s.showToast);

  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [page, setPage] = useState(1);
  const LIMIT = 8;

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await postApi.getAll({ page, limit: LIMIT, search: search || undefined, category: category || undefined });
      setPosts(data.data);
      setPagination(data.pagination);
    } catch (e) {
      showToast('Failed to fetch posts from server', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, category, showToast]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);
  useEffect(() => { setPage(1); }, [search, category]);

  const handleExport = async () => {
    try {
      const { data } = await postApi.exportCSV({ search: search || undefined, category: category || undefined });
      const url = URL.createObjectURL(new Blob([data]));
      const a = document.createElement('a'); a.href = url; a.download = 'posts.csv'; a.click();
      URL.revokeObjectURL(url);
      showToast('CSV Exported successfully!');
    } catch (e) {
      showToast('Failed to export posts to CSV', 'error');
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await postApi.remove(deleteTarget._id);
      showToast(`Post "${deleteTarget.title}" deleted successfully.`);
      setDeleteTarget(null);
      fetchPosts();
    } catch {
      showToast('Failed to delete post. Please try again.', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="p-2 rounded-xl border border-slate-200 text-slate-500 bg-white hover:text-slate-900 hover:border-slate-400 transition-all shadow-sm cursor-pointer" title="Back to Home">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Blog Posts</h1>
              <p className="text-slate-500 text-sm mt-1">{pagination.total} post{pagination.total !== 1 ? 's' : ''} total</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleExport} className="flex items-center gap-2 border border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              Export CSV
            </button>
            <Link to="/posts/new" className="flex items-center gap-2 bg-slate-950 text-white font-bold px-5 py-2 rounded-xl shadow-md shadow-slate-950/10 hover:bg-slate-800 transition-all text-sm">
              + New Post
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text"
              placeholder="Search by title, author, category..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-slate-400 transition-colors shadow-sm"
            />
          </div>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="bg-white border border-slate-200 text-slate-900 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-slate-400 transition-colors cursor-pointer min-w-[160px] shadow-sm"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c || 'All Categories'}</option>)}
          </select>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-widest px-5 py-3.5">Title</th>
                  <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-widest px-4 py-3.5">Author</th>
                  <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-widest px-4 py-3.5">Category</th>
                  <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-widest px-4 py-3.5">Status</th>
                  <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-widest px-4 py-3.5">Date</th>
                  <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-widest px-4 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array(LIMIT).fill(0).map((_, i) => (
                    <tr key={i}>
                      {[1,2,3,4,5,6].map(j => <td key={j} className="px-5 py-4"><div className="h-4 bg-slate-100 rounded animate-pulse" /></td>)}
                    </tr>
                  ))
                ) : posts.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-16 text-slate-400">No posts found. <Link to="/posts/new" className="text-slate-900 hover:underline font-semibold">Create one</Link></td></tr>
                ) : posts.map(post => (
                  <tr key={post._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-900 text-sm line-clamp-1 max-w-[220px]">{post.title}</div>
                      {post.tags?.length > 0 && <div className="flex gap-1 mt-1 flex-wrap">{post.tags.slice(0,2).map(t => <span key={t} className="text-xs text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/50">#{t}</span>)}</div>}
                    </td>
                    <td className="px-4 py-4 text-slate-600 text-sm">{post.author}</td>
                    <td className="px-4 py-4"><CategoryBadge cat={post.category} /></td>
                    <td className="px-4 py-4"><StatusBadge status={post.status} /></td>
                    <td className="px-4 py-4 text-slate-500 text-xs whitespace-nowrap">{new Date(post.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Link to={`/posts/${post._id}`} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-all" title="View">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        </Link>
                        <Link to={`/posts/${post._id}/edit`} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-all" title="Edit">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        </Link>
                        <button onClick={() => setDeleteTarget(post)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 transition-all" title="Delete">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-slate-100">
            {loading ? (
              Array(4).fill(0).map((_, i) => <div key={i} className="p-4 space-y-2"><div className="h-4 bg-slate-100 rounded animate-pulse w-3/4"/><div className="h-3 bg-slate-100 rounded animate-pulse w-1/2"/></div>)
            ) : posts.length === 0 ? (
              <div className="text-center py-16 text-slate-400">No posts found.</div>
            ) : posts.map(post => (
              <div key={post._id} className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="font-bold text-slate-900 text-sm line-clamp-2 flex-1">{post.title}</div>
                  <StatusBadge status={post.status} />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-slate-500">{post.author}</span>
                  <span className="text-slate-300">.</span>
                  <CategoryBadge cat={post.category} />
                  <span className="text-slate-300">.</span>
                  <span className="text-xs text-slate-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2">
                  <Link to={`/posts/${post._id}`} className="flex-1 text-center text-xs text-slate-700 border border-slate-200 bg-white py-1.5 rounded-lg font-semibold hover:bg-slate-50">View</Link>
                  <Link to={`/posts/${post._id}/edit`} className="flex-1 text-center text-xs text-slate-700 border border-slate-200 bg-white py-1.5 rounded-lg font-semibold hover:bg-slate-50">Edit</Link>
                  <button onClick={() => setDeleteTarget(post)} className="flex-1 text-xs text-red-600 border border-red-200 bg-red-50 py-1.5 rounded-lg font-semibold hover:bg-red-100/60">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <span className="text-xs text-slate-500">
              Page {pagination.page} of {pagination.totalPages} , {pagination.total} results
            </span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={!pagination.hasPrev || loading} className="px-4 py-2 text-sm border border-slate-200 text-slate-600 rounded-xl disabled:opacity-40 hover:bg-slate-50 transition-all">Prev</button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(p => Math.abs(p - pagination.page) <= 2)
                .map(p => (
                  <button key={p} onClick={() => setPage(p)} className={`px-3.5 py-2 text-sm rounded-xl transition-all ${p === pagination.page ? 'bg-slate-950 text-white font-bold' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{p}</button>
                ))}
              <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={!pagination.hasNext || loading} className="px-4 py-2 text-sm border border-slate-200 text-slate-600 rounded-xl disabled:opacity-40 hover:bg-slate-50 transition-all">Next</button>
            </div>
          </div>
        )}
      </div>

      {deleteTarget && (
        <Modal
          title="Delete Post"
          message={`Are you sure you want to delete "${deleteTarget.title}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
