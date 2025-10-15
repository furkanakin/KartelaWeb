import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/AdminDashboard.css';

interface DashboardStats {
  totalColors: number;
  totalCategories: number;
  activeWebhooks: number;
}

function AdminDashboard() {
  const [stats] = useState<DashboardStats>({
    totalColors: 20,
    totalCategories: 3,
    activeWebhooks: 6
  });

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="logo-section">
          <img src="/img/kayalar-kimya-logo-neww.svg" alt="Kayalar Kimya" className="admin-logo" />
          <h1>Yönetim Paneli</h1>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">🎨</div>
          <div className="stat-info">
            <h3>{stats.totalColors}</h3>
            <p>Toplam Renk</p>
          </div>
          <Link to="/admin/colors" className="stat-link">Yönet →</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📁</div>
          <div className="stat-info">
            <h3>{stats.totalCategories}</h3>
            <p>Kategori</p>
          </div>
          <Link to="/admin/categories" className="stat-link">Yönet →</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔗</div>
          <div className="stat-info">
            <h3>{stats.activeWebhooks}</h3>
            <p>Aktif Webhook</p>
          </div>
          <Link to="/admin/webhooks" className="stat-link">Yönet →</Link>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Hızlı İşlemler</h2>
        <div className="action-grid">
          <Link to="/admin/colors/new" className="action-card">
            <span className="action-icon">➕</span>
            <span className="action-text">Yeni Renk Ekle</span>
          </Link>
          <Link to="/admin/categories/new" className="action-card">
            <span className="action-icon">📂</span>
            <span className="action-text">Yeni Kategori</span>
          </Link>
          <Link to="/admin/webhooks" className="action-card">
            <span className="action-icon">⚙️</span>
            <span className="action-text">Webhook Ayarları</span>
          </Link>
          <Link to="/" className="action-card">
            <span className="action-icon">👁️</span>
            <span className="action-text">Siteyi Görüntüle</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
