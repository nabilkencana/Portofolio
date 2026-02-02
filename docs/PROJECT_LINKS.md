# 🔗 Fitur Klik Proyek

## Overview

Setiap card proyek di halaman Projects dapat diklik untuk membuka website, demo, atau repository proyek di tab baru.

## Cara Kerja

### 1. Menambahkan URL ke Proyek

Edit file `src/data/projectData.js` dan tambahkan property `url`:

```javascript
export const projectData = [
  {
    image: website_wayang,
    title: "Website Wayang Interaktif",
    subtitle: "ReactJS • TailwindCSS",
    borderColor: "#F97316",
    gradient: "linear-gradient(160deg,#F97316 0%,#000 70%)",
    url: "https://wayang-interaktif.vercel.app", // ← Tambahkan ini
  },
  // ... proyek lainnya
];
```

### 2. Jenis URL yang Bisa Digunakan

#### Website Live
```javascript
url: "https://your-project.vercel.app"
url: "https://your-project.netlify.app"
url: "https://your-domain.com"
```

#### GitHub Repository
```javascript
url: "https://github.com/username/project-name"
```

#### Demo Video
```javascript
url: "https://youtube.com/watch?v=VIDEO_ID"
url: "https://vimeo.com/VIDEO_ID"
```

#### Design/Prototype
```javascript
url: "https://figma.com/file/..."
url: "https://dribbble.com/shots/..."
```

#### Documentation
```javascript
url: "https://docs.your-project.com"
```

## Visual Feedback

### Hover State
- Card scale up (105%)
- Shadow menjadi lebih besar
- Spotlight effect mengikuti mouse
- Icon "Klik untuk membuka" muncul
- Opacity text meningkat

### Click State
- Card scale down (95%) saat diklik
- Smooth transition
- Tab baru terbuka otomatis

### CSS Classes
```css
/* Hover */
hover:scale-105
hover:shadow-2xl
group-hover:opacity-100

/* Active (saat diklik) */
active:scale-95

/* Transition */
transition-all duration-300
```

## Implementasi Teknis

### Component: ChromaGrid.jsx

```javascript
const handleCardClick = (url, e) => {
  if (url) {
    // Buka URL di tab baru dengan security
    window.open(url, "_blank", "noopener,noreferrer");
  }
};

// Di JSX
<article
  onClick={(e) => handleCardClick(c.url, e)}
  className="cursor-pointer hover:scale-105 active:scale-95"
>
  {/* Card content */}
  {c.url && (
    <div className="flex items-center gap-2">
      <ExternalLinkIcon />
      <span>Klik untuk membuka</span>
    </div>
  )}
</article>
```

### Security Features

1. **noopener**: Mencegah tab baru mengakses `window.opener`
2. **noreferrer**: Tidak mengirim referrer header
3. **_blank**: Buka di tab baru

## Customization

### Mengubah Behavior

#### Buka di Tab yang Sama
```javascript
const handleCardClick = (url, e) => {
  if (url) {
    window.location.href = url; // Buka di tab yang sama
  }
};
```

#### Konfirmasi Sebelum Buka
```javascript
const handleCardClick = (url, e) => {
  if (url) {
    if (confirm('Buka proyek ini?')) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }
};
```

#### Toast Notification
```javascript
const handleCardClick = (url, e) => {
  if (url) {
    showToast('Membuka proyek...');
    window.open(url, "_blank", "noopener,noreferrer");
  }
};
```

### Mengubah Icon

Edit `src/components/ui/ChromaGrid.jsx`:

```jsx
{c.url && (
  <div className="flex items-center gap-2">
    {/* Ganti dengan icon lain */}
    <svg>...</svg>
    <span>Custom text</span>
  </div>
)}
```

### Mengubah Hover Effect

```css
/* Lebih subtle */
hover:scale-102

/* Lebih dramatic */
hover:scale-110

/* Tanpa scale */
hover:shadow-2xl hover:brightness-110
```

## Troubleshooting

### URL Tidak Terbuka

**Problem**: Klik card tidak membuka URL

**Solusi**:
1. Cek apakah property `url` ada di data
2. Cek console browser untuk error
3. Pastikan URL valid (dimulai dengan http:// atau https://)

```javascript
// ❌ Salah
url: "google.com"

// ✅ Benar
url: "https://google.com"
```

### Pop-up Blocker

**Problem**: Browser block pop-up

**Solusi**:
- Pastikan user action (click) yang trigger `window.open()`
- Jangan panggil `window.open()` di async function
- Gunakan `window.location.href` sebagai fallback

```javascript
const handleCardClick = (url, e) => {
  if (url) {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    
    // Fallback jika pop-up diblock
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      window.location.href = url;
    }
  }
};
```

### Card Tidak Clickable

**Problem**: Card tidak merespon klik

**Solusi**:
1. Cek z-index element di atas card
2. Pastikan `cursor-pointer` class ada
3. Cek apakah ada `pointer-events-none`

## Best Practices

### 1. Selalu Gunakan HTTPS
```javascript
// ✅ Good
url: "https://your-project.com"

// ❌ Bad
url: "http://your-project.com"
```

### 2. Validasi URL
```javascript
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

// Gunakan saat menambahkan data
if (isValidUrl(projectUrl)) {
  // Add to projectData
}
```

### 3. Fallback untuk Proyek Tanpa URL
```javascript
{
  image: project1,
  title: "Private Project",
  subtitle: "NDA Project",
  // Tidak ada URL - card tetap tampil tapi tidak clickable
}
```

### 4. Analytics Tracking
```javascript
const handleCardClick = (url, projectTitle, e) => {
  if (url) {
    // Track click event
    gtag('event', 'project_click', {
      project_name: projectTitle,
      project_url: url
    });
    
    window.open(url, "_blank", "noopener,noreferrer");
  }
};
```

## Accessibility

### Keyboard Navigation
Card sudah support keyboard navigation:
- **Tab**: Focus ke card
- **Enter/Space**: Buka URL

### Screen Reader
Tambahkan aria-label untuk accessibility:

```jsx
<article
  onClick={(e) => handleCardClick(c.url, e)}
  aria-label={`Buka proyek ${c.title}`}
  role="button"
  tabIndex={0}
>
```

## Future Enhancements

- [ ] Preview modal sebelum buka URL
- [ ] Copy URL to clipboard option
- [ ] Share button (social media)
- [ ] QR code generator untuk mobile
- [ ] Analytics dashboard untuk track clicks
- [ ] Rate limiting untuk prevent spam clicks

## Related Files

- `src/components/ui/ChromaGrid.jsx` - Main component
- `src/data/projectData.js` - Project data dengan URLs
- `src/pages/Projects.jsx` - Projects page

## Support

Jika ada pertanyaan atau issue, silakan buat issue di GitHub repository.
