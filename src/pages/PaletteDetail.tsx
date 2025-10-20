import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CategoryType, Color, Pattern } from '../types';
import { getPalette } from '../services/storage';
import PhotoUploader from '../components/PhotoUploader';
import PreviewArea from '../components/PreviewArea';
import WhatsAppButton from '../components/WhatsAppButton';
import './PaletteDetail.css';

const PaletteDetail = () => {
  const { paletteId } = useParams<{ paletteId: string }>();
  const navigate = useNavigate();
  const photoUploadRef = useRef<HTMLDivElement>(null);
  const [palette, setPalette] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState<Color | Pattern | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (paletteId) {
      const paletteData = getPalette(paletteId);
      if (paletteData) {
        setPalette(paletteData);
      }
      setLoading(false);
    }
  }, [paletteId]);

  const handleColorSelect = (color: Color | Pattern) => {
    setSelectedColor(color);
    setProcessedImage(null);

    // Renk seçildiğinde fotoğraf yükleme alanına scroll
    if (palette.photoUploadEnabled !== false && photoUploadRef.current) {
      photoUploadRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleImageUpload = (imageData: string) => {
    setUploadedImage(imageData);
    setProcessedImage(null);
  };

  const handleImageProcess = (processedImageData: string) => {
    setProcessedImage(processedImageData);
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

  if (!palette) {
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
            <p style={{ textAlign: 'center', padding: '4rem' }}>Kartela bulunamadı.</p>
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

  const getContrastColor = (hexColor: string): string => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

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
          <div className="palette-detail-container">
            <div className="palette-detail-header">
              <button className="back-button" onClick={() => navigate(-1)}>
                ← Geri Dön
              </button>
              <h1 className="palette-title">{palette.name}</h1>
              {palette.description && (
                <p className="palette-description">{palette.description}</p>
              )}
            </div>

            <div className="palette-detail-content-2col">
              {/* Sol Panel - Renkler ve Fotoğraf Yükleme */}
              <div className="left-column">
                {/* Renk Seçimi */}
                <div className="colors-section">
                  <h3>Renkleri Keşfedin</h3>
                  <div className="color-grid-compact">
                    {palette.items.map((item: any) => {
                      const colorData = item.data;
                      const isColor = 'hex' in colorData;
                      const isPattern = 'imageUrl' in colorData;
                      const isSelected = selectedColor && 'id' in selectedColor && selectedColor.id === colorData.id;

                      return (
                        <div
                          key={colorData.id}
                          className={`color-card-compact ${isSelected ? 'selected' : ''}`}
                          style={{
                            backgroundColor: isColor ? colorData.hex : undefined,
                            backgroundImage: isPattern ? `url(${colorData.imageUrl})` : undefined,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                          onClick={() => handleColorSelect(colorData)}
                        >
                          <div
                            className={`color-info-compact ${isPattern ? 'pattern-info' : ''}`}
                            style={{ color: isColor ? getContrastColor(colorData.hex) : '#fff' }}
                          >
                            <div className="color-name-compact">{colorData.name}</div>
                            {isColor && <div className="color-code-compact">{colorData.code}</div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Fotoğraf Yükleme */}
                {palette.photoUploadEnabled !== false && (
                  <div ref={photoUploadRef} className="photo-upload-section">
                    {!uploadedImage ? (
                      <PhotoUploader
                        category={palette.categoryId as CategoryType}
                        onImageUpload={handleImageUpload}
                      />
                    ) : (
                      <PreviewArea
                        originalImage={uploadedImage}
                        processedImage={processedImage}
                        selectedColor={selectedColor}
                        category={palette.categoryId as CategoryType}
                        onImageProcess={handleImageProcess}
                        onReset={() => {
                          setUploadedImage(null);
                          setProcessedImage(null);
                        }}
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Sağ Panel - Ürün Gösterimi */}
              <div className="right-column">
                <div className="product-showcase">
                  <div className="product-image-wrapper">
                    <img
                      src={palette.productImage || '/img/zeolit.jpg'}
                      alt={palette.productName || 'Ürün'}
                      className="product-image"
                    />
                  </div>
                  <div className="product-info">
                    <h2 className="product-name">
                      {palette.productName || 'Düfa Zeolit İpek Mat İç Cephe Duvar Boyası'}
                    </h2>
                    <a
                      href="#"
                      className="buy-button"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Satın alma işlevi yakında eklenecek!');
                      }}
                    >
                      Satın Almak İçin Tıklayın
                    </a>
                  </div>
                </div>
              </div>
            </div>
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

export default PaletteDetail;
