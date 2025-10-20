import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CategoryType } from './types';
import CategorySelector from './components/CategorySelector';
import BrandSelector from './components/BrandSelector';
import WhatsAppButton from './components/WhatsAppButton';
import * as storage from './services/storage';
import './App.css';

interface ApiCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
}

interface ApiPalette {
  id: string;
  name: string;
  categoryId: string;
  description?: string;
  items: Array<{
    type: 'color' | 'pattern';
    data: any;
  }>;
}

function App() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // localStorage'dan kategorileri ve markaları al
      const categoriesData = storage.getCategories();
      const brandsData = storage.getBrands();
      setCategories(categoriesData);
      setBrands(brandsData);
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (categoryId: CategoryType) => {
    navigate(`/category/${categoryId}`);
  };

  const handleBrandSelect = (brandId: string) => {
    // Marka sayfasına yönlendir (şimdilik category ile aynı mantık)
    navigate(`/brand/${brandId}`);
  };

  if (loading) {
    return (
      <div className="app">
        <header className="app-header">
          <div className="container">
            <div className="logo">
              <img src="/img/kayalar-kimya-logo-neww.svg" alt="Kayalar Kimya" />
              <span className="logo-text">Kartela</span>
            </div>
            <p className="tagline">Hayalinizdeki Rengi Keşfedin</p>
          </div>
        </header>
        <main className="app-main">
          <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
            <p style={{ fontSize: '1.2rem', color: '#666' }}>Yükleniyor...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <div className="logo">
            <img src="/img/kayalar-kimya-logo-neww.svg" alt="Kayalar Kimya" />
            <span className="logo-text">Kartela</span>
          </div>
          <p className="tagline">Hayalinizdeki Rengi Keşfedin</p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <BrandSelector
            brands={brands}
            onSelect={handleBrandSelect}
          />

          <CategorySelector
            categories={categories}
            onSelect={handleCategorySelect}
          />
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>© 2024 Kartela - Profesyonel Boya Çözümleri</p>
        </div>
      </footer>

      <WhatsAppButton />
    </div>
  );
}

export default App;
