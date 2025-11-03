const fileInput = document.getElementById('fileInput');
const slidesEl = document.getElementById('slides');
const dotsEl = document.getElementById('dots');
const thumbsEl = document.getElementById('thumbs');
const emptyState = document.getElementById('emptyState');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const autoplayCheckbox = document.getElementById('autoplay');
const speedInput = document.getElementById('speed');
const clearBtn = document.getElementById('clearBtn');

let images = [
  { src: 'images/image.jpg' },
  { src: 'images/im3.jpg' },
  { src: 'images/im4.png' },
];

let index = 0;
let autoplayTimer = null;

function render() {
  slidesEl.innerHTML = '';
  dotsEl.innerHTML = '';
  thumbsEl.innerHTML = '';

  if (images.length === 0) {
    slidesEl.appendChild(emptyState);
    emptyState.style.display = 'flex';
    return;
  }

  emptyState.style.display = 'none';

  images.forEach((img, i) => {
    const slide = document.createElement('div');
    slide.className = 'slide';
    const imageEl = document.createElement('img');
    imageEl.src = img.src;
    slide.appendChild(imageEl);
    slidesEl.appendChild(slide);

    const dot = document.createElement('div');
    dot.className = 'dot' + (i === index ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);

    const thumb = document.createElement('div');
    thumb.className = 'thumb' + (i === index ? ' active' : '');
    const thumbImg = document.createElement('img');
    thumbImg.src = img.src;
    thumb.appendChild(thumbImg);
    thumb.addEventListener('click', () => goTo(i));
    thumbsEl.appendChild(thumb);
  });

  updatePosition();
}

function updatePosition() {
  const w = slidesEl.clientWidth;
  slidesEl.style.transform = `translateX(${-index * w}px)`;
  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === index));
  document.querySelectorAll('.thumb').forEach((t, i) => t.classList.toggle('active', i === index));
}

function prev() {
  if (images.length === 0) return;
  index = (index - 1 + images.length) % images.length;
  updatePosition();
  resetAutoplay();
}

function next() {
  if (images.length === 0) return;
  index = (index + 1) % images.length;
  updatePosition();
  resetAutoplay();
}

function goTo(i) {
  index = i;
  updatePosition();
  resetAutoplay();
}

function resetAutoplay() {
  if (autoplayTimer) clearInterval(autoplayTimer);
  if (autoplayCheckbox.checked && images.length > 1) {
    const ms = Math.max(100, parseInt(speedInput.value, 10) || 3000);
    autoplayTimer = setInterval(next, ms);
  }
}

fileInput.addEventListener('change', (e) => {
  const files = Array.from(e.target.files);
  files.forEach((f) => {
    if (!f.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      images.push({ src: ev.target.result });
      render();
      resetAutoplay();
    };
    reader.readAsDataURL(f);
  });
  e.target.value = '';
});

clearBtn.addEventListener('click', () => {
  images = [];
  index = 0;
  render();
  resetAutoplay();
});

prevBtn.addEventListener('click', prev);
nextBtn.addEventListener('click', next);
autoplayCheckbox.addEventListener('change', resetAutoplay);
speedInput.addEventListener('change', resetAutoplay);

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') prev();
  if (e.key === 'ArrowRight') next();
});

window.addEventListener('resize', updatePosition);
window.addEventListener('load', render);