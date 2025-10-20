import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPalettes, getBrand } from '../services/storage';
import WhatsAppButton from '../components/WhatsAppButton';
import './CategoryPalettes.css';

const BrandPalettes = () => {
  const { brandId } = useParams<{ brandId: string }>();
  const navigate = useNavigate();
  const [brand, setBrand] = useState<any>(null);
  const [palettes, setPalettes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (brandId) {
      const brandData = getBrand(brandId);
      const allPalettes = getPalettes();
      const brandPalettes = allPalettes.filter((p: any) => p.brandId === brandId);

      setBrand(brandData);
      setPalettes(brandPalettes);
      setLoading(false);
    }
  }, [brandId]);

  if (loading) {
    return (
      <div className="app">
        <header className="app-header">
          <div className="container">
            <div className="logo">
              <img src="/img/kayalar-kimya-logo-neww.svg" alt="Kayalar Kimya" />
              <span className="logo-text">Kartela</span>
            </div>
          </div>
        </header>
        <main className="app-main">
          <div className="container">
            <p style={{ textAlign: 'center', padding: '4rem' }}>Yükleniyor...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="app">
        <header className="app-header">
          <div className="container">
            <div className="logo">
              <img src="/img/kayalar-kimya-logo-neww.svg" alt="Kayalar Kimya" />
              <span className="logo-text">Kartela</span>
            </div>
          </div>
        </header>
        <main className="app-main">
          <div className="container">
            <p style={{ textAlign: 'center', padding: '4rem' }}>Marka bulunamadı.</p>
            <div style={{ textAlign: 'center' }}>
              <button onClick={() => navigate('/')} className="back-button">
                Ana Sayfaya Dön
              </button>
            </div>
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
          <div className="category-palettes-container">
            <div className="category-palettes-header">
              <button
                className="back-button"
                onClick={() => navigate('/')}
              >
                ← Geri Dön
              </button>
              <div className="brand-header-content">
                <img src={brand.logo} alt={brand.name} className="brand-page-logo" />
                <div>
                  <h1 className="category-title">{brand.name}</h1>
                  <p className="category-description">{brand.description}</p>
                </div>
              </div>
            </div>

            {palettes.length > 0 ? (
              <div className="palettes-catalog">
                {palettes.map((palette) => (
                  <div
                    key={palette.id}
                    className="palette-catalog-card"
                    onClick={() => navigate(`/palette/${palette.id}`)}
                  >
                    <div className="palette-catalog-preview">
                      {palette.items.slice(0, 4).map((item: any, index: number) => {
                        const colorData = item.data;
                        const isColor = 'hex' in colorData;
                        const isPattern = 'imageUrl' in colorData;

                        return (
                          <div
                            key={index}
                            className="preview-color"
                            style={{
                              backgroundColor: isColor ? colorData.hex : '#f0f0f0',
                              backgroundImage: isPattern ? `url(${colorData.imageUrl})` : undefined,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }}
                          />
                        );
                      })}
                    </div>
                    <div className="palette-catalog-info">
                      <h3>{palette.name}</h3>
                      {palette.description && <p>{palette.description}</p>}
                      <div className="palette-catalog-meta">
                        <span className="color-count">{palette.items.length} Renk</span>
                        {palette.photoUploadEnabled !== false && (
                          <span className="photo-badge">📸 Fotoğraf</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>Bu markaya ait henüz kartela bulunmuyor.</p>
                <button onClick={() => navigate('/')} className="btn-primary">
                  Ana Sayfaya Dön
                </button>
              </div>
            )}
          </div>
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
};

export default BrandPalettes;
