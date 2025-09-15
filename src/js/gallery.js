// js/gallery.js
export default function initGallery({
  gallerySelector = '.dwimage-gallery',
  bandNames = [],
  shuffleBtnSelector = '#shuffleBtn',
  resetBtnSelector = '#resetBtn'
} = {}) {
  const gallery = document.querySelector(gallerySelector);
  if (!gallery) {
    console.warn('gallery not found:', gallerySelector);
    return { error: 'gallery-not-found' };
  }

  const imgsNodeList = Array.from(gallery.querySelectorAll('img'));
  const items = imgsNodeList.map((img, idx) => {
    const src = img.getAttribute('src');
    const alt = img.getAttribute('alt') || '';
    const fallback = src.split('/').pop();
    return {
      src,
      alt,
      bandName: (bandNames[idx] !== undefined && bandNames[idx] !== null && bandNames[idx] !== '')
                ? bandNames[idx]
                : (alt || fallback)
    };
  });

  const original = items.slice();

  function shuffleArray(a) {
    const arr = a.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function render(list) {
    gallery.innerHTML = '';
    list.forEach(it => {
      const fig = document.createElement('figure');
      fig.className = 'dw-figure';

      const img = document.createElement('img');
      img.className = 'dw-cover';
      img.src = it.src;
      img.alt = it.alt;
      img.loading = 'lazy';

      const cap = document.createElement('figcaption');
      cap.className = 'dw-caption';
      cap.textContent = it.bandName;

      fig.appendChild(img);
      fig.appendChild(cap);
      gallery.appendChild(fig);
    });
  }

  render(items);

  let shuffleBtn = document.querySelector(shuffleBtnSelector);
  let resetBtn = document.querySelector(resetBtnSelector);

  shuffleBtn.addEventListener('click', () => render(shuffleArray(items)));
  resetBtn.addEventListener('click', () => render(original));

  return {
    render,
    shuffle: () => render(shuffleArray(items)),
    reset: () => render(original),
    items,
    original
  };
}

