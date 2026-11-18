/* ============================================================
   charts.js — Gráficos SVG customizados (App.Charts)
   Sem dependências externas — funciona offline.
   ============================================================ */
window.App = window.App || {};

App.Charts = (function () {
  'use strict';

  const U = App.Utils;

  /* ---------------- Gráfico de barras horizontais ---------------- */
  function barChart(container, data, opts) {
    opts = opts || {};
    const fill = opts.fill || 'linear-gradient(90deg, var(--green-600), var(--green-400))';
    const fillStyle = opts.gradientCSS
      ? `background: ${opts.gradientCSS}`
      : `background: linear-gradient(90deg, var(--green-600), var(--green-400))`;

    if (!data.length) {
      container.innerHTML = '<p style="color:var(--text-mut);text-align:center;padding:30px">Sem dados para exibir.</p>';
      return;
    }
    const max = Math.max(...data.map(d => d.value), 1);
    const rows = data.map(d => {
      const w = max ? Math.max(2, (d.value / max) * 100) : 0;
      return `
        <div class="bar-row">
          <div class="bar-row__label" title="${U.esc(d.label)}">${U.esc(d.label)}</div>
          <div class="bar-row__track"><div class="bar-row__fill" style="width:0%;${fillStyle}"></div></div>
          <div class="bar-row__val">${U.fmt(d.value)}</div>
        </div>`;
    }).join('');
    container.innerHTML = `<div class="chart-bar">${rows}</div>`;
    // anima
    requestAnimationFrame(() => {
      container.querySelectorAll('.bar-row__fill').forEach((el, i) => {
        const d = data[i];
        const w = max ? Math.max(2, (d.value / max) * 100) : 0;
        el.style.width = w + '%';
      });
    });
  }

  /* ---------------- Donut chart ---------------- */
  function donutChart(container, data, opts) {
    opts = opts || {};
    const colors = opts.colors || ['#3a5a47', '#a0763e', '#4a7c59', '#b08d57', '#a0594a', '#6b4f2f', '#6fa37e'];
    const total = data.reduce((s, d) => s + d.value, 0);

    if (!total) {
      container.innerHTML = '<p style="color:var(--text-mut);text-align:center;padding:30px">Nenhum livro cadastrado.</p>';
      return;
    }

    const size = 200, stroke = 28, r = (size - stroke) / 2;
    const cx = size / 2, cy = size / 2;
    const circ = 2 * Math.PI * r;
    let offset = 0;
    const segments = data.map((d, i) => {
      const frac = d.value / total;
      const len = frac * circ;
      const seg = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none"
        stroke="${colors[i % colors.length]}" stroke-width="${stroke}"
        stroke-dasharray="${len} ${circ - len}" stroke-dashoffset="${-offset}"
        transform="rotate(-90 ${cx} ${cy})" style="transition:stroke-dasharray .8s ease"/>`;
      offset += len;
      return seg;
    }).join('');

    const centerVal = opts.centerValue !== undefined ? opts.centerValue : U.fmt(total);
    const centerLbl = opts.centerLabel || 'livros';

    const legend = data.map((d, i) =>
      `<div class="donut-legend__item"><span class="donut-legend__dot" style="background:${colors[i % colors.length]}"></span>${U.esc(d.label)} <b style="color:var(--brown-600)">${U.fmt(d.value)}</b></div>`
    ).join('');

    container.innerHTML = `
      <div class="donut-wrap">
        <div class="donut">
          <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
            <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#f5efe0" stroke-width="${stroke}"/>
            ${segments}
          </svg>
          <div class="donut__center"><b>${centerVal}</b><span>${centerLbl}</span></div>
        </div>
        <div class="donut-legend">${legend}</div>
      </div>`;
  }

  /* ---------------- Gráfico de distribuição de avaliações ---------------- */
  function ratingChart(container, distribution) {
    // distribution: array length 5, index 0 => 1 star ... index 4 => 5 stars
    const max = Math.max(...distribution, 1);
    const bars = distribution.map((count, i) => {
      const stars = i + 1;
      const h = (count / max) * 100;
      return `
        <div class="rating-bar">
          <div class="rating-bar__count">${count}</div>
          <div class="rating-bar__col" style="height:0%" data-h="${Math.max(count ? 4 : 0, h)}%"></div>
          <div class="rating-bar__stars">${'★'.repeat(stars)}</div>
        </div>`;
    }).join('');
    container.innerHTML = `<div class="rating-bars">${bars}</div>`;
    requestAnimationFrame(() => {
      container.querySelectorAll('.rating-bar__col').forEach(el => {
        el.style.height = el.dataset.h;
      });
    });
  }

  /* ---------------- Gráfico de linha (tendência de leitura) ---------------- */
  function lineChart(container, labels, values, opts) {
    opts = opts || {};
    const W = 560, H = 220, pad = { l: 40, r: 16, t: 16, b: 30 };
    const innerW = W - pad.l - pad.r;
    const innerH = H - pad.t - pad.b;
    const max = Math.max(...values, opts.minMax || 1);
    const min = 0;
    const n = labels.length;

    if (!n) {
      container.innerHTML = '<p style="color:var(--text-mut);text-align:center;padding:30px">Sem dados ainda.</p>';
      return;
    }

    const xStep = n > 1 ? innerW / (n - 1) : 0;
    const points = values.map((v, i) => {
      const x = pad.l + i * xStep;
      const y = pad.t + innerH - ((v - min) / (max - min || 1)) * innerH;
      return { x, y, v };
    });

    const pathD = points.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join('');
    const areaD = pathD + ` L${pad.l + (n - 1) * xStep},${pad.t + innerH} L${pad.l},${pad.t + innerH} Z`;

    // grid + labels y
    const yTicks = 4;
    let gridHTML = '';
    for (let i = 0; i <= yTicks; i++) {
      const val = min + ((max - min) / yTicks) * i;
      const y = pad.t + innerH - (i / yTicks) * innerH;
      gridHTML += `<line class="grid" x1="${pad.l}" y1="${y}" x2="${pad.l + innerW}" y2="${y}"/>
        <text class="lbl" x="${pad.l - 6}" y="${y + 3}" text-anchor="end">${Math.round(val)}</text>`;
    }

    const xLabels = points.map((p, i) => {
      const show = n <= 12 || i % Math.ceil(n / 8) === 0 || i === n - 1;
      return show ? `<text class="lbl" x="${p.x}" y="${H - 8}" text-anchor="middle">${U.esc(labels[i])}</text>` : '';
    }).join('');

    const dots = points.map(p =>
      `<circle class="dot" cx="${p.x}" cy="${p.y}" r="4"><title>${U.fmt(p.v)} páginas</title></circle>`
    ).join('');

    const valLabels = points.map(p =>
      `<text class="lbl-val" x="${p.x}" y="${p.y - 9}" text-anchor="middle">${p.v > 0 ? U.fmt(p.v) : ''}</text>`
    ).join('');

    container.innerHTML = `
      <svg class="line-chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" style="width:100%;height:auto">
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#4a7c59" stop-opacity="0.35"/>
            <stop offset="1" stop-color="#4a7c59" stop-opacity="0"/>
          </linearGradient>
        </defs>
        ${gridHTML}
        <path class="area" d="${areaD}"/>
        <path class="line" d="${pathD}"/>
        ${valLabels}
        ${dots}
        ${xLabels}
      </svg>`;
  }

  return { barChart, donutChart, ratingChart, lineChart };
})();
