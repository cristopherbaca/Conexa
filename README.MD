# Conexa

Responsive light/dark web implementation of the Conexa interface from
[`docs/pdfs/Conexa.pdf`](./docs/pdfs/Conexa.pdf).

## Run

Open [`index.html`](./index.html) directly in a browser. If the browser blocks
local ES modules, serve the repository with any static server and open `/`.

Example:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000/`.

## Included screens

- Knowledge-base overview with KPI strip, cards, activity, and retrieval health
- Documentation list in table and grid views
- Upload documents modal with progress and validation states
- Document preview drawer
- Search & Test playground with retrieved chunks and grounded answer
- Chunks management
- Knowledge-base settings
- Activity/audit log
- Create knowledge-base wizard

The frontend is a dependency-free static simulation. Chat is represented as a
UI-only embedded workspace; the remaining modules simulate their server-backed
actions with local state and toast feedback.

## Code organization

The JavaScript is organized into an application entrypoint, shared shell,
page renderers, reusable components, and a small state module. CSS is split
into focused files and exposed through [`styles.css`](./styles.css).
Read [`docs/MAINTENANCE.md`](./docs/MAINTENANCE.md) before adding a page or
changing the rendering flow.
