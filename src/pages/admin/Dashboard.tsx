import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from '../../components/admin/AdminLayout';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <AdminLayout>
      <div className="dashboard">
        <h1>Hoş Geldiniz, {user?.username}!</h1>
        <p className="dashboard-subtitle">Kartela Yönetim Paneli</p>

        <div className="dashboard-cards">
          <Link to="/admin/categories" className="dashboard-card">
            <div className="card-icon">📁</div>
            <h3>Kategoriler</h3>
            <p>Kategorileri görüntüle ve yönet</p>
          </Link>

          <Link to="/admin/palettes" className="dashboard-card">
            <div className="card-icon">🎨</div>
            <h3>Kartelalar</h3>
            <p>Renk kartelalarını yönet</p>
          </Link>

          <Link to="/admin/colors" className="dashboard-card">
            <div className="card-icon">🌈</div>
            <h3>Renkler & Görseller</h3>
            <p>Renk ve görsel ekle/düzenle</p>
          </Link>

          <Link to="/admin/webhooks" className="dashboard-card">
            <div className="card-icon">🔗</div>
            <h3>Webhook Yönetimi</h3>
            <p>Webhook ayarlarını yapılandır</p>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
