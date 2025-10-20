import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import * as storage from '../../services/storage';
import './Brands.css';

interface Brand {
  _id?: string;
  id: string;
  name: string;
  description: string;
  logo: string;
  order: number;
}

const Brands: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Brand>({
    id: '',
    name: '',
    description: '',
    logo: '',
    order: 0,
  });

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = () => {
    const brandsData = storage.getBrands();
    setBrands(brandsData);
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      description: '',
      logo: '',
      order: 0,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (brand: Brand) => {
    setFormData(brand);
    setEditingId(brand.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bu markayı silmek istediğinizden emin misiniz?')) {
      storage.deleteBrand(id);
      fetchBrands();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        storage.updateBrand(editingId, formData);
      } else {
        storage.createBrand(formData);
      }
      fetchBrands();
      resetForm();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, logo: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <AdminLayout>
      <div className="brands-page">
        <div className="page-header">
          <h1>Markalar</h1>
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            + Yeni Marka
          </button>
        </div>

        <div className="brands-grid">
          {brands.map((brand) => (
            <div key={brand.id} className="brand-card">
              <div className="brand-logo-container">
                <img src={brand.logo} alt={brand.name} className="brand-logo" />
              </div>
              <div className="brand-info">
                <h3>{brand.name}</h3>
                <p>{brand.description}</p>
                <div className="brand-meta">
                  <span className="brand-id">ID: {brand.id}</span>
                  <span className="brand-order">Sıra: {brand.order}</span>
                </div>
              </div>
              <div className="brand-actions">
                <button className="btn-edit" onClick={() => handleEdit(brand)}>
                  ✏️ Düzenle
                </button>
                <button className="btn-delete" onClick={() => handleDelete(brand.id)}>
                  🗑️ Sil
                </button>
              </div>
            </div>
          ))}
        </div>

        {showForm && (
          <div className="modal-overlay" onClick={resetForm}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingId ? 'Marka Düzenle' : 'Yeni Marka'}</h2>
                <button className="modal-close" onClick={resetForm}>
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="brand-form">
                <div className="form-group">
                  <label>Marka ID *</label>
                  <input
                    type="text"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    required
                    disabled={!!editingId}
                    placeholder="dufa, marshall, vb."
                  />
                  <small>Küçük harf ve tire kullanın (örn: dufa, marshall)</small>
                </div>

                <div className="form-group">
                  <label>Marka Adı *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Düfa"
                  />
                </div>

                <div className="form-group">
                  <label>Açıklama</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Marka açıklaması"
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label>Logo *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                  />
                  {formData.logo && (
                    <div className="logo-preview">
                      <img src={formData.logo} alt="Logo önizleme" />
                    </div>
                  )}
                  <small>Önerilen boyut: 150x80 piksel</small>
                </div>

                <div className="form-group">
                  <label>Sıra</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    min="0"
                  />
                  <small>Gösterim sırası (küçükten büyüğe)</small>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={resetForm}>
                    İptal
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingId ? 'Güncelle' : 'Oluştur'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Brands;
