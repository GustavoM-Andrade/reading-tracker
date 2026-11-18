/* ============================================================
   storage.js — Persistência em LocalStorage (App.Storage)
   ============================================================ */
window.App = window.App || {};

App.Storage = (function () {
  'use strict';

  const KEY = 'minha-biblioteca:books:v1';

  /** Lê todos os livros do LocalStorage */
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!Array.isArray(data)) return null;
      return data;
    } catch (e) {
      console.error('Erro ao ler LocalStorage:', e);
      return null;
    }
  }

  /** Salva todos os livros */
  function save(books) {
    try {
      localStorage.setItem(KEY, JSON.stringify(books));
      return true;
    } catch (e) {
      console.error('Erro ao salvar LocalStorage:', e);
      return false;
    }
  }

  /** Limpa todos os dados salvos */
  function clear() {
    localStorage.removeItem(KEY);
  }

  /** Verifica se já existem dados salvos */
  function exists() {
    return localStorage.getItem(KEY) !== null;
  }

  return { load, save, clear, exists, KEY };
})();
