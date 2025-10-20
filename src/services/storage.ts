import { categories as defaultCategories } from '../data/palettes';

const STORAGE_KEYS = {
  CATEGORIES: 'kartela_categories',
  PALETTES: 'kartela_palettes',
  BRANDS: 'kartela_brands',
  WHATSAPP: 'kartela_whatsapp_settings',
};

// Initialize localStorage with default data if empty
export const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    // Transform default data to admin format
    const adminCategories = defaultCategories.map(cat => ({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      icon: cat.icon,
      order: 0,
    }));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(adminCategories));
  }

  if (!localStorage.getItem(STORAGE_KEYS.PALETTES)) {
    // Transform palettes to admin format
    const adminPalettes: any[] = [];
    defaultCategories.forEach(cat => {
      cat.palettes.forEach(palette => {
        adminPalettes.push({
          id: palette.id,
          name: palette.name,
          categoryId: cat.id,
          brandId: '',
          description: palette.description,
          items: palette.colors.map(color => ({
            type: 'color' as const,
            data: color,
          })),
          webhook: {
            testUrl: '',
            liveUrl: '',
            mode: 'test',
            enabled: false,
          },
          photoUploadEnabled: true, // Varsayılan olarak aktif
          productName: '',
          productImage: '',
        });
      });
    });
    localStorage.setItem(STORAGE_KEYS.PALETTES, JSON.stringify(adminPalettes));
  }

  if (!localStorage.getItem(STORAGE_KEYS.BRANDS)) {
    // Initialize brands with dummy data
    const defaultBrands = [
      {
        id: 'dufa',
        name: 'Düfa',
        description: 'Alman kalitesi ve güvenilirliği',
        logo: 'https://via.placeholder.com/150x80/007a2d/FFFFFF?text=DÜFA',
        order: 0,
      },
      {
        id: 'marshall',
        name: 'Marshall',
        description: 'Profesyonel boya çözümleri',
        logo: 'https://via.placeholder.com/150x80/c41e3a/FFFFFF?text=Marshall',
        order: 1,
      },
      {
        id: 'fawori',
        name: 'Fawori',
        description: 'Yenilikçi ve kaliteli ürünler',
        logo: 'https://via.placeholder.com/150x80/1e4d8b/FFFFFF?text=Fawori',
        order: 2,
      },
    ];
    localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(defaultBrands));
  }

  if (!localStorage.getItem(STORAGE_KEYS.WHATSAPP)) {
    // Initialize WhatsApp settings with defaults
    const defaultWhatsAppSettings = {
      enabled: false,
      phoneNumber: '',
      defaultMessage: 'Merhaba, Kartela uygulaması hakkında bilgi almak istiyorum.',
    };
    localStorage.setItem(STORAGE_KEYS.WHATSAPP, JSON.stringify(defaultWhatsAppSettings));
  }
};

// Categories CRUD
export const getCategories = () => {
  const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  return data ? JSON.parse(data) : [];
};

export const getCategory = (id: string) => {
  const categories = getCategories();
  return categories.find((cat: any) => cat.id === id);
};

export const createCategory = (category: any) => {
  const categories = getCategories();
  categories.push(category);
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  return category;
};

export const updateCategory = (id: string, updatedCategory: any) => {
  const categories = getCategories();
  const index = categories.findIndex((cat: any) => cat.id === id);
  if (index !== -1) {
    categories[index] = { ...categories[index], ...updatedCategory };
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    return categories[index];
  }
  throw new Error('Category not found');
};

export const deleteCategory = (id: string) => {
  const categories = getCategories();
  const filtered = categories.filter((cat: any) => cat.id !== id);
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filtered));
  return true;
};

// Palettes CRUD
export const getPalettes = () => {
  const data = localStorage.getItem(STORAGE_KEYS.PALETTES);
  return data ? JSON.parse(data) : [];
};

export const getPalette = (id: string) => {
  const palettes = getPalettes();
  return palettes.find((pal: any) => pal.id === id);
};

export const createPalette = (palette: any) => {
  const palettes = getPalettes();
  palettes.push(palette);
  localStorage.setItem(STORAGE_KEYS.PALETTES, JSON.stringify(palettes));
  return palette;
};

export const updatePalette = (id: string, updatedPalette: any) => {
  const palettes = getPalettes();
  const index = palettes.findIndex((pal: any) => pal.id === id);
  if (index !== -1) {
    palettes[index] = { ...palettes[index], ...updatedPalette };
    localStorage.setItem(STORAGE_KEYS.PALETTES, JSON.stringify(palettes));
    return palettes[index];
  }
  throw new Error('Palette not found');
};

export const deletePalette = (id: string) => {
  const palettes = getPalettes();
  const filtered = palettes.filter((pal: any) => pal.id !== id);
  localStorage.setItem(STORAGE_KEYS.PALETTES, JSON.stringify(filtered));
  return true;
};

// Brands CRUD
export const getBrands = () => {
  const data = localStorage.getItem(STORAGE_KEYS.BRANDS);
  return data ? JSON.parse(data) : [];
};

export const getBrand = (id: string) => {
  const brands = getBrands();
  return brands.find((brand: any) => brand.id === id);
};

export const createBrand = (brand: any) => {
  const brands = getBrands();
  brands.push(brand);
  localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(brands));
  return brand;
};

export const updateBrand = (id: string, updatedBrand: any) => {
  const brands = getBrands();
  const index = brands.findIndex((brand: any) => brand.id === id);
  if (index !== -1) {
    brands[index] = { ...brands[index], ...updatedBrand };
    localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(brands));
    return brands[index];
  }
  throw new Error('Brand not found');
};

export const deleteBrand = (id: string) => {
  const brands = getBrands();
  const filtered = brands.filter((brand: any) => brand.id !== id);
  localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(filtered));
  return true;
};

// WhatsApp Settings
export const getWhatsAppSettings = () => {
  const data = localStorage.getItem(STORAGE_KEYS.WHATSAPP);
  return data ? JSON.parse(data) : { enabled: false, phoneNumber: '', defaultMessage: '' };
};

export const updateWhatsAppSettings = (settings: any) => {
  localStorage.setItem(STORAGE_KEYS.WHATSAPP, JSON.stringify(settings));
  return settings;
};

// Clear all data (for reset)
export const clearStorage = () => {
  localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
  localStorage.removeItem(STORAGE_KEYS.PALETTES);
  localStorage.removeItem(STORAGE_KEYS.BRANDS);
  localStorage.removeItem(STORAGE_KEYS.WHATSAPP);
};
