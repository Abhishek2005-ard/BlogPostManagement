import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const useInView = () => {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.1 });
    o.observe(el); return () => o.disconnect();
  }, []);
  return [ref, v];
};

const FEATURES = [
  { icon: '', color: 'bg-slate-100 border-slate-200/60 text-slate-800', title: 'Rich Text Editor', desc: 'WYSIWYG editor with Markdown, code highlighting, embeds and media uploads.' },
  { icon: '', color: 'bg-slate-100 border-slate-200/60 text-slate-800', title: 'Categories & Tags', desc: 'Organise posts with custom categories, tags, and built-in SEO slugs.' },
  { icon: '', color: 'bg-slate-100 border-slate-200/60 text-slate-800', title: 'Multi-Author', desc: 'Granular roles — Admin, Editor, Author — for your whole team.' },
  { icon: '', color: 'bg-slate-100 border-slate-200/60 text-slate-800', title: 'Analytics', desc: 'Track views, read time, engagement and shares in real time.' },
  { icon: '', color: 'bg-slate-100 border-slate-200/60 text-slate-800', title: 'Full-text Search', desc: 'Search across all posts, drafts and comments instantly.' },
  { icon: '', color: 'bg-slate-100 border-slate-200/60 text-slate-800', title: 'Secure & Private', desc: 'JWT auth, RBAC, and rate limiting at every layer.' },
];

const STEPS = [
  { n: '01', t: 'Create Account', d: 'Sign up in seconds — no credit card required.' },
  { n: '02', t: 'Write Your Post', d: 'Craft content with the rich editor. Add images and tags.' },
  { n: '03', t: 'Publish & Share', d: 'Hit publish and share with built-in social links.' },
  { n: '04', t: 'Track Growth', d: 'Monitor traffic from your analytics dashboard.' },
];

