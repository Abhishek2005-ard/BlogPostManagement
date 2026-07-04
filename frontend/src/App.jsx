import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import PostsTable from './pages/posts/PostsTable';
import PostForm from './pages/posts/PostForm';
import PostView from './pages/posts/PostView';
import useAuthStore from './store/authStore';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const location = useLocation();
  const showNavbar = location.pathname.startsWith('/posts');

  return (
    <>
      <Toast />
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/posts" element={<ProtectedRoute><PostsTable /></ProtectedRoute>} />
        <Route path="/posts/new" element={<ProtectedRoute><PostForm /></ProtectedRoute>} />
        <Route path="/posts/:id" element={<ProtectedRoute><PostView /></ProtectedRoute>} />
        <Route path="/posts/:id/edit" element={<ProtectedRoute><PostForm /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
