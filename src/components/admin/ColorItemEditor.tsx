import React, { useState } from 'react';
import axios from 'axios';
import './ColorItemEditor.css';

interface Color {
  id: string;
  name: string;
  code: string;
  rgb: { r: number; g: number; b: number };
  hex: string;
}

interface Pattern {
  id: string;
  name: string;
  imageUrl: string;
  type: 'texture' | 'pattern';
}

interface ColorOrPattern {
  type: 'color' | 'pattern';
  data: Color | Pattern;
}

interface ColorItemEditorProps {
  items: ColorOrPattern[];
  onChange: (items: ColorOrPattern[]) => void;
}

const ColorItemEditor: React.FC<ColorItemEditorProps> = ({ items, onChange }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [itemType, setItemType] = useState<'color' | 'pattern'>('color');
  const [uploadingImage, setUploadingImage] = useState(false);

  const [colorForm, setColorForm] = useState<Color>({
    id: '',
    name: '',
    code: '',
    rgb: { r: 255, g: 255, b: 255 },
    hex: '#ffffff',
  });

  const [patternForm, setPatternForm] = useState<Pattern>({
    id: '',
    name: '',
    imageUrl: '',
    type: 'texture',
  });

  const handleAddItem = () => {
    if (itemType === 'color') {
      if (!colorForm.id || !colorForm.name || !colorForm.code) {
        alert('Lütfen tüm alanları doldurun');
        return;
      }
      const newItem: ColorOrPattern = {
        type: 'color',
        data: { ...colorForm },
      };
      onChange([...items, newItem]);
    } else {
      if (!patternForm.id || !patternForm.name || !patternForm.imageUrl) {
        alert('Lütfen tüm alanları doldurun');
        return;
      }
      const newItem: ColorOrPattern = {
        type: 'pattern',
        data: { ...patternForm },
      };
      onChange([...items, newItem]);
    }
    resetForms();
    setShowAddForm(false);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploadingImage(true);
    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPatternForm({ ...patternForm, imageUrl: response.data.url });
    } catch (error: any) {
      alert(error.response?.data?.message || 'Görsel yüklenemedi');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleHexChange = (hex: string) => {
    setColorForm({ ...colorForm, hex });
    // Hex'i RGB'ye çevir
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      setColorForm({
        ...colorForm,
        hex,
        rgb: {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        },
      });
    }
  };

  const handleRgbChange = (channel: 'r' | 'g' | 'b', value: number) => {
    const newRgb = { ...colorForm.rgb, [channel]: value };
    const hex = '#' + [newRgb.r, newRgb.g, newRgb.b].map(x => x.toString(16).padStart(2, '0')).join('');
    setColorForm({ ...colorForm, rgb: newRgb, hex });
  };

  const resetForms = () => {
    setColorForm({
      id: '',
      name: '',
      code: '',
      rgb: { r: 255, g: 255, b: 255 },
      hex: '#ffffff',
    });
    setPatternForm({
      id: '',
      name: '',
      imageUrl: '',
      type: 'texture',
    });
  };

  return (
    <div className="color-item-editor">
      <div className="editor-header">
        <h3>Renkler & Görseller ({items.length})</h3>
        <button type="button" onClick={() => setShowAddForm(true)} className="btn-add-item">
          + Ekle
        </button>
      </div>

      {showAddForm && (
        <div className="add-item-form">
          <div className="type-selector">
            <label>
              <input
                type="radio"
                value="color"
                checked={itemType === 'color'}
                onChange={(e) => setItemType(e.target.value as 'color')}
              />
              Renk
            </label>
            <label>
              <input
                type="radio"
                value="pattern"
                checked={itemType === 'pattern'}
                onChange={(e) => setItemType(e.target.value as 'pattern')}
              />
              Görsel/Desen
            </label>
          </div>

          {itemType === 'color' ? (
            <div className="color-form">
              <div className="form-row">
                <div className="form-group">
                  <label>ID</label>
                  <input
                    type="text"
                    value={colorForm.id}
                    onChange={(e) => setColorForm({ ...colorForm, id: e.target.value })}
                    placeholder="c1"
                  />
                </div>
                <div className="form-group">
                  <label>Kod</label>
                  <input
                    type="text"
                    value={colorForm.code}
                    onChange={(e) => setColorForm({ ...colorForm, code: e.target.value })}
                    placeholder="KB-100"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>İsim</label>
                <input
                  type="text"
                  value={colorForm.name}
                  onChange={(e) => setColorForm({ ...colorForm, name: e.target.value })}
                  placeholder="Kar Beyazı"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Hex</label>
                  <div className="color-input-group">
                    <input
                      type="color"
                      value={colorForm.hex}
                      onChange={(e) => handleHexChange(e.target.value)}
                    />
                    <input
                      type="text"
                      value={colorForm.hex}
                      onChange={(e) => handleHexChange(e.target.value)}
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
              </div>
              <div className="form-row rgb-inputs">
                <div className="form-group">
                  <label>R</label>
                  <input
                    type="number"
                    value={colorForm.rgb.r}
                    onChange={(e) => handleRgbChange('r', parseInt(e.target.value))}
                    min="0"
                    max="255"
                  />
                </div>
                <div className="form-group">
                  <label>G</label>
                  <input
                    type="number"
                    value={colorForm.rgb.g}
                    onChange={(e) => handleRgbChange('g', parseInt(e.target.value))}
                    min="0"
                    max="255"
                  />
                </div>
                <div className="form-group">
                  <label>B</label>
                  <input
                    type="number"
                    value={colorForm.rgb.b}
                    onChange={(e) => handleRgbChange('b', parseInt(e.target.value))}
                    min="0"
                    max="255"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="pattern-form">
              <div className="form-row">
                <div className="form-group">
                  <label>ID</label>
                  <input
                    type="text"
                    value={patternForm.id}
                    onChange={(e) => setPatternForm({ ...patternForm, id: e.target.value })}
                    placeholder="p1"
                  />
                </div>
                <div className="form-group">
                  <label>Tip</label>
                  <select
                    value={patternForm.type}
                    onChange={(e) => setPatternForm({ ...patternForm, type: e.target.value as 'texture' | 'pattern' })}
                  >
                    <option value="texture">Doku</option>
                    <option value="pattern">Desen</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>İsim</label>
                <input
                  type="text"
                  value={patternForm.name}
                  onChange={(e) => setPatternForm({ ...patternForm, name: e.target.value })}
                  placeholder="Ahşap Doku"
                />
              </div>
              <div className="form-group">
                <label>Görsel</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                {uploadingImage && <p>Yükleniyor...</p>}
                {patternForm.imageUrl && (
                  <div className="image-preview">
                    <img src={`http://localhost:5000${patternForm.imageUrl}`} alt="Preview" />
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                resetForms();
              }}
              className="btn-secondary"
            >
              İptal
            </button>
            <button type="button" onClick={handleAddItem} className="btn-primary">
              Ekle
            </button>
          </div>
        </div>
      )}

      <div className="items-list">
        {items.map((item, index) => (
          <div key={index} className={`item-card ${item.type}`}>
            {item.type === 'color' ? (
              <>
                <div className="color-swatch" style={{ backgroundColor: (item.data as Color).hex }} />
                <div className="item-info">
                  <strong>{(item.data as Color).name}</strong>
                  <span>{(item.data as Color).code}</span>
                  <span>{(item.data as Color).hex}</span>
                </div>
              </>
            ) : (
              <>
                <div className="pattern-preview">
                  <img src={`http://localhost:5000${(item.data as Pattern).imageUrl}`} alt={(item.data as Pattern).name} />
                </div>
                <div className="item-info">
                  <strong>{(item.data as Pattern).name}</strong>
                  <span>{(item.data as Pattern).type}</span>
                </div>
              </>
            )}
            <button type="button" onClick={() => handleRemoveItem(index)} className="btn-remove">
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorItemEditor;
