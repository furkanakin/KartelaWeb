import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CategoryType } from '../types';
import { categories } from '../data/palettes';
import '../styles/AdminWebhooks.css';

interface WebhookConfig {
  categoryId: CategoryType;
  categoryName: string;
  categoryIcon: string;
  liveUrl: string;
  testUrl: string;
  liveEnabled: boolean;
  testEnabled: boolean;
  currentMode: 'live' | 'test';
}

function AdminWebhooks() {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>(
    categories.map(cat => ({
      categoryId: cat.id,
      categoryName: cat.name,
      categoryIcon: cat.icon,
      liveUrl: '',
      testUrl: '',
      liveEnabled: false,
      testEnabled: true,
      currentMode: 'test' as const
    }))
  );

  const handleUrlChange = (categoryId: CategoryType, mode: 'live' | 'test', url: string) => {
    setWebhooks(webhooks.map(wh =>
      wh.categoryId === categoryId
        ? { ...wh, [mode === 'live' ? 'liveUrl' : 'testUrl']: url }
        : wh
    ));
  };

  const handleModeToggle = (categoryId: CategoryType, mode: 'live' | 'test') => {
    setWebhooks(webhooks.map(wh =>
      wh.categoryId === categoryId
        ? { ...wh, currentMode: mode }
        : wh
    ));
  };

  const handleEnableToggle = (categoryId: CategoryType, mode: 'live' | 'test') => {
    setWebhooks(webhooks.map(wh =>
      wh.categoryId === categoryId
        ? { ...wh, [mode === 'live' ? 'liveEnabled' : 'testEnabled']: !wh[mode === 'live' ? 'liveEnabled' : 'testEnabled'] }
        : wh
    ));
  };

  const handleTestWebhook = async (categoryId: CategoryType, mode: 'live' | 'test') => {
    const webhook = webhooks.find(wh => wh.categoryId === categoryId);
    if (!webhook) return;

    const url = mode === 'live' ? webhook.liveUrl : webhook.testUrl;
    if (!url) {
      alert('Lütfen önce webhook URL\'i girin!');
      return;
    }

    try {
      alert(`${webhook.categoryName} - ${mode.toUpperCase()} webhook testi başlatılıyor...\nURL: ${url}\n\nNot: Bu bir demo uygulamasıdır.`);
    } catch (error) {
      alert('Webhook testi başarısız oldu!');
    }
  };

  const handleSaveAll = () => {
    alert('Tüm webhook ayarları kaydedildi!');
    console.log('Saved webhooks:', webhooks);
  };

  return (
    <div className="admin-webhooks">
      <div className="admin-header">
        <div className="header-top">
          <Link to="/admin" className="back-link">← Geri Dön</Link>
          <img src="/img/kayalar-kimya-logo-neww.svg" alt="Kayalar Kimya" className="admin-logo-small" />
        </div>
        <div className="header-content">
          <h1>Webhook Ayarları</h1>
          <button onClick={handleSaveAll} className="btn-primary">
            💾 Tümünü Kaydet
          </button>
        </div>
      </div>

      <div className="webhook-info-banner">
        <div className="info-icon">ℹ️</div>
        <div className="info-content">
          <h3>Webhook Nasıl Çalışır?</h3>
          <p>Her kategori için ayrı ayrı test ve live (canlı) webhook URL'leri tanımlayabilirsiniz. Aktif mod değiştirerek hangi ortamda çalışacağınızı seçebilirsiniz.</p>
        </div>
      </div>

      <div className="webhooks-grid">
        {webhooks.map(webhook => (
          <div key={webhook.categoryId} className="webhook-card">
            <div className="webhook-header">
              <div className="webhook-title">
                <span className="webhook-icon">{webhook.categoryIcon}</span>
                <h2>{webhook.categoryName}</h2>
              </div>
              <div className="mode-switch">
                <button
                  className={`mode-btn ${webhook.currentMode === 'test' ? 'active' : ''}`}
                  onClick={() => handleModeToggle(webhook.categoryId, 'test')}
                >
                  🧪 Test
                </button>
                <button
                  className={`mode-btn ${webhook.currentMode === 'live' ? 'active' : ''}`}
                  onClick={() => handleModeToggle(webhook.categoryId, 'live')}
                >
                  🔴 Live
                </button>
              </div>
            </div>

            <div className="webhook-configs">
              {/* Test Webhook */}
              <div className="webhook-config-section">
                <div className="config-header">
                  <h3>🧪 Test Webhook</h3>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={webhook.testEnabled}
                      onChange={() => handleEnableToggle(webhook.categoryId, 'test')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="url-input-group">
                  <input
                    type="url"
                    placeholder="https://test.example.com/webhook"
                    value={webhook.testUrl}
                    onChange={(e) => handleUrlChange(webhook.categoryId, 'test', e.target.value)}
                    className="webhook-input"
                    disabled={!webhook.testEnabled}
                  />
                  <button
                    onClick={() => handleTestWebhook(webhook.categoryId, 'test')}
                    className="btn-test"
                    disabled={!webhook.testEnabled || !webhook.testUrl}
                  >
                    Test Et
                  </button>
                </div>
                {webhook.currentMode === 'test' && webhook.testEnabled && (
                  <div className="active-badge">✓ Aktif Mod</div>
                )}
              </div>

              {/* Live Webhook */}
              <div className="webhook-config-section">
                <div className="config-header">
                  <h3>🔴 Live Webhook</h3>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={webhook.liveEnabled}
                      onChange={() => handleEnableToggle(webhook.categoryId, 'live')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="url-input-group">
                  <input
                    type="url"
                    placeholder="https://live.example.com/webhook"
                    value={webhook.liveUrl}
                    onChange={(e) => handleUrlChange(webhook.categoryId, 'live', e.target.value)}
                    className="webhook-input"
                    disabled={!webhook.liveEnabled}
                  />
                  <button
                    onClick={() => handleTestWebhook(webhook.categoryId, 'live')}
                    className="btn-test"
                    disabled={!webhook.liveEnabled || !webhook.liveUrl}
                  >
                    Test Et
                  </button>
                </div>
                {webhook.currentMode === 'live' && webhook.liveEnabled && (
                  <div className="active-badge live">✓ Aktif Mod</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminWebhooks;
