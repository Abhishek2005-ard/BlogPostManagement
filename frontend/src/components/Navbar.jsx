import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = [
    { to: '/', label: 'Landing Page' },
    { to: '/posts', label: 'All Posts' },
    { to: '/posts/new', label: 'New Post' },
  ];

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200/80 py-3' : 'py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2 text-xl font-black text-slate-950 mr-auto">
          BlogCraft
        </Link>
        <ul className="hidden md:flex items-center gap-1">
          {links.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={`text-sm font-bold px-4 py-2 rounded-xl transition-all ${
                  pathname === to
                    ? 'bg-slate-100 text-slate-950'
                    : label === 'New Post'
                    ? 'bg-slate-950 text-white hover:bg-slate-800 shadow-md shadow-slate-950/10 hover:-translate-y-0.5'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {user && (
          <div className="hidden md:flex items-center gap-3 ml-2 border-l border-slate-200/80 pl-4 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-slate-950 text-white flex items-center justify-center text-xs font-bold uppercase">
              {user.name ? user.name[0] : 'U'}
            </div>
            <span className="text-sm font-bold text-slate-800">{user.name}</span>
            <button
              onClick={logout}
              className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/80 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Log Out
            </button>
          </div>
        )}

        <button className="md:hidden text-slate-950" onClick={() => setOpen(!open)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" d={open ? 'M6 18L18 6M6 6l12 12' : 'M3 6h18M3 12h18M3 18h18'} />
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-white border-t border-slate-200 px-6 py-4 flex flex-col gap-2 shadow-lg">
          {links.map(({ to, label }) => (
            <Link key={to} to={to} className="text-slate-700 font-bold py-2.5 border-b border-slate-100 text-sm" onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
          {user && (
            <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-3 px-1 py-1.5">
                <div className="w-8 h-8 rounded-full bg-slate-950 text-white flex items-center justify-center text-xs font-bold uppercase">
                  {user.name ? user.name[0] : 'U'}
                </div>
                <span className="text-sm font-bold text-slate-800">{user.name}</span>
              </div>
              <button
                onClick={() => { logout(); setOpen(false); }}
                className="w-full text-center bg-red-50 text-red-600 hover:bg-red-100 font-bold py-2 rounded-xl text-sm transition-colors cursor-pointer"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
