# Reading Tracker

A browser-based reading tracker for organizing authors, books, and reading records. This repository is currently being prepared for **Delivery 1 (front-end only)** of the Web Development course assignment at UNIFAL-MG.

The first delivery uses vanilla HTML, CSS, and JavaScript. Data is loaded from the instructor-provided seed file and saved in the browser's `localStorage`; there is no back-end or remote database in this delivery.

## Delivery schedule

| Delivery | Scope | Due date | Git tag |
|---|---|---|---|
| 1 – Front-end | HTML, CSS, JavaScript, seed data, and `localStorage` | Nov 20, 2026, 23:59 (Brasília) | `delivery-1` |
| 2 – Full stack | Spring Boot REST API, persistence, and front-end integration | Dec 11, 2026, 23:59 (Brasília) | `delivery-2` |

## Current front-end features

- Dashboard metrics for books, authors, readings, and average grade.
- Reading status distribution and grade-range visualizations.
- Reading log sorted by title, authors, status, year read, or grade. Missing values are shown as `-`.
- Search in the current section: readings, books, or authors. Search checks relevant visible data, including book themes and author names.
- Pagination for readings, books, and authors, with up to 25 records per page.
- Create, edit, and delete authors, books, and reading records.
- Optional creation of a first reading while adding a book, including its status, year, grade, priority, recommendation, and notes.
- Existing authors and themes can be selected when creating or editing a book; new themes can also be entered.
- Status-aware reading form and validation for required fields, dates, years, grades, references, and allowed status transitions.
- An author linked to a book cannot be deleted. Deleting a book asks for confirmation and also removes its readings.
- Seed data is loaded on first use. **Reset data** restores the original seed and discards browser-local changes.
- Warm library-inspired interface colors and responsive layout.

## Run the application

The application must be served over HTTP because it loads `data/seed.json` with `fetch`; opening `index.html` directly with a `file://` URL will not work.

1. Open the repository in Visual Studio Code.
2. Install the **Live Server** extension if it is not already installed.
3. Open `front-end/index.html` and select **Open with Live Server**.
4. Use the address opened by Live Server, usually `http://127.0.0.1:5500/front-end/`.

No Java, Node.js, npm, or build step is required for Delivery 1. The first launch loads `front-end/data/seed.json` into `localStorage`; subsequent launches use the saved browser data. Use **Reset data** to reload the seed.

## Project structure

```text
.
├── README.md
├── .gitignore
└── front-end/
    ├── index.html
    ├── css/
    │   ├── tracker.css       # Active application styles
    │   └── styles.css        # Earlier stylesheet; not loaded by index.html
    ├── data/
    │   └── seed.json         # Instructor-provided initial data
    └── js/
        ├── strings.js        # Statuses, options, and interface messages
        ├── store.js          # Seed loading and localStorage data access
        ├── validation.js     # Form validation rules
        ├── render.js         # Tables, metrics, charts, search, and pagination
        ├── main.js           # Forms, event handling, and application flow
        └── ...               # Earlier JavaScript modules not loaded by index.html
```

The active scripts are included at the end of `front-end/index.html`. The extra CSS and JavaScript files are retained in the folder but are not part of the current running application.

## Requirement checklist

Status refers to the current **Delivery 1 front-end**. Optional assignment exercises are identified separately.

| Requirement | Delivery 1 status | Notes |
|---|---|---|
| Manage authors | Implemented | Create, edit, delete; linked authors are protected from deletion. |
| Manage books | Implemented | Create, edit, delete; select authors and themes, or add themes. |
| Manage readings | Implemented | Create, edit, delete; adding a book can optionally create its first reading. |
| Reading status workflow | Implemented | Status controls which year, grade, and priority fields are available and valid. |
| Reading log and ordering | Implemented | Sortable columns and `-` for missing values. |
| Input validation | Implemented | Validation feedback appears next to the relevant fields. |
| Seed data and reset | Implemented | Seed is loaded on first use; reset restores it. |
| Search and pagination | Implemented | Search applies to the current section; lists show 25 records per page. |
| Statistics and charts | Implemented | Dashboard metrics, status distribution, and grade ranges. |
| Wishlist, century/nationality views, Open Library, import/export, login | Not implemented | Optional features; outside the current front-end scope. |
| REST API, server persistence, DTOs, global API error handling, Docker database | Not implemented | Planned for Delivery 2. |

## Delivery 2

The Spring Boot API, server-side persistence, and integration with this front-end are not part of the current delivery. Update this section when those features are implemented, including Java version, run instructions, and API endpoint examples.

## Libraries

The active front-end currently uses vanilla HTML, CSS, and JavaScript without external runtime libraries.

## Team members

| Name | Student ID | GitHub |
|---|---|---|
| Thyago Pereira de Carvalho | 2024.1.08.039 | [Thyago-bat](https://github.com/Thyago-bat) |
| Wagner Donizete Gonçalves | 2019.1.08.047 | [Wagner2196](https://github.com/Wagner2196) |
| Gustavo Andrade Moreira de Assis | 2024.1.08.012 | [GustavoM-Andrade](https://github.com/GustavoM-Andrade) |
| Gabriel Ramirez Cardoso Rodrigues | 2024.1.08.033 | [Gabrielrzdev](https://github.com/Gabrielrzdev) |
| Bartholomeu Vitor Neto | 2024.1.08.043 | [BartholomeuVitor](https://github.com/BartholomeuVitor) |

## AI usage

Record AI assistance used by each team member in accordance with the assignment instructions.

| Tool | Used for | Parts affected |
|---|---|---|
| Claude | Drafted the initial README structure (as previously recorded by the team). | `README.md` |
| OpenAI Codex | Assisted with front-end implementation and README updates. | `front-end/`, `README.md` |

## Video

Delivery 2 video: _to be added_.

## Team workflow

- Each team member should commit their own work with a message describing the change.
- Pull the latest changes before starting work and before pushing.
- Tag the commit submitted for each delivery before the deadline. For Delivery 1:

  ```bash
  git tag delivery-1
  git push origin delivery-1
  ```
