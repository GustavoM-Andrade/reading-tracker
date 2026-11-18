/* ============================================================
   reading.js — "Minha leitura atual" (App.Reading)
   ============================================================ */
window.App = window.App || {};

App.Reading = (function () {
  'use strict';

  const U = App.Utils;
  const C = App.Components;

  function getBooks() { return App.getState().books; }

  function render() {
    const lendo = getBooks().filter(b => b.status === 'lendo');
    const grid = document.getElementById('readingGrid');
    const empty = document.getElementById('readingEmpty');

    if (!lendo.length) {
      grid.innerHTML = '';
      empty.hidden = false;
      return;
    }
    empty.hidden = true;
    grid.innerHTML = lendo.map(b => C.readingCard(b)).join('');
  }

  /** Salva o progresso de um livro (página atual) */
  function saveProgress(bookId) {
    const input = document.getElementById('pg_' + bookId);
    if (!input) return;
    const val = parseInt(input.value, 10);
    if (isNaN(val) || val < 0) {
      U.toast('Informe uma página válida (0 ou mais).', 'error');
      input.focus();
      return;
    }
    const books = getBooks();
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    if (val > book.totalPages) {
      U.toast('A página atual não pode ser maior que o total de páginas.', 'error');
      input.focus();
      return;
    }
    App.updateBook(bookId, { currentPage: val });
    const p = U.calcProgress({ ...book, currentPage: val });
    if (p.percent === 100) {
      App.updateBook(bookId, { status: 'concluido', finishDate: App.getState().todayISO || U.todayISO() });
      U.toast(`Você concluiu "${book.title}"! 🎉`, 'success');
    } else {
      U.toast(`Progresso atualizado: ${p.percent}% lido.`, 'success');
    }
  }

  /** Marca um livro como concluído */
  function finish(bookId) {
    const books = getBooks();
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    App.updateBook(bookId, {
      currentPage: book.totalPages,
      status: 'concluido',
      finishDate: U.todayISO()
    });
    U.toast(`"${book.title}" marcado como concluído! 🎉`, 'success');
  }

  return { render, saveProgress, finish };
})();
