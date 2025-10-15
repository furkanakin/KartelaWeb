# 🎨 Kartela - Boya Renk Simülatörü

Modern, kullanıcı dostu bir boya kartela ve renk simülasyon web uygulaması. İç cephe, dış cephe ve mobilya boyaları için fotoğraf tabanlı renk önizleme sistemi.

## ✨ Özellikler

- **3 Ana Kategori:**
  - 🏠 İç Cephe (Duvar boyaları)
  - 🏢 Dış Cephe (Bina dış yüzey boyaları)
  - 🪑 Mobilya (Ahşap yüzey boyaları)

- **Kartela Sistemi:**
  - Kategoriye özel renk koleksiyonları
  - RGB ve HEX kod desteği
  - Desen/doku görselleri için destek
  - Fiziksel kartelalara benzer görsel tasarım

- **Fotoğraf İşleme:**
  - Fotoğraf yükleme (drag & drop)
  - Seçili rengin fotoğraf üzerine uygulanması
  - Orijinal vs İşlenmiş karşılaştırma
  - İşlenmiş fotoğrafı indirme

- **Modern Arayüz:**
  - Responsive tasarım (mobil uyumlu)
  - Renk odaklı görsel hiyerarşi
  - Smooth animasyonlar
  - Kullanıcı dostu navigasyon

## 🛠️ Teknolojiler

- **Frontend:**
  - React 18
  - TypeScript
  - Vite
  - CSS3 (Modern animations)

- **Backend Entegrasyon:**
  - n8n webhook desteği
  - Axios HTTP client
  - Mock API (test için)

## 📦 Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Ortam Değişkenlerini Ayarlayın

`.env.example` dosyasını `.env` olarak kopyalayın:

```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin ve n8n webhook URL'inizi girin:

```env
VITE_N8N_WEBHOOK_URL=http://your-n8n-instance.com/webhook/process-image
VITE_USE_MOCK_API=false
```

### 3. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

## 🔧 n8n Backend Entegrasyonu

### Gerekli n8n Workflow Yapısı

n8n'de aşağıdaki yapıda bir workflow oluşturmanız gerekiyor:

1. **Webhook Node:** POST isteği alır
2. **Image Processing Node:** Görüntü işleme yapar
3. **Response Node:** İşlenmiş görüntüyü döner

### Beklenen API Format

**Request:**
```json
{
  "image": "base64_encoded_image_data",
  "color": {
    "id": "c1",
    "name": "Kar Beyazı",
    "code": "KB-100",
    "rgb": { "r": 255, "g": 255, "b": 255 },
    "hex": "#FFFFFF"
  },
  "category": "ic-cephe"
}
```

**Response:**
```json
{
  "processedImage": "base64_encoded_processed_image",
  "success": true
}
```

### Mock Mode (Test İçin)

n8n backend'i hazır değilse mock mode'u aktif edebilirsiniz:

```env
VITE_USE_MOCK_API=true
```

Bu modda gerçek renklendirme yapılmaz, orijinal fotoğraf döndürülür.

## 📁 Proje Yapısı

```
KartelaWeb/
├── src/
│   ├── components/          # React bileşenleri
│   │   ├── CategorySelector.tsx
│   │   ├── PaletteDisplay.tsx
│   │   ├── PhotoUploader.tsx
│   │   └── PreviewArea.tsx
│   ├── data/                # Kartela verileri
│   │   └── palettes.ts
│   ├── services/            # API servisleri
│   │   └── api.ts
│   ├── types/               # TypeScript tip tanımları
│   │   └── index.ts
│   ├── App.tsx              # Ana uygulama
│   ├── App.css
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎨 Kartela Yönetimi

Yeni renk veya kartela eklemek için `src/data/palettes.ts` dosyasını düzenleyin:

```typescript
{
  id: 'c21',
  name: 'Yeni Renk',
  code: 'YR-100',
  rgb: { r: 100, g: 150, b: 200 },
  hex: '#6496C8'
}
```

## 🚀 Production Build

```bash
npm run build
```

Build dosyaları `dist/` klasöründe oluşturulacaktır.

## 🔍 Geliştirme Notları

### Yeni Kategori Eklemek

1. `src/types/index.ts` içinde `CategoryType` union'ına yeni kategori ekleyin
2. `src/data/palettes.ts` içinde yeni kategori ve kartela verilerini ekleyin
3. `src/components/PhotoUploader.tsx` içinde kategori açıklaması ekleyin

### Renk İşleme Algoritması

Gerçek renk işleme n8n backend'inde yapılmalıdır. Önerilen yaklaşımlar:
- OpenCV ile renk değiştirme
- AI tabanlı segmentasyon (duvar/cephe/ahşap tespiti)
- HSV renk uzayında manipülasyon

## 📝 Lisans

Bu proje özel bir projedir.

## 🤝 Destek

Sorularınız için iletişime geçin.

---

**Not:** Bu uygulama n8n backend gerektirmektedir. Backend hazır olmadan mock mode kullanabilirsiniz.
