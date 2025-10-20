import { useState } from 'react';
import { CategoryType, Color, Pattern } from '../types';
import { processImage } from '../services/api';
import ComparisonModal from './ComparisonModal';
import './PreviewArea.css';

interface PreviewAreaProps {
  originalImage: string;
  processedImage: string | null;
  selectedColor: Color | Pattern | null;
  category: CategoryType;
  onImageProcess: (processedImage: string) => void;
  onReset: () => void;
}

const PreviewArea = ({
  originalImage,
  processedImage,
  selectedColor,
  category,
  onImageProcess,
  onReset,
}: PreviewAreaProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showComparisonModal, setShowComparisonModal] = useState(false);

  const handleProcess = async () => {
    if (!selectedColor) {
      setError('Lütfen önce bir renk seçin');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await processImage({
        image: originalImage,
        color: selectedColor,
        category,
      });

      if (response.success) {
        onImageProcess(response.processedImage);
        // Modal'ı otomatik aç
        setShowComparisonModal(true);
      } else {
        setError(response.error || 'İşlem başarısız oldu');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setIsProcessing(false);
    }
  };

  const isColor = (item: Color | Pattern): item is Color => {
    return 'hex' in item;
  };

  return (
    <div className="preview-area">
      <div className="preview-header">
        <h3>Önizleme</h3>
        <button className="reset-button" onClick={onReset}>
          🔄 Yeni Fotoğraf
        </button>
      </div>

      <div className="preview-container">
        <div className="image-comparison">
          <div className="comparison-side">
            <h4>Orijinal</h4>
            <img src={originalImage} alt="Original" className="preview-image" />
          </div>

          <div className="comparison-divider">→</div>

          <div className="comparison-side">
            <h4>İşlenmiş</h4>
            {processedImage ? (
              <img src={processedImage} alt="Processed" className="preview-image" />
            ) : (
              <div className="preview-placeholder">
                <p>Renk seçip "Uygula" butonuna basın</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedColor && (
        <div className="selected-color-info">
          <h4>Seçili Renk:</h4>
          <div className="color-info-card">
            {isColor(selectedColor) ? (
              <>
                <div
                  className="color-sample"
                  style={{ backgroundColor: selectedColor.hex }}
                />
                <div className="color-details">
                  <div className="color-name">{selectedColor.name}</div>
                  <div className="color-code">{selectedColor.code}</div>
                </div>
              </>
            ) : (
              <>
                <div
                  className="color-sample pattern-sample"
                  style={{ backgroundImage: `url(${selectedColor.imageUrl})` }}
                />
                <div className="color-details">
                  <div className="color-name">{selectedColor.name}</div>
                  <div className="color-code">{selectedColor.type}</div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      <div className="action-buttons">
        <button
          className="process-button"
          onClick={handleProcess}
          disabled={isProcessing || !selectedColor}
        >
          {isProcessing ? (
            <>
              <span className="spinner"></span>
              İşleniyor...
            </>
          ) : (
            'Rengi Uygula'
          )}
        </button>
      </div>

      {processedImage && (
        <div className="download-section">
          <button
            className="compare-button"
            onClick={() => setShowComparisonModal(true)}
          >
            🔍 Karşılaştır
          </button>
          <a
            href={processedImage}
            download="kartela-preview.png"
            className="download-button"
          >
            📥 İndir
          </a>
        </div>
      )}

      {showComparisonModal && processedImage && (
        <ComparisonModal
          originalImage={originalImage}
          processedImage={processedImage}
          onClose={() => setShowComparisonModal(false)}
        />
      )}
    </div>
  );
};

export default PreviewArea;
