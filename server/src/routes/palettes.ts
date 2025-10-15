import express, { Response } from 'express';
import Palette from '../models/Palette.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { AuthRequest } from '../types/index.js';
import axios from 'axios';

const router = express.Router();

// Webhook tetikleme fonksiyonu
const triggerWebhook = async (palette: any, action: 'created' | 'updated' | 'deleted') => {
  if (palette.webhook && palette.webhook.enabled && palette.webhook.url) {
    try {
      await axios.post(palette.webhook.url, {
        action,
        palette: {
          id: palette.id,
          name: palette.name,
          categoryId: palette.categoryId,
        },
        timestamp: new Date().toISOString(),
        mode: palette.webhook.mode,
      });
      console.log(`✅ Webhook tetiklendi: ${action} - ${palette.name}`);
    } catch (error: any) {
      console.error(`❌ Webhook hatası: ${error.message}`);
    }
  }
};

// Tüm kartelaları listele (public)
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { categoryId } = req.query;
    const filter = categoryId ? { categoryId } : {};
    const palettes = await Palette.find(filter).sort({ createdAt: -1 });
    res.json(palettes);
  } catch (error: any) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// ID ile kartela getir (public)
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const palette = await Palette.findOne({ id: req.params.id });
    if (!palette) {
      return res.status(404).json({ message: 'Kartela bulunamadı' });
    }
    res.json(palette);
  } catch (error: any) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// Yeni kartela oluştur (admin only)
router.post('/', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id, name, categoryId, description, items, webhook } = req.body;

    // ID benzersiz mi kontrol et
    const existingPalette = await Palette.findOne({ id });
    if (existingPalette) {
      return res.status(400).json({ message: 'Bu ID zaten kullanılıyor' });
    }

    const palette = new Palette({
      id,
      name,
      categoryId,
      description,
      items: items || [],
      webhook,
    });

    await palette.save();

    // Webhook tetikle
    await triggerWebhook(palette, 'created');

    res.status(201).json({ message: 'Kartela başarıyla oluşturuldu', palette });
  } catch (error: any) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// Kartela güncelle (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { name, categoryId, description, items, webhook } = req.body;

    const palette = await Palette.findOneAndUpdate(
      { id: req.params.id },
      { name, categoryId, description, items, webhook },
      { new: true, runValidators: true }
    );

    if (!palette) {
      return res.status(404).json({ message: 'Kartela bulunamadı' });
    }

    // Webhook tetikle
    await triggerWebhook(palette, 'updated');

    res.json({ message: 'Kartela başarıyla güncellendi', palette });
  } catch (error: any) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// Kartela sil (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const palette = await Palette.findOne({ id: req.params.id });

    if (!palette) {
      return res.status(404).json({ message: 'Kartela bulunamadı' });
    }

    // Webhook tetikle (silmeden önce)
    await triggerWebhook(palette, 'deleted');

    await Palette.findOneAndDelete({ id: req.params.id });

    res.json({ message: 'Kartela başarıyla silindi' });
  } catch (error: any) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// Webhook test et (admin only)
router.post('/:id/test-webhook', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const palette = await Palette.findOne({ id: req.params.id });

    if (!palette) {
      return res.status(404).json({ message: 'Kartela bulunamadı' });
    }

    if (!palette.webhook || !palette.webhook.url) {
      return res.status(400).json({ message: 'Webhook yapılandırılmamış' });
    }

    await triggerWebhook(palette, 'updated');

    res.json({ message: 'Webhook test edildi' });
  } catch (error: any) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

export default router;
