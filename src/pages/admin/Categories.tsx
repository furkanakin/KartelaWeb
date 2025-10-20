import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import * as storage from '../../services/storage';
import './Categories.css';

interface Category {
  _id?: string;
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<Category>({
    id: '',
    name: '',
    description: '',
    icon: '📁',
    order: 0,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // localStorage'dan verileri al
      const data = storage.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingCategory) {
        storage.updateCategory(formData.id, formData);
      } else {
        storage.createCategory(formData);
      }

      fetchCategories();
      resetForm();
    } catch (error: any) {
      alert(error.message || 'İşlem başarısız');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData(category);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) return;

    try {
      storage.deleteCategory(id);
      fetchCategories();
    } catch (error: any) {
      alert(error.message || 'Silme işlemi başarısız');
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      description: '',
      icon: '📁',
      order: 0,
    });
    setEditingCategory(null);
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
      <div className="categories-page">
        <div className="page-header">
          <h1>Kategori Yönetimi</h1>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            + Yeni Kategori
          </button>
        </div>

        {showForm && (
          <div className="modal-overlay" onClick={resetForm}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{editingCategory ? 'Kategoriyi Düzenle' : 'Yeni Kategori Ekle'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>ID *</label>
                    <input
                      type="text"
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      required
                      disabled={!!editingCategory}
                      placeholder="ornek: ic-cephe"
                    />
                  </div>
                  <div className="form-group">
                    <label>Sıra</label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>İsim *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="İç Cephe"
                  />
                </div>

                <div className="form-group">
                  <label>Açıklama *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={3}
                    placeholder="Kategori açıklaması"
                  />
                </div>

                <div className="form-group">
                  <label>İkon</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="Emoji veya ikon"
                  />
                </div>

                <div className="form-actions">
                  <button type="button" onClick={resetForm} className="btn-secondary">
                    İptal
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingCategory ? 'Güncelle' : 'Oluştur'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="categories-grid">
          {categories.map((category) => (
            <div key={category.id} className="category-card">
              <div className="category-icon">{category.icon}</div>
              <h3>{category.name}</h3>
              <p className="category-id">ID: {category.id}</p>
              <p className="category-desc">{category.description}</p>
              <p className="category-order">Sıra: {category.order}</p>
              <div className="category-actions">
                <button onClick={() => handleEdit(category)} className="btn-edit">
                  Düzenle
                </button>
                <button onClick={() => handleDelete(category.id)} className="btn-delete">
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="empty-state">
            <p>Henüz kategori eklenmemiş.</p>
            <button onClick={() => setShowForm(true)} className="btn-primary">
              İlk Kategoriyi Ekle
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Categories;
