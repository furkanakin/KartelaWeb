import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import ColorItemEditor from '../../components/admin/ColorItemEditor';
import './Palettes.css';

interface Category {
  id: string;
  name: string;
}

interface ColorOrPattern {
  type: 'color' | 'pattern';
  data: any;
}

interface WebhookConfig {
  url: string;
  mode: 'test' | 'live';
  enabled: boolean;
}

interface Palette {
  _id?: string;
  id: string;
  name: string;
  categoryId: string;
  description?: string;
  items: ColorOrPattern[];
  webhook?: WebhookConfig;
}

const Palettes: React.FC = () => {
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPalette, setEditingPalette] = useState<Palette | null>(null);
  const [formData, setFormData] = useState<Palette>({
    id: '',
    name: '',
    categoryId: '',
    description: '',
    items: [],
    webhook: {
      url: '',
      mode: 'test',
      enabled: false,
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [palettesRes, categoriesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/palettes'),
        axios.get('http://localhost:5000/api/categories'),
      ]);
      setPalettes(palettesRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingPalette) {
        await axios.put(`http://localhost:5000/api/palettes/${formData.id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/palettes', formData);
      }

      fetchData();
      resetForm();
    } catch (error: any) {
      alert(error.response?.data?.message || 'İşlem başarısız');
    }
  };

  const handleEdit = (palette: Palette) => {
    setEditingPalette(palette);
    setFormData(palette);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kartelayı silmek istediğinizden emin misiniz?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/palettes/${id}`);
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Silme işlemi başarısız');
    }
  };

  const handleTestWebhook = async (id: string) => {
    try {
      await axios.post(`http://localhost:5000/api/palettes/${id}/test-webhook`);
      alert('Webhook başarıyla test edildi!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Webhook test edilemedi');
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      categoryId: '',
      description: '',
      items: [],
      webhook: {
        url: '',
        mode: 'test',
        enabled: false,
      },
    });
    setEditingPalette(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading">Yükleniyor...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="palettes-page">
        <div className="page-header">
          <h1>Kartela Yönetimi</h1>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            + Yeni Kartela
          </button>
        </div>

        {showForm && (
          <div className="modal-overlay" onClick={resetForm}>
            <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
              <h2>{editingPalette ? 'Kartelayı Düzenle' : 'Yeni Kartela Ekle'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>ID *</label>
                    <input
                      type="text"
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      required
                      disabled={!!editingPalette}
                      placeholder="ornek: ic-modern"
                    />
                  </div>
                  <div className="form-group">
                    <label>Kategori *</label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      required
                    >
                      <option value="">Seçiniz</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>İsim *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Modern Koleksiyonu"
                  />
                </div>

                <div className="form-group">
                  <label>Açıklama</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    placeholder="Kartela açıklaması"
                  />
                </div>

                <div className="webhook-section">
                  <h3>Webhook Ayarları</h3>
                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.webhook?.enabled || false}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            webhook: { ...formData.webhook!, enabled: e.target.checked },
                          })
                        }
                      />
                      Webhook Aktif
                    </label>
                  </div>

                  {formData.webhook?.enabled && (
                    <>
                      <div className="form-group">
                        <label>Webhook URL</label>
                        <input
                          type="url"
                          value={formData.webhook.url}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              webhook: { ...formData.webhook!, url: e.target.value },
                            })
                          }
                          placeholder="https://example.com/webhook"
                        />
                      </div>
                      <div className="form-group">
                        <label>Mod</label>
                        <select
                          value={formData.webhook.mode}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              webhook: { ...formData.webhook!, mode: e.target.value as 'test' | 'live' },
                            })
                          }
                        >
                          <option value="test">Test</option>
                          <option value="live">Live</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>

                <ColorItemEditor
                  items={formData.items}
                  onChange={(items) => setFormData({ ...formData, items })}
                />

                <div className="form-actions">
                  <button type="button" onClick={resetForm} className="btn-secondary">
                    İptal
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingPalette ? 'Güncelle' : 'Oluştur'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="palettes-list">
          {palettes.map((palette) => (
            <div key={palette.id} className="palette-card">
              <div className="palette-header">
                <h3>{palette.name}</h3>
                <span className="palette-category">
                  {categories.find((c) => c.id === palette.categoryId)?.name || palette.categoryId}
                </span>
              </div>
              <p className="palette-id">ID: {palette.id}</p>
              {palette.description && <p className="palette-desc">{palette.description}</p>}
              <p className="palette-items-count">{palette.items.length} öğe</p>

              {palette.webhook?.enabled && (
                <div className="webhook-badge">
                  <span className={`badge ${palette.webhook.mode}`}>
                    Webhook: {palette.webhook.mode.toUpperCase()}
                  </span>
                </div>
              )}

              <div className="palette-actions">
                <button onClick={() => handleEdit(palette)} className="btn-edit">
                  Düzenle
                </button>
                {palette.webhook?.enabled && (
                  <button onClick={() => handleTestWebhook(palette.id)} className="btn-test">
                    Test
                  </button>
                )}
                <button onClick={() => handleDelete(palette.id)} className="btn-delete">
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>

        {palettes.length === 0 && (
          <div className="empty-state">
            <p>Henüz kartela eklenmemiş.</p>
            <button onClick={() => setShowForm(true)} className="btn-primary">
              İlk Kartelayı Ekle
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Palettes;
