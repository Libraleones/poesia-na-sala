// main.js — Poesia na Sala

const toggle = document.querySelector('.nav-toggle');
const nav    = document.querySelector('#main-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });
}

// Calendário de agendamento
(function () {
  const grid    = document.getElementById('cal-grid');
  const titulo  = document.getElementById('cal-titulo');
  const btnPrev = document.getElementById('cal-prev');
  const btnNext = document.getElementById('cal-next');
  if (!grid) return;

  const hoje = new Date();
  let ano = hoje.getFullYear();
  let mes = hoje.getMonth();

  const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                 'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

  function renderCalendario() {
    grid.innerHTML = '';
    titulo.textContent = meses[mes] + ' ' + ano;

    const primeiroDia = new Date(ano, mes, 1).getDay();
    const diasNoMes   = new Date(ano, mes + 1, 0).getDate();

    for (let i = 0; i < primeiroDia; i++) {
      const vazio = document.createElement('div');
      vazio.className = 'cal-dia vazio';
      grid.appendChild(vazio);
    }

    for (let d = 1; d <= diasNoMes; d++) {
      const dia = document.createElement('div');
      dia.className = 'cal-dia';
      dia.textContent = d;

      const data = new Date(ano, mes, d);
      const ehHoje = data.toDateString() === hoje.toDateString();
      const passado = data < new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

      if (passado) {
        dia.classList.add('passado');
      } else if (ehHoje) {
        dia.classList.add('hoje', 'disponivel');
      } else {
        dia.classList.add('disponivel');
      }

      if (dia.classList.contains('disponivel')) {
        dia.addEventListener('click', () => abrirAgenda(d, mes, ano));
      }

      grid.appendChild(dia);
    }
  }

  btnPrev.addEventListener('click', () => {
    mes--;
    if (mes < 0) { mes = 11; ano--; }
    renderCalendario();
  });

  btnNext.addEventListener('click', () => {
    mes++;
    if (mes > 11) { mes = 0; ano++; }
    renderCalendario();
  });

  renderCalendario();

  // Modal de agendamento
  const agModal  = document.getElementById('agenda-modal');
  const agTitulo = document.getElementById('agenda-data-titulo');
  const agForm   = document.getElementById('agenda-form');

  function abrirAgenda(dia, m, a) {
    const nomes = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                   'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    agTitulo.textContent = dia + ' de ' + nomes[m] + ' de ' + a;
    agModal.classList.add('open');
    document.getElementById('ag-nome').value = '';
    document.getElementById('ag-email').value = '';
    document.getElementById('ag-msg').value = '';
  }

  agModal.addEventListener('click', e => { if (e.target === agModal) agModal.classList.remove('open'); });
  agModal.querySelector('.modal-close').addEventListener('click', () => agModal.classList.remove('open'));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') agModal.classList.remove('open'); });

  agForm.addEventListener('submit', e => {
    e.preventDefault();
    const nome  = document.getElementById('ag-nome').value;
    const email = document.getElementById('ag-email').value;
    const msg   = document.getElementById('ag-msg').value;
    const data  = agTitulo.textContent;
    const assunto = encodeURIComponent('Solicitação de gravação — ' + data);
    const corpo   = encodeURIComponent(
      'Data solicitada: ' + data + '\n' +
      'Nome: ' + nome + '\n' +
      'E-mail: ' + email + '\n\n' + msg
    );
    window.location.href = 'mailto:poesianasala@gmail.com?subject=' + assunto + '&body=' + corpo;
    agModal.classList.remove('open');
  });
})();

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
        <a class="modal-instagram" href="#" target="_blank" rel="noopener noreferrer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
          </svg>
          <span class="modal-instagram-handle"></span>
        </a>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const closeModal = () => overlay.classList.remove('open');

  overlay.querySelector('.modal-close').addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // Injeta fotos nos cards
  document.querySelectorAll('.membro-card').forEach(card => {
    if (card.dataset.foto) {
      const fotoDiv = card.querySelector('.membro-foto');
      const img = document.createElement('img');
      img.src = card.dataset.foto;
      img.alt = card.dataset.nome;
      fotoDiv.appendChild(img);
      fotoDiv.querySelector('.foto-label').style.display = 'none';
    }
  });

  document.querySelectorAll('.membro-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      overlay.querySelector('.modal-nome').textContent  = card.dataset.nome;
      overlay.querySelector('.modal-cargo').textContent = card.dataset.cargo;
      overlay.querySelector('.modal-frase').textContent = card.dataset.frase;
      overlay.querySelector('.modal-bio').textContent   = card.dataset.bio;

      const igLink = overlay.querySelector('.modal-instagram');
      const igHandle = overlay.querySelector('.modal-instagram-handle');
      if (card.dataset.instagram) {
        igLink.href = card.dataset.instagram;
        igHandle.textContent = '@' + card.dataset.instagram.split('/').pop();
        igLink.style.display = 'flex';
      } else {
        igLink.style.display = 'none';
      }

      const badge = overlay.querySelector('.modal-badge');
      badge.className = 'modal-badge ' + card.dataset.badge;
      badge.textContent = card.dataset.label;

      const modalFoto = overlay.querySelector('.modal-foto');
      const existingImg = modalFoto.querySelector('img');
      if (existingImg) existingImg.remove();
      if (card.dataset.foto) {
        const img = document.createElement('img');
        img.src = card.dataset.foto;
        img.alt = card.dataset.nome;
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
