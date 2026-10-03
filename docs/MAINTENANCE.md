# Conexa frontend maintenance guide

## Project shape

This is a dependency-free browser application. It uses native ES modules and
can be opened from `src/index.html` or served from the repository root with a
static server.

```text
src/
  index.html              Browser entrypoint
  app.js                  Compatibility entrypoint (kept for existing links)
  js/
    app.js                Application bootstrap and event delegation
    state.js              In-memory state and localStorage theme preference
    icons.js              Inline SVG icon definitions
    helpers.js            Shared HTML/rendering helpers
    shell.js              Sidebar, top bar, and workspace shell
    pages/                One renderer per product area
    components/           Reusable page fragments and modal renderers
  styles.css              CSS module entrypoint
  styles/
    base.css              Core layout and component styles
    theme.css             Theme variables and responsive desktop sizing
    responsive.css        Tablet and mobile breakpoints
    chat.css               Embedded chat workspace layout
    theme-components.css  Dark-theme component corrections
```

The exact JavaScript filenames may grow as a page becomes more complex, but
the rule is to keep data/state, shared rendering, page rendering, and event
handling separate.

## Rendering flow

1. `state.js` owns the small client-side simulation state.
2. The application entrypoint calls `render()`.
3. `shell.js` renders the persistent sidebar and top bar.
4. The active page renderer returns an HTML string.
5. `components/` supplies shared controls such as buttons, statuses, and
   modals.
6. One delegated click handler maps `data-page`, `data-tab`, and `data-action`
   attributes to state changes.
7. `render()` runs again after a state change.

There is intentionally no backend or fetch layer in this demo. Actions that
would normally call a server show a toast and update local simulation state.

## Adding a page

1. Add a renderer under `src/js/pages/`.
2. Keep page-specific arrays and formatting in that file.
3. Register the page in the page map used by the router.
4. Add only reusable markup to `src/js/components/`.
5. Add page styles to a focused stylesheet under `src/styles/`.
6. Import the stylesheet from `src/styles.css`.
7. Give simulated interactions a descriptive `data-action`.
8. Handle that action in the application event layer.

Avoid putting large page templates, state mutations, and CSS in the entrypoint.

## Styling rules

- Use CSS variables from `theme.css`; do not add page-specific hardcoded
  colors when a token already exists.
- Put shared visual rules in `base.css`.
- Put breakpoint changes in `responsive.css`.
- Keep chat sizing isolated in `chat.css`.
- Add dark-mode corrections to `theme-components.css` when a component uses a
  light-only background or asset.
- The theme is selected with `body[data-theme="light|dark"]` and persisted
  under the `conexa-theme` localStorage key.

## Validation

Run these checks after a refactor:

```powershell
node --check src/app.js
node --check src/js/app.js
```

Then open `src/index.html` and verify:

- every sidebar route renders;
- light and dark themes cover cards, forms, tables, charts, and modals;
- the chat fills the viewport and keeps its composer at the bottom;
- upload, create, connect, settings, and insight actions show feedback;
- mobile navigation and horizontally scrollable tables remain usable.
