# 🚀 Quick Start Guide

## Instalasi Cepat

```bash
# 1. Clone repository
git clone <repository-url>
cd portfolio-reactjs

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env
# Edit .env dan isi dengan API keys Anda

# 4. Jalankan development server
npm run dev
```

## 📸 Menambahkan Gambar ke Gallery

### Langkah 1: Tambahkan gambar ke folder
```
src/assets/gallery/gambar-baru.jpg
```

### Langkah 2: Import di `galleryData.js`
```javascript
import gambarBaru from '../assets/gallery/gambar-baru.jpg';
```

### Langkah 3: Tambahkan ke array
```javascript
const galleryData = [
  // ... gambar lain
  {
    image: gambarBaru,
    title: "Judul Gambar",
    description: "Deskripsi gambar",
  },
];
```

**Catatan**: Gambar akan otomatis dikompres dan dioptimasi saat di-load! 🎉

## 🎨 Mengganti Tema Warna

Edit `src/App.jsx`:
```javascript
const [activeColor, setActiveColor] = useState("emerald"); 
// Pilihan: "emerald", "sky", "violet", "amber", "red"
```

## 📝 Menambahkan Proyek Baru

Edit `src/data/projectData.js`:
```javascript
{
  image: gambarProyek,
  title: "Nama Proyek",
  subtitle: "Tech Stack",
  borderColor: "#10b981",
  gradient: "linear-gradient(160deg,#10b981 0%,#000 70%)",
}
```

## 🏆 Menambahkan Achievement

Edit `src/data/achievementsData.js`:
```javascript
{
  title: "Nama Achievement",
  description: "Deskripsi achievement",
  tech: ["Tag1", "Tag2"],
  image: gambarSertifikat,
}
```

## ⚙️ Konfigurasi Optimasi Gambar

Edit `src/config/imageConfig.js` untuk mengubah:
- Jumlah gambar prioritas
- Quality kompresi
- Max width gambar
- Timeout loading

```javascript
export const IMAGE_CONFIG = {
  PRIORITY_COUNT: 3,  // Ubah jumlah gambar prioritas
  QUALITY: {
    fast: {
      mobile: 0.75,   // Ubah quality untuk mobile
      desktop: 0.85,  // Ubah quality untuk desktop
    },
  },
};
```

## 🔧 Troubleshooting

### Gambar tidak muncul
1. Pastikan path import benar
2. Cek console browser untuk error
3. Pastikan format gambar didukung (JPG, PNG, WebP)

### Loading lambat
1. Kurangi `PRIORITY_COUNT` di config
2. Turunkan `QUALITY` di config
3. Resize gambar sebelum upload (max 2MB)

### Build error
```bash
# Clear cache dan reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📱 Testing

### Test di berbagai device
```bash
# Mobile
npm run dev -- --host

# Akses dari device lain di network yang sama:
# http://<your-ip>:5173
```

### Test performa
1. Buka Chrome DevTools
2. Tab Network → Throttling → Fast 3G
3. Reload page dan lihat loading time

## 🚀 Deploy

### Build untuk production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

### Deploy ke Vercel/Netlify
1. Push ke GitHub
2. Connect repository di Vercel/Netlify
3. Set environment variables
4. Deploy!

## 💡 Tips

- **Gambar besar?** Kompres dulu dengan [TinyPNG](https://tinypng.com)
- **Banyak gambar?** Pertimbangkan pagination
- **Slow loading?** Kurangi quality di config
- **Mobile first!** Test di mobile device dulu

## 📚 Dokumentasi Lengkap

- [README.md](README.md) - Dokumentasi utama
- [IMAGE_OPTIMIZATION.md](docs/IMAGE_OPTIMIZATION.md) - Detail optimasi gambar

## 🆘 Butuh Bantuan?

- Cek [Issues](https://github.com/your-repo/issues)
- Baca dokumentasi di folder `docs/`
- Contact: [email]

---

Happy coding! 🎉
