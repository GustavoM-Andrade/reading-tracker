/* ============================================================
   app.js — Núcleo da aplicação (App.Main)
   Gerencia estado, roteamento de views, eventos e persistência.
   ============================================================ */
window.App = window.App || {};

App.Main = (function () {
  'use strict';

  const U = App.Utils;
  const Storage = App.Storage;
  const Data = App.Data;

  /* ---------------- Estado ---------------- */
  const state = {
    books: [],
    view: 'dashboard',
    globalSearch: '',
    todayISO: U.todayISO()
  };

  function getState() { return state; }

  /* ---------------- Persistência ---------------- */
  function persist() {
    Storage.save(state.books);
  }

  function loadBooks() {
    const saved = Storage.load();
    if (saved && saved.length) {
      state.books = saved;
    } else {
      state.books = JSON.parse(JSON.stringify(Data.SEED));
      persist();
    }
  }

  function resetDemoData() {
    state.books = JSON.parse(JSON.stringify(Data.SEED));
    persist();
    renderAll();
    U.toast('Dados de demonstração restaurados.', 'info');
  }

  /* ---------------- Operações CRUD ---------------- */
  function addBook(book) {
    state.books.push(book);
    persist();
    renderAll();
  }

  function updateBook(id, patch) {
    const idx = state.books.findIndex(b => b.id === id);
    if (idx === -1) return;
    state.books[idx] = reapplyRules({ ...state.books[idx], ...patch });
    persist();
    renderAll();
  }

  function reapplyRules(book) {
    // reaplica clamps e conclusão automática (versão enxuta, sem dependência do form)
    const total = Number(book.totalPages) || 0;
    let current = U.clamp(Number(book.currentPage) || 0, 0, total);
    if (book.status === 'desejo') { book.currentPage = 0; return book; }
    if (current >= total && total > 0) {
      book.status = 'concluido';
      book.currentPage = total;
      if (!book.finishDate) book.finishDate = U.todayISO();
    }
    if (book.status === 'concluido') {
      if (!book.finishDate) book.finishDate = U.todayISO();
      book.currentPage = total;
    }
    if (book.status === 'nao-iniciado') {
      book.currentPage = 0; book.startDate = ''; book.finishDate = '';
    }
    return book;
  }

  function deleteBook(id) {
    state.books = state.books.filter(b => b.id !== id);
    persist();
    renderAll();
    U.toast('Livro excluído.', 'info');
  }

  function getBook(id) { return state.books.find(b => b.id === id); }

  /** Move um livro da lista de desejos para a biblioteca e inicia a leitura */
  function startReadingFromWishlist(id) {
    const book = getBook(id);
    if (!book) return;
    updateBook(id, {
      status: 'lendo',
      currentPage: 0,
      startDate: U.todayISO(),
      finishDate: ''
    });
    U.toast(`"${book.title}" movido para a biblioteca. Boa leitura! 📖`, 'success');
    navigate('reading');
  }

  /* ---------------- Renderização ---------------- */
  function renderAll() {
    App.Dashboard.render();
    renderActiveView();
  }

  function renderActiveView() {
    switch (state.view) {
      case 'dashboard': App.Dashboard.render(); break;
      case 'reading': App.Reading.render(); break;
      case 'library': App.Library.render(); break;
      case 'wishlist': App.Wishlist.render(); break;
    }
    updateNavBadges();
  }

  function updateNavBadges() {
    const lendo = state.books.filter(b => b.status === 'lendo').length;
    const desejo = state.books.filter(b => b.status === 'desejo').length;
    const readingNav = document.querySelector('.nav-item[data-view="reading"]');
    const wishNav = document.querySelector('.nav-item[data-view="wishlist"]');
    setBadge(readingNav, lendo);
    setBadge(wishNav, desejo);
  }

  function setBadge(navEl, n) {
    if (!navEl) return;
    let badge = navEl.querySelector('.badge');
    if (n > 0) {
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'badge';
        navEl.appendChild(badge);
      }
      badge.textContent = n;
    } else if (badge) {
      badge.remove();
    }
  }

  /* ---------------- Navegação ---------------- */
  function navigate(view) {
    state.view = view;
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-' + view).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n =>
      n.classList.toggle('active', n.dataset.view === view));
    const titles = {
      dashboard: 'Dashboard', reading: 'Minha Leitura Atual',
      library: 'Minha Biblioteca', wishlist: 'Lista de Desejos'
    };
    document.getElementById('topbarTitle').textContent = titles[view] || '';
    // limpa busca global ao trocar de view (mantém só se for library/wishlist)
    renderActiveView();
    closeSidebar();
  }

  /* ---------------- Sidebar mobile ---------------- */
  function openSidebar() {
    document.getElementById('sidebar').classList.add('open');
    let bd = document.querySelector('.backdrop');
    if (!bd) {
      bd = document.createElement('div');
      bd.className = 'backdrop';
      bd.addEventListener('click', closeSidebar);
      document.body.appendChild(bd);
    }
    bd.classList.add('show');
  }
  function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    const bd = document.querySelector('.backdrop');
    if (bd) bd.classList.remove('show');
  }

  /* ---------------- Confirmação (excluir) ---------------- */
  function confirmDelete(opts) {
    document.getElementById('confirmTitle').textContent = opts.title || 'Confirmar';
    document.getElementById('confirmMsg').textContent = opts.msg || '';
    const overlay = document.getElementById('confirmOverlay');
    const ok = document.getElementById('confirmOk');
    const cancel = document.getElementById('confirmCancel');
    ok.textContent = opts.okLabel || 'Confirmar';
    overlay.classList.add('active');
    const closeFn = () => overlay.classList.remove('active');
    const okHandler = () => { closeFn(); cleanup(); opts.onYes(); };
    const cancelHandler = () => { closeFn(); cleanup(); };
    function cleanup() {
      ok.removeEventListener('click', okHandler);
      cancel.removeEventListener('click', cancelHandler);
    }
    ok.addEventListener('click', okHandler);
    cancel.addEventListener('click', cancelHandler);
  }

  /* ---------------- Detalhes do livro ---------------- */
  function showDetails(book) {
    document.getElementById('confirmTitle').textContent = 'Detalhes do livro';
    const overlay = document.getElementById('confirmOverlay');
    const modal = overlay.querySelector('.modal');
    // reutiliza o modal de confirmação, injetando HTML de detalhes
    modal.innerHTML = `
      <div class="modal__head"><h2>Detalhes do livro</h2><button class="icon-btn" id="detailsClose">✕</button></div>
      <div style="padding:8px 26px 0">${App.Components.detailsHTML(book)}</div>
      <div class="modal__foot"><button class="btn btn--ghost" id="detailsOk">Fechar</button>
      <button class="btn btn--primary" id="detailsEdit">Editar</button></div>`;
    overlay.classList.add('active');
    document.getElementById('detailsClose').onclick = closeDetails;
    document.getElementById('detailsOk').onclick = closeDetails;
    document.getElementById('detailsEdit').onclick = () => {
      closeDetails();
      App.Modal.open('edit', { book });
    };
    function closeDetails() { overlay.classList.remove('active'); restoreConfirmModal(); }
  }

  function restoreConfirmModal() {
    const overlay = document.getElementById('confirmOverlay');
    const modal = overlay.querySelector('.modal');
    modal.innerHTML = `
      <div class="modal__head"><h2 id="confirmTitle">Confirmar</h2></div>
      <p class="confirm__msg" id="confirmMsg"></p>
      <div class="modal__foot">
        <button class="btn btn--ghost" id="confirmCancel">Cancelar</button>
        <button class="btn btn--danger" id="confirmOk">Confirmar</button>
      </div>`;
  }

  /* ---------------- Eventos ---------------- */
  function bindEvents() {
    // Navegação
    document.querySelectorAll('.nav-item').forEach(n =>
      n.addEventListener('click', e => { e.preventDefault(); navigate(n.dataset.view); }));

    // Sidebar mobile
    document.getElementById('sidebarToggle').addEventListener('click', openSidebar);

    // Botões topo
    document.getElementById('btnAddBook').addEventListener('click', () => App.Modal.open('add'));
    document.getElementById('btnResetData').addEventListener('click', () => {
      confirmDelete({
        title: 'Restaurar dados',
        msg: 'Restaurar os dados fictícios de demonstração? Seus livros cadastrados manualmente serão perdidos.',
        okLabel: 'Restaurar',
        onYes: resetDemoData
      });
    });

    // Busca global
    const search = document.getElementById('globalSearch');
    search.addEventListener('input', U.debounce(() => {
      state.globalSearch = search.value;
      App.Library.setSearch(search.value);
      if (state.view === 'library') App.Library.render();
      if (state.view === 'wishlist') App.Wishlist.render();
    }, 200));

    // Modal: fechar
    document.getElementById('modalClose').addEventListener('click', App.Modal.close);
    document.getElementById('modalCancel').addEventListener('click', App.Modal.close);
    document.getElementById('modalOverlay').addEventListener('click', e => {
      if (e.target.id === 'modalOverlay') App.Modal.close();
    });
    document.getElementById('modalSave').addEventListener('click', e => { e.preventDefault(); App.Modal.submit(); });
    document.getElementById('bookForm').addEventListener('submit', e => { e.preventDefault(); App.Modal.submit(); });

    // Tabs do formulário
    document.querySelectorAll('.form-tab').forEach(t =>
      t.addEventListener('click', () => App.Modal.setCollection(t.dataset.tab, true)));

    // Estrelas
    document.querySelectorAll('#ratingInput button').forEach(btn =>
      btn.addEventListener('click', () => App.Modal.updateRating(Number(btn.dataset.val))));

    // Filtros da biblioteca
    ['filterStatus', 'filterGenre', 'filterAuthor', 'filterRating', 'filterYear', 'filterPages', 'sortBy']
      .forEach(id => document.getElementById(id).addEventListener('change', () => App.Library.render()));
    document.getElementById('clearFilters').addEventListener('click', () => {
      ['filterStatus', 'filterGenre', 'filterAuthor', 'filterRating', 'filterYear', 'filterPages']
        .forEach(id => document.getElementById(id).value = '');
      document.getElementById('sortBy').value = 'recent';
      App.Library.render();
    });

    // Filtros da wishlist
    ['wishPriority', 'wishGenre'].forEach(id =>
      document.getElementById(id).addEventListener('change', () => App.Wishlist.render()));
    document.getElementById('btnAddWish').addEventListener('click', () => App.Modal.open('add', { collection: 'wishlist' }));

    // Eventos delegados nos grids
    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-act]');
      if (!btn) return;
      const card = btn.closest('[data-id]');
      if (!card) return;
      const id = card.dataset.id;
      const act = btn.dataset.act;
      const book = getBook(id);
      if (!book) return;

      switch (act) {
        case 'edit':
          App.Modal.open('edit', { book });
          break;
        case 'delete':
          confirmDelete({
            title: 'Excluir livro',
            msg: `Excluir "${book.title}"? Esta ação não pode ser desfeita.`,
            okLabel: 'Excluir',
            onYes: () => deleteBook(id)
          });
          break;
        case 'view':
          showDetails(book);
          break;
        case 'progress':
          App.Modal.open('edit', { book });
          // rola até a página atual
          setTimeout(() => document.getElementById('f_currentPage').scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
          break;
        case 'start':
          confirmDelete({
            title: 'Iniciar leitura',
            msg: `Iniciar a leitura de "${book.title}"? O livro sairá da lista de desejos e entrará na sua biblioteca.`,
            okLabel: 'Iniciar leitura',
            onYes: () => startReadingFromWishlist(id)
          });
          break;
        case 'save-progress':
          App.Reading.saveProgress(id);
          break;
        case 'finish':
          confirmDelete({
            title: 'Concluir leitura',
            msg: `Marcar "${book.title}" como concluído?`,
            okLabel: 'Concluir',
            onYes: () => App.Reading.finish(id)
          });
          break;
      }
    });

    // Botões "data-go"
    document.addEventListener('click', e => {
      const go = e.target.closest('[data-go]');
      if (go) navigate(go.dataset.go);
    });

    // Esc fecha modais
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        document.getElementById('modalOverlay').classList.remove('active');
        document.getElementById('confirmOverlay').classList.remove('active');
        restoreConfirmModal();
        closeSidebar();
      }
    });
  }

  /* ---------------- Inicialização ---------------- */
  function init() {
    loadBooks();
    populateGenreDatalist();
    bindEvents();
    navigate('dashboard');
    renderAll();
  }

  function populateGenreDatalist() {
    const dl = document.getElementById('genreList');
    dl.innerHTML = Data.GENRES.map(g => `<option value="${U.esc(g)}">`).join('');
  }

  // API pública
  return {
    init, getState, navigate, renderAll,
    addBook, updateBook, deleteBook, getBook, startReadingFromWishlist,
    resetDemoData
  };
})();

// Expõe funções usadas por outros módulos
App.getState = App.Main.getState;
App.updateBook = App.Main.updateBook;
App.addBook = App.Main.addBook;

document.addEventListener('DOMContentLoaded', App.Main.init);
