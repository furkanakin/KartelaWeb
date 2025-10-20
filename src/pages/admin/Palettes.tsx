import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import ColorItemEditor from '../../components/admin/ColorItemEditor';
import * as storage from '../../services/storage';
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
  testUrl: string;
  liveUrl: string;
  mode: 'test' | 'live';
  enabled: boolean;
}

interface Palette {
  _id?: string;
  id: string;
  name: string;
  categoryId: string;
  brandId?: string;
  description?: string;
  items: ColorOrPattern[];
  webhook?: WebhookConfig;
  photoUploadEnabled?: boolean;
  productName?: string;
  productImage?: string;
}

const Palettes: React.FC = () => {
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPalette, setEditingPalette] = useState<Palette | null>(null);
  const [formData, setFormData] = useState<Palette>({
    id: '',
    name: '',
    categoryId: '',
    brandId: '',
    description: '',
    items: [],
    webhook: {
      testUrl: '',
      liveUrl: '',
      mode: 'test',
      enabled: false,
    },
    photoUploadEnabled: true,
    productName: '',
    productImage: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // localStorage'dan verileri al
      const palettesData = storage.getPalettes();
      const categoriesData = storage.getCategories();
      const brandsData = storage.getBrands();

      setPalettes(palettesData);
      setCategories(categoriesData);
      setBrands(brandsData);
    } catch (error) {
      console.error('Veriler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingPalette) {
        storage.updatePalette(formData.id, formData);
      } else {
        storage.createPalette(formData);
      }

      fetchData();
      resetForm();
    } catch (error: any) {
      alert(error.message || 'İşlem başarısız');
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
      storage.deletePalette(id);
      fetchData();
    } catch (error: any) {
      alert(error.message || 'Silme işlemi başarısız');
    }
  };

  const handleTestWebhook = async (id: string) => {
    alert('Webhook test özelliği yakında eklenecek.');
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      categoryId: '',
      brandId: '',
      description: '',
      items: [],
      webhook: {
        testUrl: '',
        liveUrl: '',
        mode: 'test',
        enabled: false,
      },
      photoUploadEnabled: true,
      productName: '',
      productImage: '',
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

                <div className="form-row">
                  <div className="form-group">
                    <label>Marka</label>
                    <select
                      value={formData.brandId || ''}
                      onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                    >
                      <option value="">Seçiniz (Opsiyonel)</option>
                      {brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>
                          {brand.name}
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
                  <div className="webhook-header">
                    <h3>Webhook Ayarları</h3>
                    <label className="switch">
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
                      <span className="slider"></span>
                    </label>
                  </div>

                  {formData.webhook?.enabled && (
                    <>
                      <div className="form-group">
                        <label>Test Webhook URL</label>
                        <input
                          type="url"
                          value={formData.webhook.testUrl}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              webhook: { ...formData.webhook!, testUrl: e.target.value },
                            })
                          }
                          placeholder="https://test.example.com/webhook"
                        />
                      </div>
                      <div className="form-group">
                        <label>Live Webhook URL</label>
                        <input
                          type="url"
                          value={formData.webhook.liveUrl}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              webhook: { ...formData.webhook!, liveUrl: e.target.value },
                            })
                          }
                          placeholder="https://live.example.com/webhook"
                        />
                      </div>
                      <div className="form-group">
                        <label>Aktif Mod</label>
                        <div className="mode-switch">
                          <button
                            type="button"
                            className={`mode-btn ${formData.webhook.mode === 'test' ? 'active' : ''}`}
                            onClick={() =>
                              setFormData({
                                ...formData,
                                webhook: { ...formData.webhook!, mode: 'test' },
                              })
                            }
                          >
                            🧪 Test
                          </button>
                          <button
                            type="button"
                            className={`mode-btn ${formData.webhook.mode === 'live' ? 'active' : ''}`}
                            onClick={() =>
                              setFormData({
                                ...formData,
                                webhook: { ...formData.webhook!, mode: 'live' },
                              })
                            }
                          >
                            🚀 Live
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="webhook-section">
                  <div className="webhook-header">
                    <h3>Fotoğraf Yükleme</h3>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={formData.photoUploadEnabled !== false}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            photoUploadEnabled: e.target.checked,
                          })
                        }
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <p className="hint-text">
                    Bu kartelanın detay sayfasında fotoğraf yükleme alanı gösterilsin mi?
                  </p>
                </div>

                <div className="webhook-section">
                  <h3>Ürün Bilgileri</h3>
                  <div className="form-group">
                    <label>Ürün Adı</label>
                    <input
                      type="text"
                      value={formData.productName || ''}
                      onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                      placeholder="Düfa Zeolit İpek Mat İç Cephe Duvar Boyası"
                    />
                  </div>
                  <div className="form-group">
                    <label>Ürün Görseli</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData({ ...formData, productImage: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                    {formData.productImage && (
                      <img src={formData.productImage} alt="Ürün" style={{ maxWidth: '200px', marginTop: '10px', borderRadius: '8px', display: 'block' }} />
                    )}
                  </div>
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
