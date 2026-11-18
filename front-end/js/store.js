/* ============================================================
   store.js — Acesso assíncrono aos dados (LocalStorage no front-end)
   Mantém os formatos do seed.json para facilitar a integração com a API.
   ============================================================ */
window.App = window.App || {};

App.Store = (function () {
  'use strict';

  const KEY = 'reading-tracker:data:v1';
  const SEED_URL = 'data/seed.json';
  const COLLECTIONS = ['countries', 'authors', 'themes', 'books', 'readings'];
  let data = null;

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function validateData(value) {
    const errors = {};
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      errors.data = 'Seed data must be a JSON object.';
    } else {
      COLLECTIONS.forEach(name => {
        if (!Array.isArray(value[name])) errors[name] = 'Expected an array.';
      });
    }
    if (Object.keys(errors).length) {
      const error = new Error('The seed data has an invalid format.');
      error.fieldErrors = errors;
      throw error;
    }
    return value;
  }

  function persist() {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (cause) {
      const error = new Error('Could not save data in localStorage.');
      error.fieldErrors = { storage: error.message };
      error.cause = cause;
      throw error;
    }
  }

  async function initialize() {
    const saved = localStorage.getItem(KEY);
    if (saved !== null) {
      try {
        data = validateData(JSON.parse(saved));
        return clone(data);
      } catch (cause) {
        if (cause.fieldErrors) throw cause;
        const error = new Error('Saved data in localStorage is not valid JSON.');
        error.fieldErrors = { storage: error.message };
        error.cause = cause;
        throw error;
      }
    }

    const response = await fetch(SEED_URL);
    if (!response.ok) {
      throw new Error(`Could not load ${SEED_URL} (HTTP ${response.status}).`);
    }
    data = validateData(await response.json());
    persist();
    return clone(data);
  }

  function requireData() {
    if (!data) throw new Error('Call initialize() before using the store.');
  }

  async function getAll() {
    requireData();
    return clone(data);
  }

  async function getCollection(name) {
    requireData();
    if (!COLLECTIONS.includes(name)) throw new Error(`Unknown collection: ${name}`);
    return clone(data[name]);
  }

  async function nextId(name) {
    requireData();
    if (!COLLECTIONS.includes(name)) throw new Error(`Unknown collection: ${name}`);
    const records = data[name];
    return records.reduce((highest, record) => Math.max(highest, Number(record.id) || 0), 0) + 1;
  }

  async function saveRecord(name, record) {
    requireData();
    if (!COLLECTIONS.includes(name)) throw new Error(`Unknown collection: ${name}`);
    const records = data[name];
    const savedRecord = clone(record);
    if (!Number.isInteger(Number(savedRecord.id)) || Number(savedRecord.id) < 1) {
      savedRecord.id = await nextId(name);
    } else {
      savedRecord.id = Number(savedRecord.id);
    }
    const index = records.findIndex(item => item.id === savedRecord.id);
    if (index === -1) records.push(savedRecord);
    else records[index] = savedRecord;
    persist();
    return clone(savedRecord);
  }

  async function deleteRecord(name, id) {
    requireData();
    if (!COLLECTIONS.includes(name)) throw new Error(`Unknown collection: ${name}`);
    data[name] = data[name].filter(record => record.id !== Number(id));
    persist();
  }

  async function reset() {
    localStorage.removeItem(KEY);
    data = null;
    return initialize();
  }

  return {
    KEY,
    COLLECTIONS: [...COLLECTIONS],
    initialize,
    getAll,
    getCollection,
    nextId,
    saveRecord,
    deleteRecord,
    reset
  };
})();
