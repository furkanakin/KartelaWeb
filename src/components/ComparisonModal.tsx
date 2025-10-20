import { useState } from 'react';
import './ComparisonModal.css';

interface ComparisonModalProps {
  originalImage: string;
  processedImage: string;
  onClose: () => void;
}

const ComparisonModal = ({
  originalImage,
  processedImage,
  onClose,
}: ComparisonModalProps) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <div className="comparison-modal-overlay" onClick={onClose}>
      <div className="comparison-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="comparison-modal-header">
          <h2>Önce / Sonra Karşılaştırma</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div
          className="comparison-container"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          onTouchMove={handleTouchMove}
        >
          {/* İşlenmiş görsel (arka plan) */}
          <div className="comparison-image processed-image">
            <img src={processedImage} alt="Sonra" draggable={false} />
            <div className="image-label processed-label">SONRA</div>
          </div>

          {/* Orijinal görsel (üstte, clip-path ile kesilecek) */}
          <div
            className="comparison-image original-image"
            style={{
              clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
            }}
          >
            <img src={originalImage} alt="Önce" draggable={false} />
            <div className="image-label original-label">ÖNCE</div>
          </div>

          {/* Slider çizgisi ve tutacağı */}
          <div
            className="comparison-slider"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="slider-line"></div>
            <div className="slider-handle">
              <div className="slider-arrow left">◀</div>
              <div className="slider-circle"></div>
              <div className="slider-arrow right">▶</div>
            </div>
          </div>
        </div>

        <div className="comparison-modal-footer">
          <p className="instruction-text">
            📍 Kaydırıcıyı sürükleyerek önce/sonra karşılaştırması yapabilirsiniz
          </p>
          <div className="action-buttons">
            <a
              href={processedImage}
              download="kartela-processed.png"
              className="download-btn"
            >
              📥 İşlenmiş Görseli İndir
            </a>
            <button className="close-modal-btn" onClick={onClose}>
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal;
