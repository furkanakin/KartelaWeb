import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Category, CategoryType } from '../types';
import { categories as initialCategories } from '../data/palettes';
import '../styles/AdminCategories.css';

function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [editingId, setEditingId] = useState<CategoryType | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', icon: '' });

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setEditForm({
      name: category.name,
      description: category.description,
      icon: category.icon
    });
  };

  const handleSave = (categoryId: CategoryType) => {
    setCategories(categories.map(cat =>
      cat.id === categoryId
        ? { ...cat, ...editForm }
        : cat
    ));
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ name: '', description: '', icon: '' });
  };

  return (
    <div className="admin-categories">
      <div className="admin-header">
        <div className="header-top">
          <Link to="/admin" className="back-link">← Geri Dön</Link>
          <img src="/img/kayalar-kimya-logo-neww.svg" alt="Kayalar Kimya" className="admin-logo-small" />
        </div>
        <div className="header-content">
          <h1>Kategori Yönetimi</h1>
        </div>
      </div>

      <div className="categories-list">
        {categories.map(category => (
          <div key={category.id} className="category-card">
            {editingId === category.id ? (
              <div className="category-edit-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>İkon (Emoji)</label>
                    <input
                      type="text"
                      value={editForm.icon}
                      onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                      className="form-input"
                      maxLength={2}
                    />
                  </div>
                  <div className="form-group flex-grow">
                    <label>Kategori Adı</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Açıklama</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="form-textarea"
                    rows={3}
                  />
                </div>
                <div className="form-actions">
                  <button onClick={() => handleSave(category.id)} className="btn-save">
                    💾 Kaydet
                  </button>
                  <button onClick={handleCancel} className="btn-cancel">
                    ✖️ İptal
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="category-header">
                  <div className="category-icon-large">{category.icon}</div>
                  <div className="category-info">
                    <h2>{category.name}</h2>
                    <p className="category-description">{category.description}</p>
                    <div className="category-stats">
                      <span className="stat-badge">
                        📦 {category.palettes.length} Palet
                      </span>
                      <span className="stat-badge">
                        🎨 {category.palettes.reduce((sum, p) => sum + p.colors.length, 0)} Renk
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEdit(category)}
                    className="btn-edit-icon"
                  >
                    ✏️
                  </button>
                </div>

                <div className="palettes-section">
                  <h3>Paletler</h3>
                  <div className="palettes-grid">
                    {category.palettes.map(palette => (
                      <div key={palette.id} className="palette-mini-card">
                        <h4>{palette.name}</h4>
                        <div className="palette-colors-preview">
                          {palette.colors.slice(0, 5).map(color => (
                            <div
                              key={color.id}
                              className="color-swatch"
                              style={{ backgroundColor: color.hex }}
                              title={color.name}
                            />
                          ))}
                          {palette.colors.length > 5 && (
                            <div className="color-swatch-more">+{palette.colors.length - 5}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminCategories;