const TESTIMONIALS = [
  { name: 'Aisha Malik', role: 'Tech Blogger', av: 'AM', bg: 'bg-indigo-500', text: 'The cleanest blogging dashboard I\'ve used. Publishing takes seconds and the editor is buttery smooth.' },
  { name: 'James Carter', role: 'Content Lead @ DevHub', av: 'JC', bg: 'bg-pink-500', text: 'Multi-author support sold us. Managing 6 writers with different roles is effortless.' },
  { name: 'Priya Nair', role: 'Freelance Writer', av: 'PN', bg: 'bg-emerald-500', text: 'Search alone saves me 30 minutes a day. Absolutely love this platform.' },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const { isAuthenticated, logout } = useAuthStore();

  useEffect(() => { const f = () => setSolid(window.scrollY > 24); window.addEventListener('scroll', f); return () => window.removeEventListener('scroll', f); }, []);
  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${solid ? 'nav-solid py-3' : 'py-5'}`}>
      <div className="max-w-6xl mx-auto px-6 flex items-center gap-6">
        <a href="#" className="flex items-center gap-2 text-xl font-black text-slate-900 mr-auto">
          BlogCraft
        </a>
        <ul className="hidden md:flex gap-1">
          {['Features','How it Works','Blog'].map(l => (
            <li key={l}><a href={`#${l.toLowerCase().replace(/ /g,'-')}`} className="text-slate-600 hover:text-slate-900 text-sm font-medium px-3 py-2 rounded-lg hover:bg-slate-100 transition-all">{l}</a></li>
          ))}
        </ul>
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link to="/posts" className="text-slate-600 hover:text-slate-900 text-sm font-semibold px-4 py-2 transition-colors">Dashboard</Link>
              <button onClick={logout} className="bg-slate-950 text-white text-sm font-semibold px-5 py-2 rounded-lg shadow-md shadow-slate-950/10 hover:bg-slate-800 transition-all cursor-pointer">Log Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-600 hover:text-slate-900 text-sm font-semibold px-4 py-2 transition-colors">Log in</Link>
              <Link to="/register" className="bg-slate-950 text-white text-sm font-semibold px-5 py-2 rounded-lg shadow-md shadow-slate-950/10 hover:bg-slate-800 transition-all">Start Free</Link>
            </>
          )}
        </div>
        <button className="md:hidden text-slate-800" onClick={() => setOpen(!open)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" d={open ? 'M6 18L18 6M6 6l12 12' : 'M3 6h18M3 12h18M3 18h18'}/></svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 px-6 py-4 flex flex-col gap-3">
          {['Features','How it Works','Blog'].map(l => <a key={l} href="#" className="text-slate-700 font-medium py-2 border-b border-slate-100" onClick={() => setOpen(false)}>{l}</a>)}
          {isAuthenticated ? (
            <>
              <Link to="/posts" className="text-slate-700 font-medium py-2 border-b border-slate-100" onClick={() => setOpen(false)}>Dashboard</Link>
              <button onClick={() => { logout(); setOpen(false); }} className="bg-slate-950 text-white font-semibold px-5 py-2.5 rounded-lg text-center mt-1 cursor-pointer">Log Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-700 font-medium py-2 border-b border-slate-100" onClick={() => setOpen(false)}>Log in</Link>
              <Link to="/register" className="bg-slate-950 text-white font-semibold px-5 py-2.5 rounded-lg text-center mt-1" onClick={() => setOpen(false)}>Start Free</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

function Hero() {
  const [ref, v] = useInView();
  const isAuth = useAuthStore.getState().isAuthenticated;

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col items-center justify-center gap-14 pt-28 pb-16 px-6 overflow-hidden bg-slate-50">
      <div className="absolute inset-0 pointer-events-none">
        <div className="blob absolute w-[600px] h-[600px] rounded-full bg-slate-200/50 -top-32 -left-32 blur-[100px]"/>
        <div className="blob absolute w-[500px] h-[500px] rounded-full bg-slate-200/40 -bottom-20 -right-20 blur-[100px]" style={{animationDelay:'2.5s'}}/>
        <div className="dot-grid absolute inset-0"/>
      </div>

      <div className={`relative z-10 text-center flex flex-col items-center gap-6 max-w-3xl ${v ? 'animate-fade-up' : 'opacity-0'}`}>
        <div className="flex items-center gap-3 justify-center flex-wrap">
          <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"/>
            CRUD Posts
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"/>
            Real-time Search
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500"/>
            CSV Export
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-900"/>
            JWT Auth
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.06] tracking-tight">
          Your blog.<br/><span className="grad-text">Fully in control.</span>
        </h1>

        <p className="text-lg text-slate-500 max-w-xl leading-relaxed">
          A full-stack MERN blog management system — write, edit, search, filter, and export your posts, all backed by a secure REST API with JWT authentication.
        </p>

        <div className="flex flex-wrap gap-3 justify-center mt-1">
          {isAuth ? (
            <Link
              to="/posts"
              className="flex items-center gap-2 bg-slate-950 text-white font-bold px-8 py-3.5 rounded-xl shadow-md shadow-slate-950/10 hover:bg-slate-800 transition-all text-base"
            >
              Open Dashboard
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="flex items-center gap-2 bg-slate-950 text-white font-bold px-8 py-3.5 rounded-xl shadow-md shadow-slate-950/10 hover:bg-slate-800 transition-all text-base"
              >
                Create Account
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
              </Link>
              <Link
                to="/login"
                className="border border-slate-200 text-slate-700 bg-white font-semibold px-8 py-3.5 rounded-xl hover:border-slate-400 hover:text-slate-900 transition-all text-base shadow-sm"
              >
                Sign In
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-6 mt-1 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            MongoDB + Mongoose
          </span>
          <span className="w-px h-4 bg-slate-200"/>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            React + Tailwind CSS
          </span>
          <span className="w-px h-4 bg-slate-200"/>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Express REST API
          </span>
        </div>
      </div>

      <div className={`relative z-10 w-full max-w-2xl animate-float ${v ? 'animate-fade-up-delay' : 'opacity-0'}`}>
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/50">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50/50">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]"/><span className="w-3 h-3 rounded-full bg-[#ffbd2e]"/><span className="w-3 h-3 rounded-full bg-[#28c840]"/>
            <span className="text-xs text-slate-400 ml-2">BlogCraft Editor</span>
          </div>
          <div className="flex gap-1.5 flex-wrap px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
            {['B','I','U','H1','H2','Link'].map(t => <button key={t} className="bg-white border border-slate-200 text-slate-700 text-xs font-bold px-2 py-1 rounded hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm">{t}</button>)}
          </div>
          <div className="p-5 flex flex-col gap-3 bg-white">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Technology, 5 min read</span>
            <div className="text-base font-extrabold text-slate-900">Getting Started with React Server Components</div>
            <div className="flex flex-col gap-2">
              {[90,75,85,60,80,55].map((w,i) => <div key={i} className="mock-line h-2.5 bg-slate-100 rounded-full" style={{width:`${w}%`,animationDelay:`${i*0.08}s`}}/>)}
            </div>
            <div className="h-20 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 text-sm">Featured Image</div>
          </div>
          <div className="flex items-center gap-3 px-5 py-3 border-t border-slate-100 bg-slate-50/50">
            <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200/50">Draft</span>
            <span className="text-xs text-slate-400 ml-auto">1,243 words</span>
            <button className="bg-slate-950 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-all">Publish</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const [ref, v] = useInView();
  const stats = [['25K+','Active Bloggers'],['1.2M','Posts Published'],['99.9%','Uptime SLA'],['4.8','Average Rating']];
  return (
    <section ref={ref} className="border-y border-slate-200 bg-white py-12">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map(([val, label], i) => (
          <div key={i} className={v ? 'animate-fade-up' : 'opacity-0'} style={{animationDelay:`${i*0.1}s`}}>
            <div className="text-4xl font-black grad-text mb-1">{val}</div>
            <div className="text-slate-500 text-sm font-medium">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const [ref, v] = useInView();
  return (
    <section id="features" ref={ref} className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className={`text-center mb-14 flex flex-col items-center gap-3 ${v ? 'animate-fade-up' : 'opacity-0'}`}>
          <span className="bg-slate-200/80 border border-slate-300/80 text-slate-800 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">Features</span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Everything you need to blog like a pro</h2>
          <p className="text-slate-500 max-w-xl leading-relaxed">From writing to publishing to analytics - BlogCraft has the tools your content deserves.</p>
        </div>
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 ${v ? 'animate-fade-up' : 'opacity-0'}`}>
          {FEATURES.map((f, i) => (
            <div key={i} className="bg-white border border-slate-200/80 rounded-2xl p-7 hover:-translate-y-1.5 hover:border-slate-400 hover:bg-slate-50 transition-all duration-300 group shadow-sm" style={{animationDelay:`${i*0.08}s`}}>
              <h3 className="text-slate-900 font-bold text-base mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const [ref, v] = useInView();
  return (
    <section id="how-it-works" ref={ref} className="py-24 bg-white border-y border-slate-200/80">
      <div className="max-w-6xl mx-auto px-6">
        <div className={`text-center mb-14 flex flex-col items-center gap-3 ${v ? 'animate-fade-up' : 'opacity-0'}`}>
          <span className="bg-slate-200/80 border border-slate-300/80 text-slate-800 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">How It Works</span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Up and running in minutes</h2>
          <p className="text-slate-500 max-w-xl leading-relaxed">Four simple steps from sign-up to your first published post.</p>
        </div>
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 ${v ? 'animate-fade-up' : 'opacity-0'}`}>
          {STEPS.map((s, i) => (
            <div key={i} className="flex flex-col gap-3" style={{animationDelay:`${i*0.1}s`}}>
              <div className="text-5xl font-black grad-text leading-none">{s.n}</div>
              <h3 className="text-slate-900 font-bold">{s.t}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [ref, v] = useInView();
  return (
    <section ref={ref} className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className={`text-center mb-14 flex flex-col items-center gap-3 ${v ? 'animate-fade-up' : 'opacity-0'}`}>
          <span className="bg-slate-200/80 border border-slate-300/80 text-slate-800 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">Testimonials</span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Writers love BlogCraft</h2>
          <p className="text-slate-500 max-w-xl leading-relaxed">Thousands of bloggers trust BlogCraft every day.</p>
        </div>
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-5 ${v ? 'animate-fade-up' : 'opacity-0'}`}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="bg-white border border-slate-200/80 rounded-2xl p-7 hover:-translate-y-1 hover:border-slate-400 transition-all duration-300 shadow-sm" style={{animationDelay:`${i*0.12}s`}}>
              <p className="text-slate-600 text-sm leading-[1.8] italic mb-5">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${t.bg} flex items-center justify-center text-white text-xs font-bold`}>{t.av}</div>
                <div><div className="text-slate-900 text-sm font-semibold">{t.name}</div><div className="text-slate-500 text-xs">{t.role}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTABanner() {
  const [ref, v] = useInView();
  const isAuth = useAuthStore.getState().isAuthenticated;
  return (
    <section ref={ref} className="relative py-28 px-6 overflow-hidden bg-slate-50 border-t border-slate-200/80">
      <div className="absolute inset-0 pointer-events-none">
        <div className="blob absolute w-[500px] h-[500px] rounded-full bg-slate-200/50 -top-24 -left-24 blur-[90px]"/>
        <div className="blob absolute w-[400px] h-[400px] rounded-full bg-slate-200/40 -bottom-16 -right-16 blur-[90px]" style={{animationDelay:'2s'}}/>
      </div>
      <div className={`relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center gap-6 ${v ? 'animate-fade-up' : 'opacity-0'}`}>
        <div className="flex items-center gap-2 justify-center">
          <span className="w-8 h-px bg-slate-300"/>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ready to begin?</span>
          <span className="w-8 h-px bg-slate-300"/>
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          Everything you need,<br/><span className="grad-text">nothing you don't.</span>
        </h2>
        <p className="text-slate-500 leading-relaxed max-w-lg">
          Register an account, create your first post, search and filter your content, and export it all as CSV — a complete blog workflow in one place.
        </p>
        <div className="flex flex-wrap gap-3 justify-center mt-1">
          {isAuth ? (
            <>
              <Link
                to="/posts"
                className="flex items-center gap-2 bg-slate-950 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-slate-800 transition-all text-base shadow-md shadow-slate-950/10"
              >
                Go to Dashboard
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
              </Link>
              <Link
                to="/posts/new"
                className="border border-slate-200 text-slate-700 bg-white font-semibold px-8 py-3.5 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all text-base shadow-sm"
              >
                Write a New Post
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="flex items-center gap-2 bg-slate-950 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-slate-800 transition-all text-base shadow-md shadow-slate-950/10"
              >
                Get Started
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
              </Link>
              <Link
                to="/login"
                className="border border-slate-200 text-slate-700 bg-white font-semibold px-8 py-3.5 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all text-base shadow-sm"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
        <p className="text-xs text-slate-400 mt-1">Built with MongoDB, Express, React, and Node.js</p>
      </div>
    </section>
  );
}

function Footer() {
  const cols = {
    Product: ['Features','Changelog','Roadmap','Status'],
    Company: ['About','Blog','Careers','Press','Contact'],
    Resources: ['Documentation','API Docs','Tutorials','Community','Support'],
    Legal: ['Privacy Policy','Terms of Service','Cookies'],
  };
  return (
    <footer className="border-t border-slate-200/80 pt-16 pb-8 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="flex items-center gap-2 text-xl font-black text-slate-900 mb-3">BlogCraft</a>
            <p className="text-slate-500 text-sm leading-relaxed mb-5 max-w-[200px]">The all-in-one blog management platform for modern writers.</p>
            <div className="flex gap-2">
              {['X','in','Play','Home'].map((s,i) => <a key={i} href="#" className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 text-xs hover:bg-slate-100 hover:text-slate-900 transition-all">{s}</a>)}
            </div>
          </div>
          {Object.entries(cols).map(([g, links]) => (
            <div key={g}>
              <div className="text-slate-900 text-xs font-bold uppercase tracking-widest mb-4">{g}</div>
              <ul className="flex flex-col gap-2.5">
                {links.map(l => <li key={l}><a href="#" className="text-slate-500 text-sm hover:text-slate-900 transition-colors">{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row justify-between gap-2 text-xs text-slate-400">
          <span>© 2025 BlogCraft, Inc. All rights reserved.</span>
          <span>Made for writers everywhere</span>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTABanner />
      <Footer />
    </div>
  );
}
