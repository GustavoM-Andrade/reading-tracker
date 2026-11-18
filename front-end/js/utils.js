/* ============================================================
   utils.js — Funções utilitárias globais (App.Utils)
   ============================================================ */
window.App = window.App || {};

App.Utils = (function () {
  'use strict';

  /** Gera um id único simples */
  function uid() {
    return 'b_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  }

  /** Escapa HTML para evitar injeção ao montar strings */
  function esc(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /** Formata número com separador de milhar (pt-BR) */
  function fmt(n) {
    if (n === null || n === undefined || isNaN(n)) return '0';
    return Number(n).toLocaleString('pt-BR');
  }

  /** Formata data ISO (yyyy-mm-dd) para dd/mm/aaaa */
  function fmtDate(iso) {
    if (!iso) return '—';
    const parts = String(iso).split('-');
    if (parts.length !== 3) return iso;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  /** Extrai o ano de uma data ISO */
  function yearOf(iso) {
    if (!iso) return '';
    return String(iso).split('-')[0];
  }

  /** Data de hoje no formato ISO yyyy-mm-dd */
  function todayISO() {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${m}-${day}`;
  }

  /** Debounce simples */
  function debounce(fn, ms) {
    let t;
    return function () {
      const ctx = this, args = arguments;
      clearTimeout(t);
      t = setTimeout(() => fn.apply(ctx, args), ms);
    };
  }

  /** Exibe um toast rápido */
  function toast(msg, type) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.className = 'toast' + (type ? ' ' + type : '');
    const icon = type === 'error' ? '⚠️' : type === 'info' ? 'ℹ️' : '✅';
    el.innerHTML = `<span>${icon}</span><span>${esc(msg)}</span>`;
    requestAnimationFrame(() => el.classList.add('show'));
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 2800);
  }

  /** Gera uma cor estável a partir de uma string (hash) */
  function colorFromString(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
    const hue = Math.abs(h) % 360;
    return { hue, color: `hsl(${hue}, 42%, 32%)` };
  }

  /** Limita um número a um intervalo */
  function clamp(n, min, max) {
    if (isNaN(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  /** Converte status para rótulo legível */
  const STATUS_LABELS = {
    'nao-iniciado': 'Não iniciado',
    'lendo': 'Lendo',
    'concluido': 'Concluído',
    'abandonado': 'Abandonado',
    'desejo': 'Desejo'
  };
  const STATUS_CLASSES = {
    'nao-iniciado': 'st-nao',
    'lendo': 'st-lendo',
    'concluido': 'st-concl',
    'abandonado': 'st-aband'
  };
  const PRIORITY_LABELS = { alta: 'Alta', media: 'Média', baixa: 'Baixa' };
  const PRIORITY_CLASSES = { alta: 'pr-alta', media: 'pr-media', baixa: 'pr-baixa' };

  /** Calcula progresso de leitura de um livro */
  function calcProgress(book) {
    const total = Number(book.totalPages) || 0;
    let current = Number(book.currentPage) || 0;
    if (total <= 0) {
      return { total: 0, current: 0, remaining: 0, percent: 0 };
    }
    current = clamp(current, 0, total);
    const remaining = total - current;
    const percent = clamp(Math.round((current / total) * 100), 0, 100);
    return { total, current, remaining, percent };
  }

  return {
    uid, esc, fmt, fmtDate, yearOf, todayISO, debounce, toast,
    colorFromString, clamp,
    STATUS_LABELS, STATUS_CLASSES, PRIORITY_LABELS, PRIORITY_CLASSES,
    calcProgress
  };
})();
