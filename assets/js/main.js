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
