/* ============================================================
   library.js — "Minha Biblioteca" com filtros e busca (App.Library)
   ============================================================ */
window.App = window.App || {};

App.Library = (function () {
  'use strict';

  const U = App.Utils;
  const C = App.Components;

  let currentSearch = '';

  function getBooks() { return App.getState().books; }

  /** Popula os selects de filtro (gênero, autor, ano) */
  function populateFilters(books) {
    const genres = [...new Set(books.map(b => b.genre).filter(Boolean))].sort();
    const authors = [...new Set(books.map(b => b.author).filter(Boolean))].sort();
    const years = [...new Set(books.map(b => U.yearOf(b.finishDate)).filter(Boolean))].sort().reverse();

    fillSelect('filterGenre', genres, 'Gênero: Todos');
    fillSelect('filterAuthor', authors, 'Autor: Todos');
    fillSelect('filterYear', years, 'Ano de conclusão: Todos');
  }

  function fillSelect(id, values, allLabel) {
    const sel = document.getElementById(id);
    const current = sel.value;
    const options = `<option value="">${allLabel}</option>` +
      values.map(v => `<option value="${U.esc(v)}">${U.esc(v)}</option>`).join('');
    sel.innerHTML = options;
    if ([...sel.options].some(o => o.value === current)) sel.value = current;
  }

  /** Aplica filtros + busca e retorna livros filtrados/ordenados */
  function applyFilters() {
    let books = getBooks().filter(b => b.status !== 'desejo');

    const search = currentSearch.trim().toLowerCase();
    if (search) {
      books = books.filter(b =>
        (b.title || '').toLowerCase().includes(search) ||
        (b.author || '').toLowerCase().includes(search));
    }

    const status = val('filterStatus');
    if (status) books = books.filter(b => b.status === status);

    const genre = val('filterGenre');
    if (genre) books = books.filter(b => b.genre === genre);

    const author = val('filterAuthor');
    if (author) books = books.filter(b => b.author === author);

    const rating = val('filterRating');
    if (rating) books = books.filter(b => b.rating === Number(rating));

    const year = val('filterYear');
    if (year) books = books.filter(b => U.yearOf(b.finishDate) === year);

    const pages = val('filterPages');
    if (pages) {
      const [min, max] = pages.split('-').map(Number);
      books = books.filter(b => {
        const t = Number(b.totalPages) || 0;
        return t >= min && t <= max;
      });
    }

    // ordenação
    const sort = val('sortBy') || 'recent';
    books.sort((a, b) => {
      switch (sort) {
        case 'title': return (a.title || '').localeCompare(b.title || '');
        case 'author': return (a.author || '').localeCompare(b.author || '');
        case 'progress': return U.calcProgress(b).percent - U.calcProgress(a).percent;
        case 'rating': return (b.rating || 0) - (a.rating || 0);
        case 'finishDate': return (b.finishDate || '').localeCompare(a.finishDate || '');
        default:
          // mais recentes primeiro (por id/cadastro; seed usa número, dinâmico usa timestamp)
          return String(b.id).localeCompare(String(a.id));
      }
    });
    return books;
  }

  function val(id) { return document.getElementById(id).value; }

  function render() {
    const all = getBooks().filter(b => b.status !== 'desejo');
    populateFilters(getBooks());

    const books = applyFilters();
    const grid = document.getElementById('libraryGrid');
    const empty = document.getElementById('libraryEmpty');
    const count = document.getElementById('libraryCount');

    count.innerHTML = `Exibindo <b>${books.length}</b> de <b>${all.length}</b> livros`;

    if (!books.length) {
      grid.innerHTML = '';
      empty.hidden = false;
      return;
    }
    empty.hidden = true;
    grid.innerHTML = books.map(b => C.libraryCard(b)).join('');
  }

  /** Renderiza apenas o grid (usado quando a busca global muda) */
  function refreshGrid() { render(); }

  function setSearch(s) { currentSearch = s; }

  return { render, refreshGrid, setSearch };
})();
