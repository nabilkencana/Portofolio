// utils/imageOptimizer.js

const CLOUDINARY_CLOUD_NAME = 'dsk5gf5oy'; // Ganti dengan cloud name Anda

export const optimizeImage = (imageUrl, options = {}) => {
    const {
        width = 1200,
        quality = 'auto',
        format = 'auto'
    } = options;

    // Jika sudah Cloudinary URL, optimasi parameter
    if (imageUrl.includes('cloudinary.com')) {
        return imageUrl.replace('/upload/', `/upload/q_${quality},f_${format},w_${width}/`);
    }

    // Jika gambar lokal di public folder
    if (imageUrl.startsWith('/')) {
        // Dalam Next.js, gunakan next/image
        return imageUrl;
    }

    // Fallback: tambahkan parameter cache busting
    return `${imageUrl}?w=${width}&q=${quality}&format=${format}`;
};

export const preloadImages = (urls) => {
    return Promise.all(
        urls.map(url => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = url;
                img.onload = resolve;
                img.onerror = reject;
            });
        })
    );
};

export const getImageSize = async (url) => {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        const size = response.headers.get('content-length');
        return size ? parseInt(size) : null;
    } catch {
        return null;
    }
};

export const compressImageLocally = async (file) => {
    // Kompresi gambar di client-side untuk upload
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Max dimensions
                const MAX_WIDTH = 1200;
                const MAX_HEIGHT = 1200;

                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => resolve(blob),
                    'image/jpeg',
                    0.7 // 70% quality
                );
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
};