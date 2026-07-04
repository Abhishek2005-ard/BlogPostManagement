import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postApi } from '../../api/services';
import Modal from '../../components/Modal';
import useToastStore from '../../store/useToastStore';

const CAT_COLORS = {
  Technology: 'bg-slate-900 text-white border-slate-950',
  Lifestyle: 'bg-slate-100 text-slate-800 border-slate-200',
  Travel: 'bg-slate-100 text-slate-800 border-slate-200',
  Business: 'bg-slate-100 text-slate-800 border-slate-200',
  Health: 'bg-slate-100 text-slate-800 border-slate-200',
  Other: 'bg-slate-100 text-slate-800 border-slate-200'
};
const CAT_GRAD  = {
  Technology: 'from-slate-100 to-slate-200',
  Lifestyle: 'from-slate-100 to-slate-200',
  Travel: 'from-slate-100 to-slate-200',
  Business: 'from-slate-100 to-slate-200',
  Health: 'from-slate-100 to-slate-200',
  Other: 'from-slate-100 to-slate-200'
};

export default function PostView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const showToast = useToastStore(s => s.showToast);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await postApi.getById(id);
        setPost(data.data);
      } catch {
        showToast('Failed to load post details', 'error');
        navigate('/posts');
      }
      finally { setLoading(false); }
    })();
  }, [id, navigate, showToast]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await postApi.remove(id);
      showToast('Post deleted successfully!');
      navigate('/posts');
    } catch {
      showToast('Failed to delete post. Please try again.', 'error');
      setDeleting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 pt-24 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"/>
    </div>
  );
  if (!post) return null;

  const grad = CAT_GRAD[post.category] || CAT_GRAD.Other;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-16">
      <div className="relative h-72 sm:h-96 overflow-hidden border-b border-slate-200/80 bg-white">
        {post.coverImage ? (
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" onError={e => { e.target.style.display='none'; }} />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${grad} flex items-center justify-center`}>
            <span className="text-8xl opacity-15">Post</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/20 to-transparent"/>

        <div className="absolute top-0 inset-x-0 pt-24 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button onClick={() => navigate('/posts')} className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-950 transition-colors bg-white/80 border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm backdrop-blur-sm cursor-pointer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M15 19l-7-7 7-7"/></svg>
              All Posts
            </button>
            <div className="flex gap-2">
              <Link to={`/posts/${id}/edit`} className="flex items-center gap-1.5 text-sm font-semibold bg-white border border-slate-200 text-slate-700 px-3.5 py-1.5 rounded-lg hover:bg-slate-50 transition-all backdrop-blur-sm shadow-sm">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                Edit
              </Link>
              <button onClick={() => setShowDelete(true)} className="flex items-center gap-1.5 text-sm font-semibold bg-red-50 border border-red-200 text-red-600 px-3.5 py-1.5 rounded-lg hover:bg-red-100/60 transition-all backdrop-blur-sm shadow-sm cursor-pointer">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 px-4 sm:px-6 pb-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${CAT_COLORS[post.category] || CAT_COLORS.Other}`}>
                {post.category}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${post.status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                {post.status}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">{post.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-center gap-4 pb-6 mb-6 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-slate-950 flex items-center justify-center text-white font-bold text-sm">
                  {post.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">{post.author}</div>
                  <div className="text-xs text-slate-500">Author</div>
                </div>
              </div>
              <div className="h-8 w-px bg-slate-200 hidden sm:block"/>
              <div className="text-sm text-slate-600">
                <span className="text-slate-400 text-xs">Published</span><br/>
                {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              {post.updatedAt !== post.createdAt && (
                <>
                  <div className="h-8 w-px bg-slate-200 hidden sm:block"/>
                  <div className="text-sm text-slate-600">
                    <span className="text-slate-400 text-xs">Updated</span><br/>
                    {new Date(post.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </>
              )}
            </div>

            <div className="prose max-w-none">
              {post.content.split('\n').map((para, i) => para.trim() ? (
                <p key={i} className="text-slate-800 leading-[1.85] mb-4 text-[0.97rem]">{para}</p>
              ) : <br key={i} />)}
            </div>

            {post.tags?.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span key={tag} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-100 transition-all cursor-default shadow-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-5">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Post Details</h3>
              <dl className="space-y-3">
                {[
                  ['ID', <span className="text-xs font-mono text-slate-400 break-all">{post._id}</span>],
                  ['Status', <span className={`text-xs font-semibold ${post.status === 'published' ? 'text-emerald-600' : 'text-amber-600'}`}>{post.status}</span>],
                  ['Category', <span className="text-sm text-slate-800">{post.category}</span>],
                  ['Author', <span className="text-sm text-slate-800">{post.author}</span>],
                  ['Word count', <span className="text-sm text-slate-800">{post.content.split(/\s+/).filter(Boolean).length} words</span>],
                  ['Read time', <span className="text-sm text-slate-800">~{Math.ceil(post.content.split(/\s+/).length / 200)} min read</span>],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between items-start gap-3">
                    <dt className="text-xs text-slate-400 font-medium flex-shrink-0">{k}</dt>
                    <dd className="text-right">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Actions</h3>
              <Link to={`/posts/${id}/edit`} className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition-all text-sm shadow-sm">
                Edit Post
              </Link>
              <button onClick={() => setShowDelete(true)} className="flex items-center justify-center gap-2 bg-red-50 border border-red-200 text-red-600 font-semibold py-2.5 rounded-xl hover:bg-red-100/60 transition-all text-sm shadow-sm cursor-pointer">
                Delete Post
              </button>
              <Link to="/posts" className="flex items-center justify-center gap-2 border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 font-semibold py-2.5 rounded-xl hover:border-slate-300 hover:text-slate-900 transition-all text-sm shadow-sm">
                Back to List
              </Link>
              <Link to="/posts/new" className="flex items-center justify-center gap-2 bg-slate-950 text-white font-bold py-2.5 rounded-xl shadow-md hover:bg-slate-800 transition-all text-sm">
                New Post
              </Link>
            </div>
          </div>
        </div>
      </div>

      {showDelete && (
        <Modal
          title="Delete Post"
          message={`Are you sure you want to delete "${post.title}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
          loading={deleting}
        />
      )}
    </div>
  );
}
