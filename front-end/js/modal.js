/* ============================================================
   modal.js — Modal de cadastro/edição + regras de negócio (App.Modal)
   ============================================================ */
window.App = window.App || {};

App.Modal = (function () {
  'use strict';

  const U = App.Utils;
  let currentCollection = 'library'; // 'library' | 'wishlist'

  /* ---------------- Abrir / fechar ---------------- */
  function open(mode, opts) {
    opts = opts || {};
    const overlay = document.getElementById('modalOverlay');
    document.getElementById('modalTitle').textContent = mode === 'edit' ? 'Editar Livro' : 'Adicionar Livro';
    resetForm();

    if (mode === 'edit' && opts.book) {
      fillForm(opts.book);
      setCollection(opts.book.status === 'desejo' ? 'wishlist' : 'library', false);
    } else {
      setCollection(opts.collection || 'library', false);
      // padrão: data de hoje no início se for leitura
      if (opts.defaultStatus === 'lendo') {
        document.getElementById('f_status').value = 'lendo';
        document.getElementById('f_startDate').value = U.todayISO();
      }
    }
    overlay.classList.add('active');
    setTimeout(() => document.getElementById('f_title').focus(), 50);
  }

  function close() {
    document.getElementById('modalOverlay').classList.remove('active');
  }

  function resetForm() {
    const form = document.getElementById('bookForm');
    form.reset();
    document.getElementById('f_id').value = '';
    document.getElementById('f_rating').value = '0';
    document.getElementById('f_currentPage').value = '0';
    updateRating(0);
    clearErrors();
  }

  function clearErrors() {
    document.querySelectorAll('.field__error').forEach(e => e.textContent = '');
    document.querySelectorAll('.field input, .field select').forEach(e => e.classList.remove('invalid'));
  }

  function fillForm(b) {
    document.getElementById('f_id').value = b.id || '';
    document.getElementById('f_title').value = b.title || '';
    document.getElementById('f_author').value = b.author || '';
    document.getElementById('f_publisher').value = b.publisher || '';
    document.getElementById('f_genre').value = b.genre || '';
    document.getElementById('f_isbn').value = b.isbn || '';
    document.getElementById('f_cover').value = b.cover || '';
    document.getElementById('f_totalPages').value = b.totalPages || '';
    document.getElementById('f_currentPage').value = b.currentPage || 0;
    document.getElementById('f_status').value = b.status && b.status !== 'desejo' ? b.status : 'nao-iniciado';
    document.getElementById('f_startDate').value = b.startDate || '';
    document.getElementById('f_finishDate').value = b.finishDate || '';
    document.getElementById('f_review').value = b.review || '';
    document.getElementById('f_notes').value = b.notes || '';
    document.getElementById('f_priority').value = b.priority || 'media';
    document.getElementById('f_rating').value = b.rating || 0;
    updateRating(b.rating || 0);
  }

  /* ---------------- Tabs biblioteca / desejo ---------------- */
  function setCollection(coll, focusTitle) {
    currentCollection = coll;
    document.getElementById('f_collection').value = coll;
    document.querySelectorAll('.form-tab').forEach(t =>
      t.classList.toggle('active', t.dataset.tab === coll));

    const isWish = coll === 'wishlist';
    // mostra/oculta campos específicos
    toggleFields(['fieldCurrentPage', 'fieldRating'], !isWish);
    toggleFields(['fieldPriority', 'fieldNotes'], isWish);

    // se desejo, status fica oculto e definir internamente
    const statusField = document.getElementById('f_status');
    if (isWish) {
      statusField.parentElement.style.display = 'none';
      document.getElementById('f_startDate').parentElement.style.display = 'none';
      document.getElementById('f_finishDate').parentElement.style.display = 'none';
    } else {
      statusField.parentElement.style.display = '';
      document.getElementById('f_startDate').parentElement.style.display = '';
      document.getElementById('f_finishDate').parentElement.style.display = '';
    }
    if (focusTitle) document.getElementById('f_title').focus();
  }

  function toggleFields(ids, show) {
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.toggle('field--hidden', !show);
    });
  }

  /* ---------------- Avaliação por estrelas ---------------- */
  function updateRating(val) {
    document.getElementById('f_rating').value = val;
    document.querySelectorAll('#ratingInput button').forEach(btn => {
      btn.classList.toggle('on', Number(btn.dataset.val) <= val);
    });
  }

  /* ---------------- Validação ---------------- */
  function setError(fieldId, msg) {
    const err = document.querySelector(`.field__error[data-for="${fieldId}"]`);
    const input = document.getElementById(fieldId);
    if (err) err.textContent = msg;
    if (input) input.classList.add('invalid');
  }

  function validate(data) {
    clearErrors();
    let ok = true;
    if (!data.title || !data.title.trim()) { setError('f_title', 'Informe o título.'); ok = false; }
    if (!data.author || !data.author.trim()) { setError('f_author', 'Informe o autor.'); ok = false; }
    if (!data.genre || !data.genre.trim()) { setError('f_genre', 'Informe o gênero.'); ok = false; }

    const total = Number(data.totalPages);
    if (!data.totalPages || isNaN(total) || total <= 0) {
      setError('f_totalPages', 'O total de páginas deve ser maior que zero.'); ok = false;
    }

    // validações de leitura só se for biblioteca
    if (currentCollection === 'library') {
      const current = Number(data.currentPage);
      if (!isNaN(current) && current < 0) {
        setError('f_currentPage', 'A página atual não pode ser menor que zero.'); ok = false;
      }
      if (!isNaN(total) && total > 0 && !isNaN(current) && current > total) {
        setError('f_currentPage', 'A página atual não pode ser maior que o total.'); ok = false;
      }
    }
    return ok;
  }

  /* ---------------- Coleta de dados do form ---------------- */
  function collect() {
    const data = {
      id: document.getElementById('f_id').value || null,
      title: document.getElementById('f_title').value.trim(),
      author: document.getElementById('f_author').value.trim(),
      publisher: document.getElementById('f_publisher').value.trim(),
      genre: document.getElementById('f_genre').value.trim(),
      isbn: document.getElementById('f_isbn').value.trim(),
      cover: document.getElementById('f_cover').value.trim(),
      totalPages: Number(document.getElementById('f_totalPages').value),
      currentPage: Number(document.getElementById('f_currentPage').value) || 0,
      startDate: document.getElementById('f_startDate').value,
      finishDate: document.getElementById('f_finishDate').value,
      review: document.getElementById('f_review').value.trim(),
      notes: document.getElementById('f_notes').value.trim(),
      priority: document.getElementById('f_priority').value,
      rating: Number(document.getElementById('f_rating').value) || 0
    };
    if (currentCollection === 'wishlist') {
      data.status = 'desejo';
      data.currentPage = 0;
      data.startDate = '';
      data.finishDate = '';
    } else {
      data.status = document.getElementById('f_status').value;
    }
    return data;
  }

  /* ---------------- Regras de negócio (cálculo) ---------------- */
  function applyBusinessRules(book) {
    const total = Number(book.totalPages) || 0;
    // total deve ser > 0
    if (total <= 0) {
      book.totalPages = 1; // segurança
    }
    // página atual: clamp 0..total
    let current = Number(book.currentPage) || 0;
    current = U.clamp(current, 0, Number(book.totalPages));
    book.currentPage = current;

    // se for desejo, zera progresso
    if (book.status === 'desejo') {
      book.currentPage = 0;
      return book;
    }

    const percent = U.clamp(Math.round((current / book.totalPages) * 100), 0, 100);

    // atingiu última página -> concluído automaticamente
    if (current >= book.totalPages && book.totalPages > 0) {
      book.status = 'concluido';
      book.currentPage = book.totalPages;
      if (!book.finishDate) book.finishDate = U.todayISO();
    }
    // ao marcar manualmente como concluído, registra data e completa páginas
    if (book.status === 'concluido') {
      if (!book.finishDate) book.finishDate = U.todayISO();
      book.currentPage = book.totalPages;
      if (!book.startDate) book.startDate = book.finishDate;
    }
    // se mudou para "lendo" e não tem data de início, define hoje
    if (book.status === 'lendo' && !book.startDate) {
      book.startDate = U.todayISO();
    }
    // se abandonado e tem data de conclusão, limpa
    if (book.status === 'abandonado') {
      book.finishDate = '';
    }
    // se não iniciado, zera página atual e datas
    if (book.status === 'nao-iniciado') {
      book.currentPage = 0;
      book.startDate = '';
      book.finishDate = '';
    }
    return book;
  }

  /* ---------------- Submissão ---------------- */
  function submit() {
    const data = collect();
    if (!validate(data)) {
      U.toast('Verifique os campos destacados.', 'error');
      return;
    }
    const book = applyBusinessRules(data);
    const isEdit = !!data.id;
    if (isEdit) {
      App.updateBook(data.id, book);
      U.toast('Livro atualizado com sucesso.', 'success');
    } else {
      book.id = U.uid();
      App.addBook(book);
      U.toast('Livro cadastrado com sucesso.', 'success');
    }
    close();
  }

  return {
    open, close, submit, setCollection, updateRating,
    getCollection: () => currentCollection
  };
})();
