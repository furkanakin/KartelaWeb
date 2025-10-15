import { Category } from '../types';

export const categories: Category[] = [
  {
    id: 'ic-cephe',
    name: 'İç Cephe',
    description: 'Duvarlarınız için özel iç cephe renkleri',
    icon: '🏠',
    palettes: [
      {
        id: 'ic-modern',
        name: 'Modern Koleksiyonu',
        category: 'ic-cephe',
        description: 'Çağdaş ve şık iç mekan renkleri',
        colors: [
          {
            id: 'c1',
            name: 'Kar Beyazı',
            code: 'KB-100',
            rgb: { r: 255, g: 255, b: 255 },
            hex: '#FFFFFF'
          },
          {
            id: 'c2',
            name: 'Krem',
            code: 'KR-200',
            rgb: { r: 245, g: 240, b: 230 },
            hex: '#F5F0E6'
          },
          {
            id: 'c3',
            name: 'Bej',
            code: 'BJ-300',
            rgb: { r: 220, g: 210, b: 195 },
            hex: '#DCD2C3'
          },
          {
            id: 'c4',
            name: 'Açık Gri',
            code: 'AG-400',
            rgb: { r: 200, g: 200, b: 200 },
            hex: '#C8C8C8'
          },
          {
            id: 'c5',
            name: 'Koyu Gri',
            code: 'KG-500',
            rgb: { r: 120, g: 120, b: 120 },
            hex: '#787878'
          }
        ]
      },
      {
        id: 'ic-pastel',
        name: 'Pastel Koleksiyonu',
        category: 'ic-cephe',
        description: 'Yumuşak ve huzurlu pastel tonlar',
        colors: [
          {
            id: 'c6',
            name: 'Pudra',
            code: 'PD-100',
            rgb: { r: 255, g: 220, b: 225 },
            hex: '#FFDCE1'
          },
          {
            id: 'c7',
            name: 'Mint',
            code: 'MN-200',
            rgb: { r: 200, g: 240, b: 230 },
            hex: '#C8F0E6'
          },
          {
            id: 'c8',
            name: 'Lila',
            code: 'LL-300',
            rgb: { r: 230, g: 220, b: 245 },
            hex: '#E6DCF5'
          },
          {
            id: 'c9',
            name: 'Açık Mavi',
            code: 'AM-400',
            rgb: { r: 210, g: 230, b: 250 },
            hex: '#D2E6FA'
          },
          {
            id: 'c10',
            name: 'Şeftali',
            code: 'SF-500',
            rgb: { r: 255, g: 230, b: 210 },
            hex: '#FFE6D2'
          }
        ]
      }
    ]
  },
  {
    id: 'dis-cephe',
    name: 'Dış Cephe',
    description: 'Binanızın dış yüzeyi için dayanıklı renkler',
    icon: '🏢',
    palettes: [
      {
        id: 'dis-klasik',
        name: 'Klasik Dış Cephe',
        category: 'dis-cephe',
        description: 'Zamansız ve dayanıklı dış cephe renkleri',
        colors: [
          {
            id: 'c11',
            name: 'Kırık Beyaz',
            code: 'DC-KB-100',
            rgb: { r: 250, g: 248, b: 245 },
            hex: '#FAF8F5'
          },
          {
            id: 'c12',
            name: 'Toprak',
            code: 'DC-TP-200',
            rgb: { r: 180, g: 150, b: 120 },
            hex: '#B49678'
          },
          {
            id: 'c13',
            name: 'Taş Gri',
            code: 'DC-TG-300',
            rgb: { r: 150, g: 145, b: 140 },
            hex: '#96918C'
          },
          {
            id: 'c14',
            name: 'Koyu Bej',
            code: 'DC-KB-400',
            rgb: { r: 170, g: 155, b: 130 },
            hex: '#AA9B82'
          },
          {
            id: 'c15',
            name: 'Antrasit',
            code: 'DC-AN-500',
            rgb: { r: 80, g: 80, b: 85 },
            hex: '#505055'
          }
        ]
      }
    ]
  },
  {
    id: 'mobilya',
    name: 'Mobilya',
    description: 'Ahşap yüzeyler için özel mobilya boyaları',
    icon: '🪑',
    palettes: [
      {
        id: 'mob-ahsap',
        name: 'Ahşap Tonları',
        category: 'mobilya',
        description: 'Doğal ahşap görünümü veren renkler',
        colors: [
          {
            id: 'c16',
            name: 'Açık Meşe',
            code: 'AM-100',
            rgb: { r: 220, g: 190, b: 150 },
            hex: '#DCBE96'
          },
          {
            id: 'c17',
            name: 'Ceviz',
            code: 'CV-200',
            rgb: { r: 140, g: 100, b: 70 },
            hex: '#8C6446'
          },
          {
            id: 'c18',
            name: 'Koyu Ceviz',
            code: 'KCV-300',
            rgb: { r: 90, g: 60, b: 40 },
            hex: '#5A3C28'
          },
          {
            id: 'c19',
            name: 'Beyaz Lake',
            code: 'BL-400',
            rgb: { r: 248, g: 248, b: 250 },
            hex: '#F8F8FA'
          },
          {
            id: 'c20',
            name: 'Antik Kahve',
            code: 'AK-500',
            rgb: { r: 120, g: 85, b: 60 },
            hex: '#78553C'
          }
        ]
      }
    ]
  }
];
