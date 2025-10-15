import { useState, useEffect } from 'react';
import axios from 'axios';
import { CategoryType, ColorPalette, Color, Pattern } from './types';
import CategorySelector from './components/CategorySelector';
import PaletteDisplay from './components/PaletteDisplay';
import PhotoUploader from './components/PhotoUploader';
import PreviewArea from './components/PreviewArea';
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
  const [categories, setCategories] = useState<any[]>([]);
  const [palettes, setPalettes] = useState<ApiPalette[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [selectedPalette, setSelectedPalette] = useState<ColorPalette | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | Pattern | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, palettesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/categories'),
        axios.get('http://localhost:5000/api/palettes'),
      ]);

      const categoriesData = categoriesRes.data.map((cat: ApiCategory) => ({
        id: cat.id,
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        palettes: [],
      }));

      // Paletleri kategorilere göre grupla
      palettesRes.data.forEach((palette: ApiPalette) => {
        const category = categoriesData.find((c: any) => c.id === palette.categoryId);
        if (category) {
          const formattedPalette = {
            id: palette.id,
            name: palette.name,
            category: palette.categoryId as CategoryType,
            description: palette.description,
            colors: palette.items
              .filter((item) => item.type === 'color')
              .map((item) => item.data),
            patterns: palette.items
              .filter((item) => item.type === 'pattern')
              .map((item) => item.data),
          };
          category.palettes.push(formattedPalette);
        }
      });

      setCategories(categoriesData);
      setPalettes(palettesRes.data);
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
      // Hata durumunda varsayılan kategorileri kullan
      import('./data/palettes').then((module) => {
        setCategories(module.categories);
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (categoryId: CategoryType) => {
    setSelectedCategory(categoryId);
    setSelectedPalette(null);
    setSelectedColor(null);
    setUploadedImage(null);
    setProcessedImage(null);
  };

  const handlePaletteSelect = (palette: ColorPalette) => {
    setSelectedPalette(palette);
    setSelectedColor(null);
    setProcessedImage(null);
  };

  const handleColorSelect = (color: Color | Pattern) => {
    setSelectedColor(color);
    setProcessedImage(null);
  };

  const handleImageUpload = (imageData: string) => {
    setUploadedImage(imageData);
    setProcessedImage(null);
  };

  const handleImageProcess = (processedImageData: string) => {
    setProcessedImage(processedImageData);
  };

  const currentCategory = categories.find(c => c.id === selectedCategory);

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
          {!selectedCategory ? (
            <CategorySelector
              categories={categories}
              onSelect={handleCategorySelect}
            />
          ) : (
            <div className="workspace">
              <div className="workspace-header">
                <button
                  className="back-button"
                  onClick={() => setSelectedCategory(null)}
                >
                  ← Geri Dön
                </button>
                <h2 className="category-title">
                  {currentCategory?.icon} {currentCategory?.name}
                </h2>
                <p className="category-description">{currentCategory?.description}</p>
              </div>

              <div className="workspace-content">
                <div className="left-panel">
                  <PaletteDisplay
                    category={currentCategory!}
                    selectedPalette={selectedPalette}
                    selectedColor={selectedColor}
                    onPaletteSelect={handlePaletteSelect}
                    onColorSelect={handleColorSelect}
                  />
                </div>

                <div className="right-panel">
                  {!uploadedImage ? (
                    <PhotoUploader
                      category={selectedCategory}
                      onImageUpload={handleImageUpload}
                    />
                  ) : (
                    <PreviewArea
                      originalImage={uploadedImage}
                      processedImage={processedImage}
                      selectedColor={selectedColor}
                      category={selectedCategory}
                      onImageProcess={handleImageProcess}
                      onReset={() => {
                        setUploadedImage(null);
                        setProcessedImage(null);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>© 2024 Kartela - Profesyonel Boya Çözümleri</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
