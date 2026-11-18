/* ============================================================
   dashboard.js — Painel principal com estatísticas (App.Dashboard)
   ============================================================ */
window.App = window.App || {};

App.Dashboard = (function () {
  'use strict';

  const U = App.Utils;
  const C = App.Components;
  const Charts = App.Charts;

  function statCard(iconCls, icon, value, label, hint) {
    return `
      <div class="stat-card ${iconCls}">
        <div class="stat-card__icon">${icon}</div>
        <div class="stat-card__value">${value}</div>
        <div class="stat-card__label">${label}</div>
        ${hint ? `<div class="stat-card__hint">${hint}</div>` : ''}
      </div>`;
  }

  function getBooks() {
    return App.getState().books;
  }

  function render() {
    const books = getBooks();
    const lib = books.filter(b => b.status !== 'desejo');
    const concl = books.filter(b => b.status === 'concluido');
    const lendo = books.filter(b => b.status === 'lendo');
    const desejo = books.filter(b => b.status === 'desejo');

    // páginas
    const totalPages = lib.reduce((s, b) => s + (Number(b.totalPages) || 0), 0);
    const pagesRead = lib.reduce((s, b) => {
      if (b.status === 'concluido') return s + (Number(b.totalPages) || 0);
      return s + (Number(b.currentPage) || 0);
    }, 0);

    // avaliação média
    const rated = books.filter(b => b.rating > 0);
    const avgRating = rated.length
      ? (rated.reduce((s, b) => s + b.rating, 0) / rated.length).toFixed(1)
      : '0.0';

    // progresso geral
    const overallPct = totalPages ? Math.round((pagesRead / totalPages) * 100) : 0;

    // ----- STAT CARDS -----
    const grid = document.getElementById('statsGrid');
    grid.innerHTML =
      statCard('ic-green', '📚', U.fmt(lib.length), 'Livros no acervo', `${U.fmt(desejo.length)} na lista de desejos`) +
      statCard('ic-brown', '✅', U.fmt(concl.length), 'Livros concluídos', 'Finalizados e avaliados') +
      statCard('ic-blue', '📖', U.fmt(lendo.length), 'Em andamento', 'Sendo lidos agora') +
      statCard('ic-amber', '⭐', U.fmt(desejo.length), 'Lista de desejos', 'Quero ler futuramente') +
      statCard('ic-olive', '📄', U.fmt(pagesRead), 'Páginas lidas', `de ${U.fmt(totalPages)} disponíveis`) +
      statCard('ic-green', '📑', U.fmt(totalPages), 'Páginas no acervo', 'Total de páginas') +
      statCard('ic-amber', '🌟', avgRating, 'Avaliação média', `de ${U.fmt(rated.length)} livros avaliados`) +
      statCard('ic-brown', '📈', overallPct + '%', 'Progresso geral', 'Páginas lidas / total');

    // ----- CHART: tendência de leitura -----
    renderReadingTrend(concl, lendo);

    // ----- CHART: status do acervo (donut) -----
    renderStatusChart(lib);

    // ----- CHART: livros por gênero -----
    renderGenreChart(books);

    // ----- CHART: avaliações -----
    renderRatingChart(books);

    // ----- progresso geral -----
    renderOverallProgress(pagesRead, totalPages, overallPct, lib);
  }

  function renderReadingTrend(concl, lendo) {
    // Estima páginas lidas por mês (últimos 8 meses) usando datas de conclusão e início
    const now = new Date();
    const months = [];
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleDateString('pt-BR', { month: 'short' }), val: 0 });
    }
    const all = [...concl, ...lendo];
    all.forEach(b => {
      const ref = b.status === 'concluido' ? b.finishDate : b.startDate;
      if (!ref) return;
      const d = new Date(ref + 'T00:00:00');
      if (isNaN(d)) return;
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const m = months.find(x => x.key === key);
      if (m) {
        if (b.status === 'concluido') m.val += Number(b.totalPages) || 0;
        else m.val += Number(b.currentPage) || 0;
      }
    });
    Charts.lineChart(document.getElementById('chartReadingTrend'),
      months.map(m => m.label), months.map(m => m.val));
  }

  function renderStatusChart(lib) {
    const counts = {
      'concluido': 0, 'lendo': 0, 'nao-iniciado': 0, 'abandonado': 0
    };
    lib.forEach(b => { if (counts[b.status] !== undefined) counts[b.status]++; });
    const data = [
      { label: 'Concluído', value: counts.concluido },
      { label: 'Lendo', value: counts.lendo },
      { label: 'Não iniciado', value: counts['nao-iniciado'] },
      { label: 'Abandonado', value: counts.abandonado }
    ].filter(d => d.value > 0);
    Charts.donutChart(document.getElementById('chartStatus'), data, {
      colors: ['#3a5a47', '#4a7c59', '#b08d57', '#a0594a'],
      centerValue: U.fmt(lib.length),
      centerLabel: 'livros'
    });
  }

  function renderGenreChart(books) {
    const map = {};
    books.forEach(b => { if (b.genre) map[b.genre] = (map[b.genre] || 0) + 1; });
    const data = Object.keys(map).map(k => ({ label: k, value: map[k] }))
      .sort((a, b) => b.value - a.value).slice(0, 8);
    Charts.barChart(document.getElementById('chartGenre'), data);
  }

  function renderRatingChart(books) {
    const dist = [0, 0, 0, 0, 0]; // index 0 => 1 estrela
    books.forEach(b => { if (b.rating >= 1 && b.rating <= 5) dist[b.rating - 1]++; });
    Charts.ratingChart(document.getElementById('chartRatings'), dist);
  }

  function renderOverallProgress(pagesRead, totalPages, pct, lib) {
    const concl = lib.filter(b => b.status === 'concluido').length;
    const container = document.getElementById('overallProgress');
    container.innerHTML = `
      <div class="overall-progress">
        <div class="op-bar"><div class="op-bar__fill" style="width:0%">${pct}%</div></div>
        <div class="op-stats">
          <div>Páginas lidas: <b>${U.fmt(pagesRead)}</b></div>
          <div>Total de páginas: <b>${U.fmt(totalPages)}</b></div>
          <div>Livros concluídos: <b>${U.fmt(concl)}</b> de ${U.fmt(lib.length)}</div>
          <div>Faltam ler: <b>${U.fmt(Math.max(0, totalPages - pagesRead))}</b> páginas</div>
        </div>
      </div>`;
    requestAnimationFrame(() => {
      container.querySelector('.op-bar__fill').style.width = pct + '%';
    });
  }

  return { render };
})();
