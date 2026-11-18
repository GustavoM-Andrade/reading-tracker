/* ============================================================
   components.js — Componentes reutilizáveis de UI (App.Components)
   ============================================================ */
window.App = window.App || {};

App.Components = (function () {
  'use strict';

  const U = App.Utils;

  /** Gera uma capa SVG (data-uri) quando não há URL de capa */
  function generateCover(book) {
    const title = book.title || 'Título';
    const author = book.author || '';
    const { hue, color } = U.colorFromString(title);
    const bg1 = `hsl(${hue}, 38%, 28%)`;
    const bg2 = `hsl(${(hue + 30) % 360}, 45%, 20%)`;
    const accent = `hsl(${(hue + 60) % 360}, 55%, 62%)`;

    const titleLines = wrapText(title, 14);
    const lineH = 22;
    const startY = 130;
    const titleSvg = titleLines.map((ln, i) =>
      `<text x="150" y="${startY + i * lineH}" text-anchor="middle" font-family="Georgia, serif" font-size="20" font-weight="700" fill="#fff">${U.esc(ln)}</text>`
    ).join('');

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${bg1}"/>
          <stop offset="1" stop-color="${bg2}"/>
        </linearGradient>
      </defs>
      <rect width="300" height="400" fill="url(#g)"/>
      <rect x="20" y="20" width="260" height="360" fill="none" stroke="${accent}" stroke-width="1.5" rx="2"/>
      <rect x="20" y="40" width="260" height="3" fill="${accent}" opacity="0.7"/>
      <rect x="20" y="357" width="260" height="3" fill="${accent}" opacity="0.7"/>
      <text x="150" y="85" text-anchor="middle" font-family="Georgia, serif" font-size="13" fill="${accent}" letter-spacing="3">LIVRO</text>
      ${titleSvg}
      <line x1="110" y1="${startY + titleLines.length * lineH + 4}" x2="190" y2="${startY + titleLines.length * lineH + 4}" stroke="${accent}" stroke-width="1" opacity="0.6"/>
      ${author ? `<text x="150" y="${startY + titleLines.length * lineH + 28}" text-anchor="middle" font-family="Georgia, serif" font-size="13" font-style="italic" fill="#fff" opacity="0.82">${U.esc(author)}</text>` : ''}
    </svg>`;

    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  /** Quebra texto em linhas de tamanho aproximado */
  function wrapText(text, maxChars) {
    const words = String(text).split(' ');
    const lines = [];
    let line = '';
    for (const w of words) {
      if ((line + ' ' + w).trim().length > maxChars) {
        if (line) lines.push(line.trim());
        line = w;
      } else {
        line = (line + ' ' + w).trim();
      }
    }
    if (line) lines.push(line.trim());
    return lines.slice(0, 4);
  }

  /** Retorna a URL de capa a ser usada (real ou gerada) */
  function coverUrl(book) {
    if (book.cover && /^https?:\/\//.test(book.cover)) return book.cover;
    return generateCover(book);
  }

  /** Renderiza estrelas de avaliação (1-5) */
  function starsHTML(rating, opts) {
    opts = opts || {};
    const showNumber = opts.showNumber !== false;
    const size = opts.size || '';
    let html = '<span class="stars' + (size ? ' ' + size : '') + '">';
    for (let i = 1; i <= 5; i++) {
      html += `<span class="star${i <= rating ? ' on' : ''}">★</span>`;
    }
    html += '</span>';
    if (showNumber && rating > 0) {
      html += `<small>${rating}.0</small>`;
    } else if (showNumber) {
      html += '<small>sem nota</small>';
    }
    return html;
  }

  /** Monta o HTML do bloco de capa (img + fallback) */
  function coverHTML(book) {
    const url = coverUrl(book);
    return `<img src="${U.esc(url)}" alt="Capa de ${U.esc(book.title)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='grid';" />
    <div class="cover-fallback" style="display:none;background:${U.colorFromString(book.title).color}">
      <div class="cover-fallback__bottom"></div>
      <div class="cover-fallback__title">${U.esc(book.title)}</div>
      <div class="cover-fallback__author">${U.esc(book.author)}</div>
    </div>`;
  }

  /** Card de livro para a biblioteca */
  function libraryCard(book) {
    const p = U.calcProgress(book);
    const stLabel = U.STATUS_LABELS[book.status];
    const stClass = U.STATUS_CLASSES[book.status] || '';
    const showProgress = ['lendo', 'nao-iniciado', 'abandonado'].includes(book.status);

    let progressHTML = '';
    if (showProgress) {
      progressHTML = `
        <div class="book-card__progress">
          <div class="progress-mini"><div class="progress-mini__fill" style="width:${p.percent}%"></div></div>
          <div class="book-card__progress-meta"><span>${U.fmt(p.current)} / ${U.fmt(p.total)} págs.</span><span>${p.percent}%</span></div>
        </div>`;
    }
    const ratingHTML = book.rating > 0
      ? `<div class="book-card__rating">${starsHTML(book.rating, { showNumber: false })}</div>`
      : '';
    const finishHTML = (book.status === 'concluido' && book.finishDate)
      ? `<div class="book-card__finish">Concluído em ${U.fmtDate(book.finishDate)}</div>`
      : '';

    return `
      <article class="book-card" data-id="${U.esc(book.id)}">
        <div class="book-card__cover">
          ${coverHTML(book)}
          <span class="book-card__status ${stClass}">${stLabel}</span>
        </div>
        <div class="book-card__body">
          <h3 class="book-card__title" title="${U.esc(book.title)}">${U.esc(book.title)}</h3>
          <div class="book-card__author">${U.esc(book.author)}</div>
          <div class="book-card__meta"><span class="book-card__genre-tag">${U.esc(book.genre)}</span> <span>• ${U.fmt(book.totalPages)} págs.</span></div>
          ${ratingHTML}
          ${finishHTML}
          ${progressHTML}
        </div>
        <div class="book-card__actions">
          <button class="icon-btn" data-act="view" title="Ver detalhes">👁️</button>
          <button class="icon-btn" data-act="edit" title="Editar">✏️</button>
          <button class="icon-btn" data-act="progress" title="Atualizar progresso">📊</button>
          <button class="icon-btn danger" data-act="delete" title="Excluir">🗑️</button>
        </div>
      </article>`;
  }

  /** Card de livro para a lista de desejos */
  function wishlistCard(book) {
    const prClass = U.PRIORITY_CLASSES[book.priority] || 'pr-media';
    const prLabel = U.PRIORITY_LABELS[book.priority] || 'Média';
    return `
      <article class="book-card" data-id="${U.esc(book.id)}">
        <div class="book-card__cover">
          ${coverHTML(book)}
          <span class="book-card__priority ${prClass}">Prioridade ${prLabel}</span>
        </div>
        <div class="book-card__body">
          <h3 class="book-card__title" title="${U.esc(book.title)}">${U.esc(book.title)}</h3>
          <div class="book-card__author">${U.esc(book.author)}</div>
          <div class="book-card__meta"><span class="book-card__genre-tag">${U.esc(book.genre)}</span> <span>• ${U.fmt(book.totalPages)} págs.</span></div>
          ${book.notes ? `<p style="font-size:.8rem;color:var(--text-mut);margin-top:6px;font-style:italic">"${U.esc(book.notes)}"</p>` : ''}
        </div>
        <div class="book-card__actions">
          <button class="icon-btn" data-act="edit" title="Editar">✏️</button>
          <button class="icon-btn" data-act="start" title="Mover para biblioteca e começar a ler">📖</button>
          <button class="icon-btn danger" data-act="delete" title="Excluir">🗑️</button>
        </div>
      </article>`;
  }

  /** Card de leitura atual (com controles de progresso) */
  function readingCard(book) {
    const p = U.calcProgress(book);
    return `
      <article class="reading-card" data-id="${U.esc(book.id)}">
        <div class="reading-card__cover">
          ${coverHTML(book)}
        </div>
        <div class="reading-card__body">
          <h2 class="reading-card__title">${U.esc(book.title)}</h2>
          <div class="reading-card__author">${U.esc(book.author)}</div>
          ${book.genre ? `<div style="font-size:.8rem;color:var(--text-mut)">Gênero: ${U.esc(book.genre)}</div>` : ''}
          <div class="reading-stats">
            <div class="reading-stat"><b>${U.fmt(p.current)}</b><span>Página atual</span></div>
            <div class="reading-stat"><b>${U.fmt(p.remaining)}</b><span>Páginas restantes</span></div>
            <div class="reading-stat"><b>${p.percent}%</b><span>Concluído</span></div>
          </div>
          <div class="reading-progress">
            <div class="reading-progress__top">
              <span>Progresso de leitura</span>
              <span class="reading-progress__pct">${p.percent}%</span>
            </div>
            <div class="progress-bar"><div class="progress-bar__fill" style="width:${p.percent}%"></div></div>
            <div style="font-size:.76rem;color:var(--text-mut);margin-top:5px">Total: ${U.fmt(p.total)} páginas</div>
          </div>
          <div class="reading-update">
            <div class="field">
              <label for="pg_${U.esc(book.id)}">Atualizar página atual</label>
              <input type="number" id="pg_${U.esc(book.id)}" min="0" max="${p.total}" step="1" value="${p.current}" />
            </div>
            <button class="btn btn--primary" data-act="save-progress">Salvar</button>
            <button class="btn btn--ghost" data-act="finish" title="Marcar como concluído">✓ Concluir</button>
          </div>
        </div>
      </article>`;
  }

  /** Modal de detalhes do livro (somente leitura) */
  function detailsHTML(book) {
    const p = U.calcProgress(book);
    const stLabel = U.STATUS_LABELS[book.status];
    const rows = [
      ['Autor', book.author],
      ['Editora', book.publisher || '—'],
      ['Gênero', book.genre],
      ['ISBN', book.isbn || '—'],
      ['Total de páginas', U.fmt(book.totalPages)],
      ['Página atual', U.fmt(p.current)],
      ['Páginas restantes', U.fmt(p.remaining)],
      ['Progresso', p.percent + '%'],
      ['Status', stLabel],
      ['Início', U.fmtDate(book.startDate)],
      ['Conclusão', U.fmtDate(book.finishDate)],
      ['Avaliação', book.rating > 0 ? book.rating + ' estrelas' : '—'],
      ['Prioridade', book.priority ? U.PRIORITY_LABELS[book.priority] : '—']
    ];
    const rowsHTML = rows.map(r => `<div style="padding:8px 0;border-bottom:1px solid var(--beige-100);display:flex;justify-content:space-between;gap:14px"><span style="color:var(--text-mut);font-size:.86rem">${U.esc(r[0])}</span><span style="font-weight:600;text-align:right">${U.esc(r[1])}</span></div>`).join('');
    return `
      <div style="display:grid;grid-template-columns:140px 1fr;gap:20px;margin-bottom:18px">
        <div style="aspect-ratio:3/4;border-radius:8px;overflow:hidden;box-shadow:var(--shadow)">${coverHTML(book)}</div>
        <div>
          <h2 style="font-family:var(--font);color:var(--brown-600);font-size:1.5rem;margin-bottom:4px">${U.esc(book.title)}</h2>
          ${book.rating > 0 ? `<div class="book-card__rating">${starsHTML(book.rating)}</div>` : ''}
          ${book.status === 'lendo' || book.status === 'nao-iniciado' ? `<div style="margin-top:10px"><div class="progress-bar"><div class="progress-bar__fill" style="width:${p.percent}%"></div></div><div style="font-size:.78rem;color:var(--text-mut);margin-top:5px">${p.percent}% • ${U.fmt(p.current)}/${U.fmt(p.total)} páginas</div></div>` : ''}
        </div>
      </div>
      <div>${rowsHTML}</div>
      ${book.review ? `<div style="margin-top:16px;padding:14px;background:var(--beige-50);border-radius:10px;border-left:3px solid var(--brown-400)"><strong style="color:var(--brown-600);font-family:var(--font)">Resenha:</strong><p style="margin-top:6px;font-size:.9rem;line-height:1.6;color:var(--text)">${U.esc(book.review)}</p></div>` : ''}
      ${book.notes ? `<div style="margin-top:10px;padding:10px;background:var(--beige-50);border-radius:10px"><strong style="color:var(--brown-600);font-family:var(--font)">Observações:</strong><p style="margin-top:4px;font-size:.88rem;color:var(--text-soft);font-style:italic">${U.esc(book.notes)}</p></div>` : ''}
    `;
  }

  return {
    generateCover, coverUrl, coverHTML, starsHTML,
    libraryCard, wishlistCard, readingCard, detailsHTML
  };
})();
