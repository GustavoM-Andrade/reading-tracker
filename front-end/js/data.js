/* ============================================================
   data.js — Dados fictícios de demonstração (App.Data)
   ============================================================ */
window.App = window.App || {};

App.Data = (function () {
  'use strict';

  /** Lista de gêneros sugeridos no formulário */
  const GENRES = [
    'Fantasia', 'Ficção Científica', 'Romance', 'Mistério', 'Suspense',
    'Clássico', 'Histórico', 'Biografia', 'Autoajuda', 'Filosofia',
    'Aventura', 'Terror', 'Drama', 'Poesia', 'Técnico', 'Infantil'
  ];

  /**
   * Dados fictícios iniciais.
   * status: nao-iniciado | lendo | concluido | abandonado | desejo
   * Datas distribuídas entre 2025 e 2026 para que os gráficos tenham conteúdo.
   */
  const SEED = [
    {
      id: 'seed_1', title: 'O Senhor dos Anéis', author: 'J.R.R. Tolkien',
      publisher: 'Martins Fontes', genre: 'Fantasia', isbn: '9788533607328',
      cover: '', totalPages: 1200, currentPage: 300,
      startDate: '2026-09-12', finishDate: '', status: 'lendo',
      rating: 5, review: 'Obra-prima da fantasia. Mundo construído com riqueza impecável.',
      priority: '', notes: ''
    },
    {
      id: 'seed_2', title: 'Dom Casmurro', author: 'Machado de Assis',
      publisher: 'Ática', genre: 'Clássico', isbn: '9788508131201',
      cover: '', totalPages: 320, currentPage: 320,
      startDate: '2026-05-20', finishDate: '2026-06-10', status: 'concluido',
      rating: 5, review: 'Capitu inocente ou culpada? Machado é gênio na ambiguidade.',
      priority: '', notes: ''
    },
    {
      id: 'seed_3', title: '1984', author: 'George Orwell',
      publisher: 'Companhia das Letras', genre: 'Ficção Científica', isbn: '9788535914840',
      cover: '', totalPages: 416, currentPage: 416,
      startDate: '2026-04-15', finishDate: '2026-05-15', status: 'concluido',
      rating: 5, review: 'Distopia perturbadora e atual. Leitura obrigatória.',
      priority: '', notes: ''
    },
    {
      id: 'seed_4', title: 'Orgulho e Preconceito', author: 'Jane Austen',
      publisher: 'Penguin', genre: 'Romance', isbn: '9788535913567',
      cover: '', totalPages: 432, currentPage: 215,
      startDate: '2026-10-01', finishDate: '', status: 'lendo',
      rating: 4, review: '',
      priority: '', notes: ''
    },
    {
      id: 'seed_5', title: 'A Culpa é das Estrelas', author: 'John Green',
      publisher: 'Intrínseca', genre: 'Drama', isbn: '9788580572293',
      cover: '', totalPages: 288, currentPage: 288,
      startDate: '2026-06-12', finishDate: '2026-07-01', status: 'concluido',
      rating: 4, review: 'Emocionante, mas não foi exatamente o meu estilo.',
      priority: '', notes: ''
    },
    {
      id: 'seed_6', title: 'Sapiens: Uma Breve História da Humanidade', author: 'Yuval Noah Harari',
      publisher: 'L&PM', genre: 'Histórico', isbn: '9788584390889',
      cover: '', totalPages: 464, currentPage: 120,
      startDate: '2026-08-20', finishDate: '', status: 'lendo',
      rating: 5, review: '',
      priority: '', notes: ''
    },
    {
      id: 'seed_7', title: 'O Pequeno Príncipe', author: 'Antoine de Saint-Exupéry',
      publisher: 'Ediouro', genre: 'Clássico', isbn: '9788576831450',
      cover: '', totalPages: 96, currentPage: 0,
      startDate: '', finishDate: '', status: 'nao-iniciado',
      rating: 0, review: '',
      priority: '', notes: ''
    },
    {
      id: 'seed_8', title: 'It: A Coisa', author: 'Stephen King',
      publisher: 'Suma', genre: 'Terror', isbn: '9788563290013',
      cover: '', totalPages: 1104, currentPage: 380,
      startDate: '2026-04-10', finishDate: '', status: 'abandonado',
      rating: 3, review: 'Comecei muito animado, mas o ritmo não me prendeu desta vez.',
      priority: '', notes: ''
    },
    {
      id: 'seed_9', title: 'A Arte da Guerra', author: 'Sun Tzu',
      publisher: 'Martin Claret', genre: 'Filosofia', isbn: '9788572322219',
      cover: '', totalPages: 168, currentPage: 0,
      startDate: '', finishDate: '', status: 'nao-iniciado',
      rating: 0, review: '',
      priority: '', notes: ''
    },
    {
      id: 'seed_10', title: 'O Iluminado', author: 'Stephen King',
      publisher: 'Suma', genre: 'Terror', isbn: '9788576830125',
      cover: '', totalPages: 448, currentPage: 448,
      startDate: '2026-07-15', finishDate: '2026-08-12', status: 'concluido',
      rating: 4, review: 'Tenso do início ao fim. O hotel é um personagem à parte.',
      priority: '', notes: ''
    },
    {
      id: 'seed_11', title: 'Murder on the Orient Express', author: 'Agatha Christie',
      publisher: 'HarperCollins', genre: 'Mistério', isbn: '9788516030109',
      cover: '', totalPages: 256, currentPage: 256,
      startDate: '2026-08-22', finishDate: '2026-09-15', status: 'concluido',
      rating: 5, review: 'Final surpreendente. Poirot é imbatível.',
      priority: '', notes: ''
    },
    {
      id: 'seed_12', title: 'O Poder do Hábito', author: 'Charles Duhigg',
      publisher: 'Objetiva', genre: 'Autoajuda', isbn: '9788539009118',
      cover: '', totalPages: 408, currentPage: 408,
      startDate: '2026-09-20', finishDate: '2026-10-20', status: 'concluido',
      rating: 4, review: 'Boas histórias sobre como hábitos moldam a vida.',
      priority: '', notes: ''
    },
    {
      id: 'seed_13', title: 'Duna', author: 'Frank Herbert',
      publisher: 'Aleph', genre: 'Ficção Científica', isbn: '9788580579384',
      cover: '', totalPages: 688, currentPage: 0,
      startDate: '', finishDate: '', status: 'desejo',
      rating: 0, review: '',
      priority: 'alta', notes: 'Quero ler antes de assistir ao segundo filme.'
    },
    {
      id: 'seed_14', title: 'A Biblioteca da Meia-Noite', author: 'Matt Haig',
      publisher: 'Intrínseca', genre: 'Romance', isbn: '9788584391794',
      cover: '', totalPages: 304, currentPage: 0,
      startDate: '', finishDate: '', status: 'desejo',
      rating: 0, review: '',
      priority: 'media', notes: 'Indicação de uma amiga, parece reflexivo.'
    },
    {
      id: 'seed_15', title: 'Persuasão', author: 'Jane Austen',
      publisher: 'Penguin', genre: 'Clássico', isbn: '9788535913666',
      cover: '', totalPages: 280, currentPage: 0,
      startDate: '', finishDate: '', status: 'desejo',
      rating: 0, review: '',
      priority: 'baixa', notes: 'Último romance da Austen, quero completar a obra dela.'
    },
    {
      id: 'seed_16', title: 'Clean Code', author: 'Robert C. Martin',
      publisher: 'Alta Books', genre: 'Técnico', isbn: '9788576082675',
      cover: '', totalPages: 464, currentPage: 90,
      startDate: '2026-10-05', finishDate: '', status: 'lendo',
      rating: 4, review: '',
      priority: '', notes: ''
    },
    {
      id: 'seed_17', title: 'Memórias Póstumas de Brás Cubas', author: 'Machado de Assis',
      publisher: 'Martin Claret', genre: 'Clássico', isbn: '9788572321236',
      cover: '', totalPages: 320, currentPage: 320,
      startDate: '2025-11-10', finishDate: '2025-12-30', status: 'concluido',
      rating: 5, review: 'O humor ácido de Machado é revolucionário para a época.',
      priority: '', notes: ''
    }
  ];

  return { GENRES, SEED };
})();
