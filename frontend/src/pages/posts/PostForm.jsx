import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postApi } from '../../api/services';

const CATEGORIES = ['Technology', 'Lifestyle', 'Travel', 'Business', 'Health', 'Other'];

const rules = {
  title:      v => !v ? 'Title is required' : v.length < 3 ? 'Min 3 characters' : v.length > 200 ? 'Max 200 characters' : '',
  content:    v => !v ? 'Content is required' : v.length < 10 ? 'Min 10 characters' : '',
  author:     v => !v ? 'Author is required' : !/^[a-zA-Z\s]+$/.test(v) ? 'Letters and spaces only' : v.length < 2 ? 'Min 2 characters' : v.length > 100 ? 'Max 100 characters' : '',
  category:   v => !v ? 'Category is required' : '',
  status:     v => !v ? 'Status is required' : '',
  coverImage: v => { if (!v) return ''; try { new URL(v); return ''; } catch { return 'Must be a valid URL'; } },
  tags:       () => '',
};

const Field = ({ label, error, required, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-slate-700">
      {label}{required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-red-500 flex items-center gap-1">{error}</p>}
  </div>
);

const inputClass = (err) =>
  `w-full bg-white border ${err ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-slate-400'} text-slate-900 placeholder:text-slate-400 px-4 py-2.5 rounded-xl text-sm outline-none transition-all shadow-sm`;

import useToastStore from '../../store/useToastStore';

export default function PostForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const showToast = useToastStore(s => s.showToast);

  const [form, setForm] = useState({ title: '', content: '', author: '', category: '', tags: '', status: 'draft', coverImage: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const { data } = await postApi.getById(id);
        const p = data.data;
        setForm({ title: p.title, content: p.content, author: p.author, category: p.category, tags: (p.tags || []).join(', '), status: p.status, coverImage: p.coverImage || '' });
      } catch {
        showToast('Failed to load post details', 'error');
        navigate('/posts');
      }
      finally { setFetching(false); }
    })();
  }, [id, isEdit, navigate, showToast]);

  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (touched[field]) setErrors(e => ({ ...e, [field]: rules[field](value) }));
  };

  const blur = (field) => {
    setTouched(t => ({ ...t, [field]: true }));
    setErrors(e => ({ ...e, [field]: rules[field](form[field]) }));
  };

  const validate = () => {
    const errs = {};
    let valid = true;
    Object.keys(rules).forEach(f => { const e = rules[f](form[f]); if (e) { errs[f] = e; valid = false; } });
    setErrors(errs);
    setTouched(Object.fromEntries(Object.keys(rules).map(k => [k, true])));
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }
    setLoading(true);
    setSubmitError('');
    try {
      const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
      if (isEdit) {
        await postApi.update(id, payload);
        showToast('Post updated successfully!');
      } else {
        await postApi.create(payload);
        showToast('Post created successfully!');
      }
      navigate('/posts');
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
      setSubmitError(msg);
      showToast(msg, 'error');
    } finally { setLoading(false); }
  };

  if (fetching) return (
    <div className="min-h-screen bg-slate-50 pt-24 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"/>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate('/posts')} className="p-2 rounded-xl border border-slate-200 text-slate-500 bg-white hover:text-slate-900 hover:border-slate-400 transition-all shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{isEdit ? 'Edit Post' : 'New Post'}</h1>
            <p className="text-slate-500 text-sm">{isEdit ? 'Update your blog post' : 'Create a new blog post'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div className="lg:col-span-2 flex flex-col gap-5">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 flex flex-col gap-5 shadow-sm">
                <Field label="Title" error={errors.title} required>
                  <input type="text" value={form.title} onChange={e => set('title', e.target.value)} onBlur={() => blur('title')}
                    placeholder="Enter a compelling post title..." className={inputClass(errors.title)} maxLength={200} />
                  <div className="text-xs text-slate-400 text-right">{form.title.length}/200</div>
                </Field>

                <Field label="Content" error={errors.content} required>
                  <textarea value={form.content} onChange={e => set('content', e.target.value)} onBlur={() => blur('content')}
                    placeholder="Write your blog post content here..." rows={12}
                    className={`${inputClass(errors.content)} resize-y min-h-[200px]`} />
                  <div className="text-xs text-slate-400 text-right">{form.content.length} characters</div>
                </Field>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Settings</h3>

                <Field label="Status" error={errors.status} required>
                  <select value={form.status} onChange={e => set('status', e.target.value)} onBlur={() => blur('status')} className={`${inputClass(errors.status)} cursor-pointer`}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </Field>

                <Field label="Author" error={errors.author} required>
                  <input type="text" value={form.author} onChange={e => set('author', e.target.value)} onBlur={() => blur('author')}
                    placeholder="Author name" className={inputClass(errors.author)} />
                </Field>

                <Field label="Category" error={errors.category} required>
                  <select value={form.category} onChange={e => set('category', e.target.value)} onBlur={() => blur('category')} className={`${inputClass(errors.category)} cursor-pointer`}>
                    <option value="">Select category...</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Media & Tags</h3>

                <Field label="Cover Image URL" error={errors.coverImage}>
                  <input type="url" value={form.coverImage} onChange={e => set('coverImage', e.target.value)} onBlur={() => blur('coverImage')}
                    placeholder="https://example.com/image.jpg" className={inputClass(errors.coverImage)} />
                  {form.coverImage && !errors.coverImage && (
                    <img src={form.coverImage} alt="preview" className="w-full h-28 object-cover rounded-xl mt-1 border border-slate-200 shadow-sm" onError={e => e.target.style.display='none'} />
                  )}
                </Field>

                <Field label="Tags" error={errors.tags}>
                  <input type="text" value={form.tags} onChange={e => set('tags', e.target.value)}
                    placeholder="react, nodejs, tutorial (comma-separated)" className={inputClass(errors.tags)} />
                  <p className="text-xs text-slate-400">Separate tags with commas</p>
                </Field>
              </div>

              <div className="flex flex-col gap-3">
                {submitError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                    {submitError}
                  </div>
                )}
                <button type="submit" disabled={loading}
                  className="w-full bg-slate-950 text-white font-bold py-3 rounded-xl shadow-md shadow-slate-950/10 hover:bg-slate-800 transition-all disabled:opacity-60 disabled:translate-y-0 flex items-center justify-center gap-2 cursor-pointer">
                  {loading ? (
                    <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>Saving...</>
                  ) : 'Save Post'}
                </button>
                <button type="button" onClick={() => navigate('/posts')} className="w-full border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 font-semibold py-2.5 rounded-xl hover:border-slate-300 hover:text-slate-900 transition-all text-sm shadow-sm cursor-pointer">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
