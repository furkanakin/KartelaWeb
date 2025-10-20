import { Category, CategoryType } from '../types';
import './CategorySelector.css';

interface CategorySelectorProps {
  categories: Category[];
  onSelect: (categoryId: CategoryType) => void;
}

const CategorySelector = ({ categories, onSelect }: CategorySelectorProps) => {
  return (
    <div className="category-selector">
      <h2 className="selector-title">Kategori Seçiniz</h2>
      <p className="selector-subtitle">
        Renklendirmek istediğiniz alanı seçerek başlayın
      </p>

      <div className="category-grid">
        {categories.map((category) => (
          <div
            key={category.id}
            className="category-card"
            onClick={() => onSelect(category.id)}
          >
            <div className="category-icon">{category.icon}</div>
            <h3 className="category-name">{category.name}</h3>
            <p className="category-desc">{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
