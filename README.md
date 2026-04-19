# İş Ortaklığı Takvimi ve Not Sistemi

İş ortakları arasında toplantıları ve notları yönetmek için Next.js 14, Tailwind CSS ve Framer Motion ile oluşturulmuş işbirlikçi bir takvim uygulaması.

## Özellikler

- **İnteraktif Takvim**: date-fns ile oluşturulmuş özel takvim ızgarası
- **Yan Panel Detayları**: Herhangi bir güne tıklayarak notlar/toplantılar görüntüleme ve ekleme
- **Kayıt Türleri**: 'Toplantı' ve 'Not' kayıtları için destek
- **Gerçek Zamanlı Hazır**: Kolay Supabase Gerçek Zamanlı entegrasyonu için yapılandırılmış
- **Modern Arayüz**: Turuncu/mavi vurgu renkleri ile temiz dashboard tasarımı
- **Akıcı Animasyonlar**: Framer Motion ile yumuşak geçişler

## Teknoloji Yığını

- **Next.js 14** - App Router ile React framework
- **TypeScript** - Tür güvenli geliştirme
- **Tailwind CSS** - Utility-first stil
- **Shadcn UI** - Güzel, erişilebilir bileşenler
- **Lucide React** - Modern ikon kütüphanesi
- **Framer Motion** - Akıcı animasyonlar
- **date-fns** - Tarih manipülasyon araçları

## Başlarken

### Ön Koşullar

- Node.js 18+ yüklü
- npm veya yarn paket yöneticisi

### Kurulum

1. Proje dizinine kopyalayın veya gidin
2. Bağımlılıkları yükleyin:

```bash
npm install
```

3. Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

4. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın

## Proje Yapısı

```
calendar/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Kök layout ve fontlar
│   │   ├── page.tsx            # Takvim ile ana sayfa
│   │   └── globals.css         # Global stiller ve Tailwind
│   ├── components/
│   │   ├── Calendar.tsx        # Ana takvim bileşeni
│   │   └── SidePanel.tsx       # Gün detayları için yan panel
│   ├── lib/
│   │   ├── utils.ts            # Yardımcı fonksiyonlar (cn, formatDateKey)
│   │   └── supabase.ts         # Supabase entegrasyon yapısı
│   └── types/
│       └── index.ts            # TypeScript tipleri
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Veri Modeli

Her takvim kaydı şunları içerir:

```typescript
interface CalendarEntry {
  id: string;
  type: 'Meeting' | 'Note';
  content: string;
  time: string; // HH:mm format
  createdBy: string;
  date: string; // ISO date (YYYY-MM-DD)
  createdAt: string; // ISO timestamp
}
```

## Supabase Gerçek Zamanlı Entegrasyonu

Proje, işbirlikçi özellikler için Supabase Gerçek Zamanlı ile kolayca entegre olacak şekilde yapılandırılmıştır:

1. Supabase istemcisini yükleyin:
```bash
npm install @supabase/supabase-js
```

2. `.env.local` dosyası oluşturun:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Supabase'te `calendar_entries` tablosu oluşturun (schema `CalendarEntry` tipiyle eşleşmelidir).

4. `src/lib/supabase.ts` içindeki kodu uncomment edin ve yapılandırın.

5. `Calendar.tsx` içindeki yerel durum yönetimini Supabase fonksiyonlarıyla değiştirin.

Detaylı entegrasyon talimatları için `src/lib/supabase.ts` dosyasına bakın.

## Özelleştirme

### Renkler

Vurgu renkleri `src/app/globals.css` içinde tanımlanmıştır. Değiştirmek için:
- Turuncu vurgu: `--primary` HSL değerlerini değiştirin
- Mavi vurgu: Notlar için kullanılır, bileşen stillerinde özelleştirilebilir

### Ortak İsimleri

Şu anda "Ortak 1" olarak sabitlenmiştir. Ortak seçimi eklemek için:
1. SidePanel içine bir ortak seçici ekleyin
2. `createdBy` durumunu seçili ortak kullanacak şekilde güncelleyin

## Scriptler

- `npm run dev` - Geliştirme sunucusunu başlat
- `npm run build` - Production için build
- `npm run start` - Production sunucusunu başlat
- `npm run lint` - ESLint çalıştır

## Lisans

MIT
