// main.js — Arte na Sala

const toggle = document.querySelector('.nav-toggle');
const nav    = document.querySelector('#main-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });
}

// Modal de membro
(function () {
  const overlay = document.createElement('div');
  overlay.id = 'membro-modal';
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-inner">
      <button class="modal-close" aria-label="Fechar">×</button>
      <div class="modal-foto">
        <span class="foto-label">foto em breve</span>
      </div>
      <div class="modal-info">
        <span class="modal-badge"></span>
        <h2 class="modal-nome"></h2>
        <p class="modal-cargo"></p>
        <p class="modal-frase"></p>
        <p class="modal-bio"></p>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const closeModal = () => overlay.classList.remove('open');

  overlay.querySelector('.modal-close').addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  document.querySelectorAll('.membro-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      overlay.querySelector('.modal-nome').textContent  = card.dataset.nome;
      overlay.querySelector('.modal-cargo').textContent = card.dataset.cargo;
      overlay.querySelector('.modal-frase').textContent = card.dataset.frase;
      overlay.querySelector('.modal-bio').textContent   = card.dataset.bio;

      const badge = overlay.querySelector('.modal-badge');
      badge.className = 'modal-badge ' + card.dataset.badge;
      badge.textContent = card.dataset.label;

      const cardImg = card.querySelector('.membro-foto img');
      const modalFoto = overlay.querySelector('.modal-foto');
      const existingImg = modalFoto.querySelector('img');
      if (existingImg) existingImg.remove();
      if (cardImg) {
        const img = cardImg.cloneNode();
        modalFoto.appendChild(img);
        modalFoto.querySelector('.foto-label').style.display = 'none';
      } else {
        modalFoto.querySelector('.foto-label').style.display = '';
      }

      overlay.classList.add('open');
    });
  });
})();

// Pausa poesias flutuantes ao passar o mouse por cima
document.addEventListener('mousemove', (e) => {
  document.querySelectorAll('.poesia-flutuante').forEach(el => {
    const rect = el.getBoundingClientRect();
    const over = e.clientX >= rect.left && e.clientX <= rect.right &&
                 e.clientY >= rect.top  && e.clientY <= rect.bottom;
    el.style.animationPlayState = over ? 'paused' : 'running';
    if (over) {
      el.style.zIndex = '20';
      el.querySelectorAll('span').forEach(s => {
        s.style.color = 'rgba(240, 237, 230, 0.92)';
        s.style.textShadow = '0 0 18px rgba(201, 169, 110, 0.5)';
      });
    } else {
      el.style.zIndex = '0';
      el.querySelectorAll('span').forEach(s => {
        s.style.color = '';
        s.style.textShadow = '';
      });
    }
  });
});
