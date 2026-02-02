# 🔗 Cara Menambahkan Link ke Proyek

## Quick Guide (3 Langkah)

### 1️⃣ Buka File Data Proyek
```bash
src/data/projectData.js
```

### 2️⃣ Tambahkan Property `url`
```javascript
{
  image: website_wayang,
  title: "Website Wayang Interaktif",
  subtitle: "ReactJS • TailwindCSS",
  borderColor: "#F97316",
  gradient: "linear-gradient(160deg,#F97316 0%,#000 70%)",
  url: "https://wayang-interaktif.vercel.app", // ← Tambahkan ini!
}
```

### 3️⃣ Save & Test!
Klik card proyek di browser untuk test.

---

## Jenis URL yang Bisa Digunakan

### ✅ Website Live
```javascript
url: "https://my-project.vercel.app"
url: "https://my-project.netlify.app"
url: "https://my-domain.com"
```

### ✅ GitHub Repository
```javascript
url: "https://github.com/username/project-name"
```

### ✅ Demo Video
```javascript
url: "https://youtube.com/watch?v=VIDEO_ID"
```

### ✅ Design/Figma
```javascript
url: "https://figma.com/file/..."
```

### ✅ Documentation
```javascript
url: "https://docs.my-project.com"
```

---

## Contoh Lengkap

```javascript
export const projectData = [
  // Proyek dengan URL
  {
    image: website_ecommerce,
    title: "Toko Online",
    subtitle: "NextJS • Stripe • TailwindCSS",
    borderColor: "#10b981",
    gradient: "linear-gradient(160deg,#10b981 0%,#000 70%)",
    url: "https://toko-online.vercel.app", // ← URL website
  },
  
  // Proyek tanpa URL (private/NDA)
  {
    image: dashboard_enterprise,
    title: "Enterprise Dashboard",
    subtitle: "ReactJS • GraphQL • AWS",
    borderColor: "#3b82f6",
    gradient: "linear-gradient(160deg,#3b82f6 0%,#000 70%)",
    // Tidak ada URL - card tetap tampil tapi tidak clickable
  },
];
```

---

## Fitur yang Didapat

✨ **Hover Effect**
- Card membesar sedikit
- Shadow lebih besar
- Spotlight mengikuti mouse
- Text "Klik untuk membuka" muncul

🖱️ **Click Effect**
- Card mengecil saat diklik
- Buka URL di tab baru
- Smooth animation

🔒 **Security**
- Otomatis pakai `noopener` dan `noreferrer`
- Aman dari security vulnerabilities

---

## Tips

💡 **Prioritas URL**
Jika proyek punya banyak link, pilih yang paling penting:
1. Live website (paling prioritas)
2. GitHub repository
3. Demo video
4. Documentation

💡 **URL Harus Valid**
```javascript
// ❌ Salah
url: "google.com"

// ✅ Benar
url: "https://google.com"
```

💡 **Proyek Private**
Tidak punya URL? Tidak masalah! Cukup jangan tambahkan property `url`, card tetap tampil tapi tidak clickable.

---

## Troubleshooting

### ❓ URL tidak terbuka saat diklik
- Pastikan URL dimulai dengan `https://` atau `http://`
- Cek console browser untuk error
- Pastikan property `url` ditulis dengan benar

### ❓ Card tidak bisa diklik
- Pastikan property `url` ada di data proyek
- Cek apakah ada typo di property name
- Refresh browser (Ctrl+R atau Cmd+R)

---

## Butuh Bantuan?

📖 Dokumentasi lengkap: [docs/PROJECT_LINKS.md](docs/PROJECT_LINKS.md)

📝 Contoh template: [src/data/projectData.example.js](src/data/projectData.example.js)

🚀 Quick start: [QUICK_START.md](QUICK_START.md)

---

**Happy coding!** 🎉
