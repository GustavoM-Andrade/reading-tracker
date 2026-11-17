# Reading Tracker

Full-stack web application that replaces a reader's Word document log with structured data, consistent input and views that are computed automatically.

Semester assignment (Trabalho #2), Web Development course, Computer Science, UNIFAL-MG. Instructor: Rodrigo Martins Pagliares.

| Delivery | Scope | Due date | Git tag |
|---|---|---|---|
| 1 – Frontend | Vanilla HTML, CSS and JavaScript, data stored in `localStorage` | Nov 20, 2026, 23:59 (Brasília) | `delivery-1` |
| 2 – Full stack | Spring Boot REST API, persistence, frontend integrated with the API | Dec 11, 2026, 23:59 (Brasília) | `delivery-2` |

---

## Team members

| Name | Student ID | GitHub |
|---|---|---|
| Thyago Pereira de Carvalho | 2024.1.08.039 | [Thyago-bat](https://github.com/Thyago-bat) |
| Wagner Donizete Gonçalves | 2019.1.08.047 | [Wagner2196](https://github.com/Wagner2196) |
| Gustavo Andrade Moreira de Assis | 2024.1.08.012 | [GustavoM-Andrade](https://github.com/GustavoM-Andrade) |
| Gabriel Ramirez Cardoso Rodrigues | 2024.1.08.033 | [Gabrielrzdev](https://github.com/Gabrielrzdev) |
| Bartholomeu Vitor Neto | 2024.1.08.043 | [BartholomeuVitor](https://github.com/BartholomeuVitor) |

> Team composition is fixed for both deliveries.

---

## How to run

### Delivery 1 – Frontend

No Java, Node or npm is needed. The pages must be served by a local static server, because `fetch` (used to load `seed.json`) does not work when a page is opened directly from disk (`file://`).

1. Clone the repository:
   ```bash
   git clone https://github.com/Thyago-bat/reading-tracker.git
   ```
2. Open the cloned folder in **VS Code**.
3. Install the **Live Server** extension (Extensions tab, search for "Live Server", by Ritwick Dey).
4. In the file explorer, right-click `frontend/index.html` and choose **Open with Live Server**.
5. The browser opens the application (usually at `http://127.0.0.1:5500/frontend/index.html`).

On the first visit the seed data (`frontend/data/seed.json`) is loaded into `localStorage`. Later visits read only from `localStorage`. To start over, use **Reset data** in the application.

Tested on: BROWSER AND VERSION.

### Delivery 2 – Full stack

_To be completed in Delivery 2._ The application will start with a single command from the project folder (`./mvnw spring-boot:run`, or `mvnw.cmd spring-boot:run` on Windows) and open at `http://localhost:8080`.

Java version used: _to be filled in Delivery 2_.

---

## Project structure

```
.
├── README.md
├── .gitignore
└── frontend/
    ├── index.html          # pages (one or more .html files)
    ├── css/
    │   └── style.css
    ├── js/
    │   ├── store.js        # all data access (async functions); rewritten in Delivery 2 to call the API
    │   ├── validation.js   # Section 4 rules
    │   ├── render.js       # DOM rendering
    │   ├── strings.js      # all interface text in one place
    │   └── main.js         # entry point, event listeners
    └── data/
        └── seed.json       # instructor-provided seed data
```

In Delivery 2 the `frontend/` folder is copied into `src/main/resources/static`, and `seed.json` into `src/main/resources/`.

---

## Requirement checklist

Status: **Implemented** / **Partially implemented** / **Not implemented**

### Core requirements

| ID | Requirement | Delivery 1 | Delivery 2 |
|---|---|---|---|
| FR-01 | Manage authors (linked author cannot be deleted) | Not implemented | Not implemented |
| FR-02 | Manage books (authors and themes selected from existing records) | Not implemented | Not implemented |
| FR-03 | Manage readings (first reading in the book form, cascade delete with confirmation) | Not implemented | Not implemented |
| FR-04 | Status workflow | Not implemented | Not implemented |
| FR-05 | Reading log (sortable, missing values as "-") | Not implemented | Not implemented |
| FR-06 | Validation (messages next to fields) | Not implemented | Not implemented |
| FR-07 | Seed data and Reset data | Not implemented | Not implemented |

### Optional exercises (not graded)

| ID | Requirement | Status |
|---|---|---|
| FR-08 | Filters and search | Not implemented |
| FR-09 | Wishlist | Not implemented |
| FR-10 | Books by century | Not implemented |
| FR-11 | Authors by nationality | Not implemented |
| FR-12 | Statistics | Not implemented |
| FR-13 | Charts | Not implemented |
| FR-14 | Autofill from Open Library | Not implemented |
| FR-15 | Import and export | Not implemented |
| FR-16 | Users and login | Not implemented |
| FR-17 | External database with Docker | Not implemented |
| FR-18 | DTOs and global error handling | Not implemented |

---

## API endpoints

_To be completed in Delivery 2_ (method, path, purpose, and one request/response example for authors, books and readings).

---

## Libraries

Only what Section 3 of the statement allows. Libraries that needed instructor approval:

| Library | Purpose | Approval |
|---|---|---|
| None | — | — |

---

## AI usage

| Tool | Used for | Parts affected |
|---|---|---|
| Claude | Drafted the initial structure of this README | `README.md` |

_Each member adds a row for every AI tool they use. If no tool was used for a part, say so._

---

## Video

_Delivery 2 only:_ LINK TO VIDEO

---

## Team workflow

- Each member commits their own work, with messages that describe the change, so every contribution shows in the commit history.
- Run `git pull` before starting work and before every `git push`.
- The graded commit of each delivery is marked with a tag before the deadline:
  ```bash
  git tag delivery-1
  git push origin delivery-1
  ```
