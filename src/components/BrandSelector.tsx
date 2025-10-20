import React from 'react';
import './BrandSelector.css';

interface Brand {
  id: string;
  name: string;
  description: string;
  logo: string;
}

interface BrandSelectorProps {
  brands: Brand[];
  onSelect: (brandId: string) => void;
}

const BrandSelector: React.FC<BrandSelectorProps> = ({ brands, onSelect }) => {
  return (
    <div className="brand-selector">
      <h2 className="brand-selector-title">Markalarımız</h2>
      <div className="brand-grid">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="brand-card"
            onClick={() => onSelect(brand.id)}
          >
            <div className="brand-logo-wrapper">
              <img src={brand.logo} alt={brand.name} className="brand-logo-img" />
            </div>
            <h3 className="brand-name">{brand.name}</h3>
            <p className="brand-description">{brand.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandSelector;
