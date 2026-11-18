/* ============================================================
   wishlist.js — "Minha lista de desejos" (App.Wishlist)
   ============================================================ */
window.App = window.App || {};

App.Wishlist = (function () {
  'use strict';

  const U = App.Utils;
  const C = App.Components;

  function getBooks() { return App.getState().books; }

  function populateGenres(books) {
    const genres = [...new Set(books.map(b => b.genre).filter(Boolean))].sort();
    const sel = document.getElementById('wishGenre');
    const current = sel.value;
    sel.innerHTML = '<option value="">Gênero: Todos</option>' +
      genres.map(g => `<option value="${U.esc(g)}">${U.esc(g)}</option>`).join('');
    if ([...sel.options].some(o => o.value === current)) sel.value = current;
  }

  function applyFilters() {
    let books = getBooks().filter(b => b.status === 'desejo');
    const search = App.getState().globalSearch.trim().toLowerCase();
    if (search) {
      books = books.filter(b =>
        (b.title || '').toLowerCase().includes(search) ||
        (b.author || '').toLowerCase().includes(search));
    }
    const pr = document.getElementById('wishPriority').value;
    if (pr) books = books.filter(b => b.priority === pr);
    const g = document.getElementById('wishGenre').value;
    if (g) books = books.filter(b => b.genre === g);

    // ordena por prioridade: alta -> media -> baixa
    const order = { alta: 0, media: 1, baixa: 2 };
    books.sort((a, b) => (order[a.priority] ?? 1) - (order[b.priority] ?? 1));
    return books;
  }

  function render() {
    populateGenres(getBooks());
    const books = applyFilters();
    const grid = document.getElementById('wishGrid');
    const empty = document.getElementById('wishEmpty');
    const count = document.getElementById('wishCount');

    const total = getBooks().filter(b => b.status === 'desejo').length;
    count.innerHTML = `Exibindo <b>${books.length}</b> de <b>${total}</b> livros na lista de desejos`;

    if (!books.length) {
      grid.innerHTML = '';
      empty.hidden = false;
      return;
    }
    empty.hidden = true;
    grid.innerHTML = books.map(b => C.wishlistCard(b)).join('');
  }

  return { render };
})();
