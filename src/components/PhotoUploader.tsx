import { useRef, useState } from 'react';
import { CategoryType } from '../types';
import './PhotoUploader.css';

interface PhotoUploaderProps {
  category: CategoryType;
  onImageUpload: (imageData: string) => void;
}

const PhotoUploader = ({ category, onImageUpload }: PhotoUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const getCategoryText = () => {
    switch (category) {
      case 'ic-cephe':
        return {
          title: 'Duvar Fotoğrafı Yükleyin',
          description: 'İç mekan duvar fotoğrafınızı yükleyin veya çekin',
          icon: '🏠',
        };
      case 'dis-cephe':
        return {
          title: 'Bina Fotoğrafı Yükleyin',
          description: 'Dış cephe fotoğrafınızı yükleyin veya çekin',
          icon: '🏢',
        };
      case 'mobilya':
        return {
          title: 'Ahşap Fotoğrafı Yükleyin',
          description: 'Mobilya veya ahşap yüzey fotoğrafınızı yükleyin veya çekin',
          icon: '🪑',
        };
      default:
        return {
          title: 'Fotoğraf Yükleyin',
          description: 'Bir fotoğraf yükleyin veya çekin',
          icon: '📷',
        };
    }
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Lütfen bir resim dosyası seçin');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageUpload(result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const text = getCategoryText();

  return (
    <div className="photo-uploader">
      <div className="uploader-header">
        <div className="uploader-icon">{text.icon}</div>
        <h3 className="uploader-title">{text.title}</h3>
        <p className="uploader-description">{text.description}</p>
      </div>

      <div
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="upload-icon">📸</div>
        <p className="upload-text">
          Fotoğraf sürükleyip bırakın veya tıklayın
        </p>
        <button className="upload-button">Dosya Seç</button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
      </div>

      <div className="upload-tips">
        <h4>💡 İpuçları</h4>
        <ul>
          <li>En iyi sonuç için iyi aydınlatılmış fotoğraflar kullanın</li>
          <li>Yüzeyin net görünebildiği açılardan çekim yapın</li>
          <li>JPG, PNG formatlarını destekliyoruz</li>
        </ul>
      </div>
    </div>
  );
};

export default PhotoUploader;
