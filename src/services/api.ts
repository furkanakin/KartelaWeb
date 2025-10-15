import axios from 'axios';
import { ImageProcessingRequest, ImageProcessingResponse } from '../types';

// n8n backend URL - kullanıcı kendi n8n webhook URL'ini buraya girecek
const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/process-image';

export const processImage = async (
  request: ImageProcessingRequest
): Promise<ImageProcessingResponse> => {
  try {
    const response = await axios.post<ImageProcessingResponse>(
      N8N_WEBHOOK_URL,
      {
        image: request.image,
        color: request.color,
        category: request.category,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 saniye timeout
      }
    );

    return response.data;
  } catch (error) {
    console.error('Image processing error:', error);

    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('İşlem zaman aşımına uğradı. Lütfen tekrar deneyin.');
      }
      if (error.response?.status === 404) {
        throw new Error('n8n backend bulunamadı. Lütfen bağlantı ayarlarını kontrol edin.');
      }
      if (error.response?.status >= 500) {
        throw new Error('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
      }
    }

    throw new Error('Görüntü işlenirken bir hata oluştu. Lütfen tekrar deneyin.');
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
