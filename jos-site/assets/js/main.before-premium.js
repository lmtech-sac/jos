const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav-links');
menuBtn?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
});
document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.portfolio-card');
filterBtns.forEach(btn => btn.addEventListener('click', () => {
  filterBtns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const filter = btn.dataset.filter;
  cards.forEach(card => {
    const show = filter === 'all' || card.dataset.category === filter;
    card.classList.toggle('hidden', !show);
  });
}));

const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox?.querySelector('img');
const lightboxCaption = lightbox?.querySelector('figcaption');
function closeLightbox(){ lightbox?.classList.remove('open'); lightbox?.setAttribute('aria-hidden','true'); }
cards.forEach(card => card.addEventListener('click', () => {
  if(!lightbox || !lightboxImg) return;
  lightboxImg.src = card.dataset.image;
  lightboxImg.alt = card.dataset.title || '';
  lightboxCaption.textContent = card.dataset.title || '';
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden','false');
}));
lightbox?.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', e => { if(e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeLightbox(); });

const form = document.getElementById('quoteForm');
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
