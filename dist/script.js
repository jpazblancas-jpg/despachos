/* Agrega las rutas a tus videos aquí. También puedes usar URLs directas a MP4. */
const videos = { reel: '', proyecto: '', servicio1: './assets/servicio-01.mp4', servicio2: './assets/servicio-02.mp4', servicio3: './assets/servicio-03.mp4', servicio4: './assets/servicio-04.mp4' };
document.querySelectorAll('[data-video]').forEach(slot => {
  const source = videos[slot.dataset.video];
  if (!source) return;
  const video = document.createElement('video');
  video.src = source;
  video.playsInline = true;
  video.preload = 'metadata';
  if (slot.dataset.video === 'reel') {
    video.muted = true;
    video.loop = true;
    video.autoplay = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    video.controls = true;
    video.setAttribute('aria-label', 'Reel de Estudio Dose');
  } else {
    video.controls = true;
    video.setAttribute('aria-label', slot.dataset.video === 'proyecto' ? 'Proyecto audiovisual de Estudio Dose' : 'Video del servicio audiovisual');
  }
  slot.replaceChildren(video);
});

const track = document.querySelector('.cards');
const slides = [...track.querySelectorAll('.card')];
const dots = [...document.querySelectorAll('[data-slide]')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let activeSlide = 0;
function goToSlide(index) {
  const next = (index + slides.length) % slides.length;
  track.scrollTo({ left: slides[next].offsetLeft - slides[0].offsetLeft, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
}
function updateCarousel() {
  const position = track.scrollLeft;
  activeSlide = slides.reduce((closest, slide, index) => Math.abs(slide.offsetLeft - slides[0].offsetLeft - position) < Math.abs(slides[closest].offsetLeft - slides[0].offsetLeft - position) ? index : closest, 0);
  dots.forEach((dot, index) => { if (index === activeSlide) dot.setAttribute('aria-current', 'true'); else dot.removeAttribute('aria-current'); });
  document.querySelector('.carousel-status').textContent = `${String(activeSlide + 1).padStart(2, '0')} / 04`;
}
dots.forEach(dot => dot.addEventListener('click', () => goToSlide(Number(dot.dataset.slide))));
document.querySelectorAll('[data-direction]').forEach(button => button.addEventListener('click', () => goToSlide(activeSlide + Number(button.dataset.direction))));
track.addEventListener('keydown', event => {
  if (event.target !== track) return;
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); goToSlide(activeSlide + (event.key === 'ArrowRight' ? 1 : -1)); }
});
track.addEventListener('scroll', updateCarousel, { passive: true });
window.addEventListener('resize', updateCarousel);
