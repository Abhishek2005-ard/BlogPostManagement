import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useToastStore from '../store/useToastStore';

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isRegister = location.pathname === '/register';

  const { login, register, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  const { showToast } = useToastStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/posts');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    clearError();
    setFormErrors({});
    setFormData({ name: '', email: '', password: '' });
  }, [isRegister, clearError]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: '',
      });
    }
  };

  const validate = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (isRegister && !formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (isRegister && formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (isRegister) {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        showToast('Registration successful! Welcome to BlogCraft.', 'success');
      } else {
        await login({
          email: formData.email,
          password: formData.password,
        });
        showToast('Welcome back to BlogCraft!', 'success');
      }
      navigate('/posts', { replace: true });
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || (isRegister ? 'Registration failed' : 'Login failed');
      showToast(errMsg, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative dot-grid">
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200/80 px-4 py-2 rounded-xl shadow-sm transition-all hover:-translate-x-0.5"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </Link>

      <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-2xl shadow-xl p-8 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-2xl font-black text-slate-950 mb-2">
            BlogCraft
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {isRegister ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {isRegister ? 'Start publishing and managing posts today' : 'Enter your details to access your dashboard'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className={`w-full bg-slate-50/50 border ${
                  formErrors.name ? 'border-red-500' : 'border-slate-200 hover:border-slate-300'
                } rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-slate-950 focus:bg-white transition-all`}
              />
              {formErrors.name && (
                <p className="text-xs text-red-500 mt-1 font-semibold">{formErrors.name}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              className={`w-full bg-slate-50/50 border ${
                formErrors.email ? 'border-red-500' : 'border-slate-200 hover:border-slate-300'
              } rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-slate-950 focus:bg-white transition-all`}
            />
            {formErrors.email && (
              <p className="text-xs text-red-500 mt-1 font-semibold">{formErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`w-full bg-slate-50/50 border ${
                formErrors.password ? 'border-red-500' : 'border-slate-200 hover:border-slate-300'
              } rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-slate-950 focus:bg-white transition-all`}
            />
            {formErrors.password && (
              <p className="text-xs text-red-500 mt-1 font-semibold">{formErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-950 text-white font-bold py-3.5 rounded-xl mt-2 hover:bg-slate-800 transition-all shadow-md shadow-slate-950/10 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading && (
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {isRegister ? 'Create Account' : 'Log In'}
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-slate-100 text-sm">
          {isRegister ? (
            <p className="text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-slate-950 hover:underline">
                Log In
              </Link>
            </p>
          ) : (
            <p className="text-slate-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-slate-950 hover:underline">
                Sign Up
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
