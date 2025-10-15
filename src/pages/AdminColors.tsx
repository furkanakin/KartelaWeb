import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Color, ColorPalette, CategoryType } from '../types';
import { categories } from '../data/palettes';
import '../styles/AdminColors.css';

function AdminColors() {
  const [allColors, setAllColors] = useState<(Color & { category: CategoryType; paletteName: string })[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const colors: (Color & { category: CategoryType; paletteName: string })[] = [];
    categories.forEach(category => {
      category.palettes.forEach(palette => {
        palette.colors.forEach(color => {
          colors.push({
            ...color,
            category: category.id,
            paletteName: palette.name
          });
        });
      });
    });
    setAllColors(colors);
  }, []);

  const filteredColors = allColors.filter(color => {
    const matchesCategory = selectedCategory === 'all' || color.category === selectedCategory;
    const matchesSearch = color.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         color.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDelete = (colorId: string) => {
    if (confirm('Bu rengi silmek istediğinizden emin misiniz?')) {
      setAllColors(allColors.filter(c => c.id !== colorId));
    }
  };

  return (
    <div className="admin-colors">
      <div className="admin-header">
        <div className="header-top">
          <Link to="/admin" className="back-link">← Geri Dön</Link>
          <img src="/img/kayalar-kimya-logo-neww.svg" alt="Kayalar Kimya" className="admin-logo-small" />
        </div>
        <div className="header-content">
          <h1>Renk Kartelaları Yönetimi</h1>
          <Link to="/admin/colors/new" className="btn-primary">+ Yeni Renk Ekle</Link>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Renk adı veya kod ile ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="category-filters">
          <button
            className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            Tümü ({allColors.length})
          </button>
          {categories.map(category => {
            const count = allColors.filter(c => c.category === category.id).length;
            return (
              <button
                key={category.id}
                className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.icon} {category.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="colors-grid">
        {filteredColors.map(color => (
          <div key={color.id} className="color-card">
            <div
              className="color-preview"
              style={{ backgroundColor: color.hex }}
            >
              <div className="color-overlay">
                <button
                  className="btn-edit"
                  onClick={() => alert('Düzenleme özelliği yakında eklenecek')}
                >
                  ✏️ Düzenle
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(color.id)}
                >
                  🗑️ Sil
                </button>
              </div>
            </div>
            <div className="color-info">
              <h3>{color.name}</h3>
              <p className="color-code">{color.code}</p>
              <p className="color-hex">{color.hex}</p>
              <div className="color-meta">
                <span className="palette-name">{color.paletteName}</span>
                <span className="category-badge">
                  {categories.find(c => c.id === color.category)?.icon}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredColors.length === 0 && (
        <div className="empty-state">
          <p>Aradığınız kriterlere uygun renk bulunamadı.</p>
        </div>
      )}
    </div>
  );
}

export default AdminColors;
