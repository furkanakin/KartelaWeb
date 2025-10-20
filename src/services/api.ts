import axios from 'axios';
import { ImageProcessingRequest, ImageProcessingResponse } from '../types';
import { getPalettes } from './storage';

export const processImage = async (
  request: ImageProcessingRequest
): Promise<ImageProcessingResponse> => {
  try {
    // Paleti bul ve webhook ayarlarını al
    const palettes = getPalettes();
    const palette = palettes.find((p: any) =>
      p.items.some((item: any) =>
        item.data.id === (request.color as any).id
      )
    );

    if (!palette || !palette.webhook?.enabled) {
      throw new Error('Bu kartela için webhook aktif değil.');
    }

    // Webhook URL'ini mode'a göre seç
    let webhookUrl = palette.webhook.mode === 'test'
      ? palette.webhook.testUrl
      : palette.webhook.liveUrl;

    if (!webhookUrl) {
      throw new Error(`${palette.webhook.mode.toUpperCase()} webhook URL'si tanımlanmamış.`);
    }

    // Development ortamında proxy kullan (CORS bypass)
    const isDev = import.meta.env.DEV;
    if (isDev && webhookUrl.includes('n8n.kayalarai.com')) {
      // n8n URL'ini proxy URL'ine çevir
      webhookUrl = webhookUrl.replace('https://n8n.kayalarai.com', '/api/webhook');
    }

    // Seçili renk/pattern detaylarını hazırla
    const colorData = 'hex' in request.color ? {
      type: 'color',
      id: request.color.id,
      name: request.color.name,
      code: request.color.code,
      hex: request.color.hex,
      rgb: request.color.rgb,
    } : {
      type: 'pattern',
      id: request.color.id,
      name: request.color.name,
      patternType: request.color.type,
      imageUrl: request.color.imageUrl,
    };

    console.log('🚀 Webhook gönderiliyor:', webhookUrl);
    console.log('📦 Payload:', {
      category: request.category,
      palette: {
        id: palette.id,
        name: palette.name,
      },
      selectedItem: colorData,
      uploadedImage: request.image,
      webhookMode: palette.webhook.mode,
    });

    const response = await axios.post<any>(
      webhookUrl,
      {
        category: request.category,
        palette: {
          id: palette.id,
          name: palette.name,
        },
        selectedItem: colorData,
        uploadedImage: request.image,
        webhookMode: palette.webhook.mode,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 60000, // 60 saniye timeout
      }
    );

    console.log('✅ Webhook yanıtı:', response.data);

    // Response formatını normalize et - farklı formatlarda gelen görseli yakala
    let processedImageData = null;

    // Format 1: processedImage (base64 data URL)
    if (response.data.processedImage) {
      processedImageData = response.data.processedImage;
    }
    // Format 2: processedImageUrl (base64 data URL)
    else if (response.data.processedImageUrl) {
      processedImageData = response.data.processedImageUrl;
    }
    // Format 3: base64 string (mime type ile birleştir)
    else if (response.data.base64) {
      const mimeType = response.data.mimeType || 'image/png';
      processedImageData = `data:${mimeType};base64,${response.data.base64}`;
    }
    // Format 4: nested data.processedImage
    else if (response.data.data?.processedImage) {
      processedImageData = response.data.data.processedImage;
    }
    // Format 5: nested data.processedImageUrl
    else if (response.data.data?.processedImageUrl) {
      processedImageData = response.data.data.processedImageUrl;
    }

    if (processedImageData) {
      console.log('🖼️ İşlenmiş görsel hazır!');
      return {
        processedImage: processedImageData,
        success: true,
      };
    } else {
      console.error('❌ Desteklenmeyen yanıt formatı:', response.data);
      throw new Error('Webhook yanıtında işlenmiş görsel bulunamadı.');
    }
  } catch (error) {
    console.error('❌ Image processing error:', error);

    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('İşlem zaman aşımına uğradı. Lütfen tekrar deneyin.');
      }
      if (error.response?.status === 404) {
        throw new Error('Webhook bulunamadı. Lütfen URL\'yi kontrol edin.');
      }
      if (error.response?.status >= 500) {
        throw new Error('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
      }
    }

    throw error instanceof Error ? error : new Error('Görüntü işlenirken bir hata oluştu.');
  }
};

// Mock function for testing without n8n backend
export const mockProcessImage = async (
  request: ImageProcessingRequest
): Promise<ImageProcessingResponse> => {
  // Simüle edilmiş gecikme
  await new Promise(resolve => setTimeout(resolve, 2000));

  return {
    processedImage: request.image, // Gerçek uygulamada bu işlenmiş görüntü olacak
    success: true,
  };
};
