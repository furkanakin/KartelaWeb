import express, { Response } from 'express';
import Category from '../models/Category.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { AuthRequest } from '../types/index.js';

const router = express.Router();

// Tüm kategorileri listele (public)
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const categories = await Category.find().sort({ order: 1 });
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// ID ile kategori getir (public)
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const category = await Category.findOne({ id: req.params.id });
    if (!category) {
      return res.status(404).json({ message: 'Kategori bulunamadı' });
    }
    res.json(category);
  } catch (error: any) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// Yeni kategori oluştur (admin only)
router.post('/', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id, name, description, icon, order } = req.body;

    // ID benzersiz mi kontrol et
    const existingCategory = await Category.findOne({ id });
    if (existingCategory) {
      return res.status(400).json({ message: 'Bu ID zaten kullanılıyor' });
    }

    const category = new Category({
      id,
      name,
      description,
      icon: icon || '📁',
      order: order || 0,
    });

    await category.save();
    res.status(201).json({ message: 'Kategori başarıyla oluşturuldu', category });
  } catch (error: any) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// Kategori güncelle (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, icon, order } = req.body;

    const category = await Category.findOneAndUpdate(
      { id: req.params.id },
      { name, description, icon, order },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Kategori bulunamadı' });
    }

    res.json({ message: 'Kategori başarıyla güncellendi', category });
  } catch (error: any) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// Kategori sil (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const category = await Category.findOneAndDelete({ id: req.params.id });

    if (!category) {
      return res.status(404).json({ message: 'Kategori bulunamadı' });
    }

    res.json({ message: 'Kategori başarıyla silindi' });
  } catch (error: any) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

export default router;
