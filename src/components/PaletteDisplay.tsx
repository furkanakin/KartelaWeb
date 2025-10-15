import { Category, ColorPalette, Color, Pattern } from '../types';
import './PaletteDisplay.css';

interface PaletteDisplayProps {
  category: Category;
  selectedPalette: ColorPalette | null;
  selectedColor: Color | Pattern | null;
  onPaletteSelect: (palette: ColorPalette) => void;
  onColorSelect: (color: Color | Pattern) => void;
}

const PaletteDisplay = ({
  category,
  selectedPalette,
  selectedColor,
  onPaletteSelect,
  onColorSelect,
}: PaletteDisplayProps) => {
  const isColor = (item: Color | Pattern): item is Color => {
    return 'hex' in item;
  };

  return (
    <div className="palette-display">
      <h3 className="palette-title">Kartela Koleksiyonları</h3>

      <div className="palette-list">
        {category.palettes.map((palette) => (
          <div
            key={palette.id}
            className={`palette-item ${selectedPalette?.id === palette.id ? 'active' : ''}`}
            onClick={() => onPaletteSelect(palette)}
          >
            <div className="palette-header">
              <h4 className="palette-name">{palette.name}</h4>
              {palette.description && (
                <p className="palette-description">{palette.description}</p>
              )}
            </div>

            {selectedPalette?.id === palette.id && (
              <div className="color-grid">
                {palette.colors.map((color) => (
                  <div
                    key={color.id}
                    className={`color-card ${
                      selectedColor && 'id' in selectedColor && selectedColor.id === color.id
                        ? 'selected'
                        : ''
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onColorSelect(color);
                    }}
                  >
                    <div
                      className="color-swatch"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="color-info">
                      <div className="color-name">{color.name}</div>
                      <div className="color-code">{color.code}</div>
                      <div className="color-hex">{color.hex}</div>
                    </div>
                  </div>
                ))}

                {palette.patterns && palette.patterns.map((pattern) => (
                  <div
                    key={pattern.id}
                    className={`color-card pattern-card ${
                      selectedColor && 'id' in selectedColor && selectedColor.id === pattern.id
                        ? 'selected'
                        : ''
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onColorSelect(pattern);
                    }}
                  >
                    <div
                      className="color-swatch pattern-swatch"
                      style={{ backgroundImage: `url(${pattern.imageUrl})` }}
                    />
                    <div className="color-info">
                      <div className="color-name">{pattern.name}</div>
                      <div className="color-code">{pattern.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedColor && (
        <div className="selected-color-preview">
          <h4>Seçili Renk</h4>
          <div className="preview-card">
            {isColor(selectedColor) ? (
              <>
                <div
                  className="preview-swatch"
                  style={{ backgroundColor: selectedColor.hex }}
                />
                <div className="preview-info">
                  <div className="preview-name">{selectedColor.name}</div>
                  <div className="preview-code">{selectedColor.code}</div>
                  <div className="preview-hex">{selectedColor.hex}</div>
                  <div className="preview-rgb">
                    RGB({selectedColor.rgb.r}, {selectedColor.rgb.g}, {selectedColor.rgb.b})
                  </div>
                </div>
              </>
            ) : (
              <>
                <div
                  className="preview-swatch pattern-swatch"
                  style={{ backgroundImage: `url(${selectedColor.imageUrl})` }}
                />
                <div className="preview-info">
                  <div className="preview-name">{selectedColor.name}</div>
                  <div className="preview-code">{selectedColor.type}</div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaletteDisplay;
