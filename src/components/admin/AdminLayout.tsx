import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './AdminLayout.css';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <img src="/img/kayalar-kimya-logo-neww.svg" alt="Kayalar Kimya" className="sidebar-logo" />
          <h2>Admin Panel</h2>
        </div>

        <nav className="sidebar-nav">
          <Link to="/admin/dashboard" className={`nav-item ${isActive('/admin/dashboard')}`}>
            <span className="nav-icon">📊</span>
            <span>Ana Sayfa</span>
          </Link>
          <Link to="/admin/categories" className={`nav-item ${isActive('/admin/categories')}`}>
            <span className="nav-icon">📁</span>
            <span>Kategoriler</span>
          </Link>
          <Link to="/admin/palettes" className={`nav-item ${isActive('/admin/palettes')}`}>
            <span className="nav-icon">🎨</span>
            <span>Kartelalar</span>
          </Link>
          <Link to="/admin/colors" className={`nav-item ${isActive('/admin/colors')}`}>
            <span className="nav-icon">🌈</span>
            <span>Renkler & Görseller</span>
          </Link>
          <Link to="/admin/webhooks" className={`nav-item ${isActive('/admin/webhooks')}`}>
            <span className="nav-icon">🔗</span>
            <span>Webhooks</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <span className="user-icon">👤</span>
            <span className="username">{user?.username}</span>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            Çıkış Yap
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div className="header-actions">
            <Link to="/" className="btn-view-site" target="_blank">
              🌐 Siteyi Görüntüle
            </Link>
          </div>
        </header>

        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
