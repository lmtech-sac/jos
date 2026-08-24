const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarsePointer = window.matchMedia('(pointer: coarse)').matches;

// Menu
const menuBtn = $('.menu-btn');
const nav = $('.nav-links');
menuBtn?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
});
$$('.nav-links a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  menuBtn?.setAttribute('aria-expanded','false');
}));

// Reveal on scroll
if ('IntersectionObserver' in window && !reduceMotion) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .11, rootMargin: '0px 0px -4% 0px' });
  $$('.reveal').forEach(el => observer.observe(el));
} else {
  $$('.reveal').forEach(el => el.classList.add('visible'));
}

// Scroll progress + sticky header state
const progress = $('.scroll-progress span');
const header = $('.site-header');
function onScroll(){
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  if(progress) progress.style.width = `${pct}%`;
  header?.classList.toggle('scrolled', window.scrollY > 20);
}
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();

// Soft pointer glow
const glow = $('.cursor-glow');
if (glow && !coarsePointer && !reduceMotion) {
  window.addEventListener('pointermove', e => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  }, {passive:true});
}

// 3D tilt — intentionally subtle and desktop only
if (!coarsePointer && !reduceMotion) {
  $$('[data-tilt]').forEach(el => {
    const strength = Number(el.dataset.tiltStrength || 4);
    let raf;
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(1100px) rotateX(${(-y*strength).toFixed(2)}deg) rotateY(${(x*strength).toFixed(2)}deg) translateZ(0)`;
      });
    });
    el.addEventListener('pointerleave', () => {
      cancelAnimationFrame(raf);
      el.style.transform = '';
    });
  });

  // Hero floating depth follows the pointer a little slower than the main panel
  const stage = $('#heroStage');
  const floaters = $$('[data-parallax]', stage || document);
  stage?.addEventListener('pointermove', e => {
    const r = stage.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    floaters.forEach(el => {
      const d = Number(el.dataset.parallax || 1);
      el.style.translate = `${x * 14 * d}px ${y * 12 * d}px`;
    });
  });
  stage?.addEventListener('pointerleave', () => floaters.forEach(el => el.style.translate = ''));
}

// Magnetic CTA microinteraction
if (!coarsePointer && !reduceMotion) {
  $$('.magnetic').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width/2);
      const y = e.clientY - (r.top + r.height/2);
      el.style.transform = `translate(${x*.06}px,${y*.08}px) translateY(-2px)`;
    });
    el.addEventListener('pointerleave', () => el.style.transform = '');
  });
}

// Portfolio filters
const filterBtns = $$('.filter-btn');
const cards = $$('.portfolio-card');
filterBtns.forEach(btn => btn.addEventListener('click', () => {
  filterBtns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const filter = btn.dataset.filter;
  cards.forEach(card => {
    const show = filter === 'all' || card.dataset.category === filter;
    card.classList.toggle('hidden', !show);
  });
}));

// Portfolio lightbox
const lightbox = $('#lightbox');
const lightboxImg = $('img', lightbox || document);
const lightboxCaption = $('figcaption', lightbox || document);
function closeLightbox(){
  lightbox?.classList.remove('open');
  lightbox?.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
}
cards.forEach(card => card.addEventListener('click', () => {
  if(!lightbox || !lightboxImg) return;
  lightboxImg.src = card.dataset.image;
  lightboxImg.alt = card.dataset.title || '';
  if(lightboxCaption) lightboxCaption.textContent = card.dataset.title || '';
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
}));
$('.lightbox-close', lightbox || document)?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', e => { if(e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeLightbox(); });

// WhatsApp quote form
const form = $('#quoteForm');
form?.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(form);
  const msg = [
    'Olá, vim pelo site da J.O.S Engenharia e gostaria de solicitar um orçamento.',
    '',
    `Nome: ${data.get('nome') || '-'}`,
    `Telefone: ${data.get('telefone') || '-'}`,
    `Serviço: ${data.get('servico') || '-'}`,
    `Cidade: ${data.get('cidade') || '-'}`,
    `Detalhes: ${data.get('mensagem') || '-'}`
  ].join('\n');
  window.open(`https://wa.me/5573982392994?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
});

// Scroll-controlled parametric sequence — desktop quality + mobile optimized assets
(() => {
  const section = document.querySelector('.build-scroll');
  const canvas = document.getElementById('buildCanvas');
  if (!section || !canvas) return;

  const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
  if (!ctx) return;

  const totalFrames = 110;
  const label = document.getElementById('buildFrameLabel');
  const bar = document.getElementById('buildProgressBar');
  let variant = window.innerWidth <= 760 ? 'mobile' : 'desktop';
  let frames = new Array(totalFrames);
  let loading = new Set();
  let currentFrame = 0;
  let targetFrame = 0;
  let active = false;
  let raf = 0;
  let lastDrawn = -1;

  const srcFor = i => `assets/frames/${variant}/scene_${String(i + 1).padStart(3, '0')}.webp`;

  function fitCanvas(){
    const mobile = variant === 'mobile';
    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 2 : 1.65);
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width * dpr));
    const h = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      lastDrawn = -1;
      drawFrame(currentFrame, true);
    }
  }

  function drawImageContain(img){
    const cw = canvas.width, ch = canvas.height;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, cw, ch);
    const scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  function loadFrame(i, priority = false){
    i = Math.max(0, Math.min(totalFrames - 1, i));
    if (frames[i] || loading.has(i)) return;
    loading.add(i);
    const img = new Image();
    img.decoding = 'async';
    if (priority) img.fetchPriority = 'high';
    img.onload = () => {
      frames[i] = img;
      loading.delete(i);
      if (i === currentFrame || lastDrawn < 0) drawFrame(currentFrame, true);
    };
    img.onerror = () => loading.delete(i);
    img.src = srcFor(i);
  }

  function nearestLoaded(i){
    if (frames[i]) return i;
    for (let d = 1; d < 12; d++) {
      if (i - d >= 0 && frames[i-d]) return i-d;
      if (i + d < totalFrames && frames[i+d]) return i+d;
    }
    return frames[0] ? 0 : -1;
  }

  function warmAround(i){
    loadFrame(i, true);
    const radius = variant === 'mobile' ? 4 : 6;
    for (let d = 1; d <= radius; d++) {
      loadFrame(i + d);
      loadFrame(i - d);
    }
  }

  function drawFrame(i, force = false){
    const available = nearestLoaded(i);
    if (available < 0 || (!force && available === lastDrawn)) return;
    drawImageContain(frames[available]);
    lastDrawn = available;
  }

  function updateFromScroll(){
    const rect = section.getBoundingClientRect();
    const scrollable = Math.max(1, section.offsetHeight - window.innerHeight);
    const progress = Math.max(0, Math.min(1, -rect.top / scrollable));
    section.style.setProperty('--p', progress.toFixed(4));
    targetFrame = Math.round(progress * (totalFrames - 1));
    if (label) label.textContent = `${String(targetFrame + 1).padStart(3,'0')} / ${totalFrames}`;
    if (bar) bar.style.width = `${(progress * 100).toFixed(2)}%`;
    section.classList.toggle('is-ending', progress > .8);
    warmAround(targetFrame);
  }

  function animate(){
    if (!active) { raf = 0; return; }
    const diff = targetFrame - currentFrame;
    if (Math.abs(diff) >= 1) {
      currentFrame += Math.sign(diff) * Math.max(1, Math.ceil(Math.abs(diff) * .22));
      currentFrame = Math.max(0, Math.min(totalFrames - 1, currentFrame));
      warmAround(currentFrame);
      drawFrame(currentFrame);
    } else {
      drawFrame(currentFrame);
    }
    raf = requestAnimationFrame(animate);
  }

  function start(){
    active = true;
    updateFromScroll();
    if (!raf) raf = requestAnimationFrame(animate);
  }
  function stop(){ active = false; }

  function prime(){
    [0,1,2,3,27,54,81,109].forEach((i, idx) => loadFrame(i, idx < 2));
  }

  function switchVariantIfNeeded(){
    const next = window.innerWidth <= 760 ? 'mobile' : 'desktop';
    if (next === variant) return;
    variant = next;
    frames = new Array(totalFrames);
    loading = new Set();
    lastDrawn = -1;
    prime();
  }

  prime();

  if (reduceMotion) {
    currentFrame = totalFrames - 1;
    targetFrame = currentFrame;
    loadFrame(currentFrame, true);
    fitCanvas();
    return;
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting ? start() : stop());
  }, { rootMargin: '100% 0px 100% 0px' });
  io.observe(section);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      switchVariantIfNeeded();
      fitCanvas();
      updateFromScroll();
    }, 140);
  }, { passive:true });
  window.addEventListener('scroll', () => { if (active) updateFromScroll(); }, { passive:true });

  fitCanvas();
  updateFromScroll();
})();
