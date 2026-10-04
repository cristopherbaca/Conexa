# Conexa functionality audit

**Date:** 2026-10-03  
**Scope:** Frontend demo behavior in `src/`  
**Method:** Reviewed the event delegation and page renderers, then exercised the main routes and role-tool tabs in the running browser at `http://localhost:8000/src/index.html`.

## Executive summary

The application has broad visual coverage and a working simulated chat, navigation, theme switcher, Control Room, document addition, team invitations, and workspace settings persistence. The largest remaining gap is behavioral depth: many visible controls only display a generic notification and do not update the screen, open a form, or preserve a change.

The highest-value work is:

1. Make knowledge-base document, chunk, activity, filtering, pagination, and settings actions mutate shared demo state.
2. Replace the generic Role Tools cards with small detail views or drawers for each tool.
3. Make filters, search, sorting, selection, and pagination behave consistently.
4. Add validation and realistic success/error states to forms.
5. Add notifications, command palette, workspace switching, and role/plan changes as real interactive surfaces.

## What was verified as working

| Area | Verified behavior | Evidence |
|---|---|---|
| Main navigation | Chat, Knowledge Bases, Analytics, Team, Role tools, and Settings render from the sidebar | `src/js/shell.js`, `src/js/app.js` |
| Theme | Light/dark appearance toggles and persists through `localStorage` | `app.js` action `theme` |
| Chat | New conversation, suggested prompts, simulated streaming, copy, regenerate, live-call start/end, and ChatDock navigation work | `src/js/pages/modules.js`, `src/js/app.js`, `src/js/shell.js` |
| Chat persistence | Messages are stored in `sessionStorage` | `src/js/state.js`, `app.js` |
| Knowledge-base tabs | Documents, Search & Test, Chunks, Settings, and Activity render | `src/js/pages/knowledge.js` |
| Document addition | Indexing upload and paste/import add simulated documents to the document list | `app.js` actions `index-files` and `add-content` |
| Team invitation | Entering an email adds an invited member to the visible team table | `src/js/state.js`, `app.js` action `send-invite` |
| Workspace settings | Workspace name and description save locally and update the shell workspace name | `src/js/pages/modules.js`, `app.js` action `save-settings` |
| Role tools navigation | All six tabs render distinct tool lists: Quality, Supervisor, Training, Compliance, Developer, Reporting | `src/js/pages/advanced.js` |
| Access model | Role, plan, and workspace-state selectors change access results and navigation visibility | `src/js/config/access.js`, `src/js/components/control-room.js` |
| Auth simulation | Sign-in, sign-up, forgot password, SSO, workspace picker, and sign-out change the simulated session state | `src/js/pages/auth.js`, `app.js` |
| Public/system/staff surfaces | Landing, pricing, system states, and staff dashboard render | `src/js/pages/advanced.js` |

## Findings by area

### 1. Chat — medium priority

**Working**

- Seeded answers for common rental/support questions.
- Simulated response streaming.
- Suggested questions.
- New chat.
- Copy and regenerate actions.
- Sources shown in the answer.
- Live-call timer and ChatDock mini/bubble/full states.

**Needs functionality**

- Conversation list items do not select or load different conversations. They are static buttons without an action.
- The conversation search input is not connected to filtering.
- The source chips are not expandable and do not open a source preview.
- The “Documentation” scope control does not change the knowledge-base scope.
- Feedback/thumbs-up/thumbs-down controls are not present in the current rendered chat implementation.
- Live-call end only shows a toast; there is no wrap-up form or saved summary.
- The ChatDock copy/stream behavior should be tested while navigating repeatedly, not only on the current page.
- Clipboard failure is not surfaced when `navigator.clipboard` is unavailable or rejects.

**Recommended implementation**

- Add a `conversations` collection to shared state with selected conversation, title, messages, pinned state, and timestamps.
- Filter and select conversations.
- Add source drawer/preview and feedback state.
- Add a live-call wrap-up modal with summary, tags, and save action.

### 2. Knowledge Bases — high priority

#### Documents

**Working**

- Search text filters the document list.
- Table/grid toggle changes the layout.
- Upload modal opens.
- Simulated indexing adds a document.
- Paste text and import URL add a processing document.
- Document drawer opens.

**Needs functionality**

- Delete document does not remove anything; it only claims that undo is available.
- Re-index does not change status to Processing and then Indexed.
- Replace does not open a replacement flow.
- Edit metadata does not open an editor or change tags/author.
- Bulk selection is a counter toggle, not a real selection model.
- Bulk actions in the displayed bulk bar are plain text, not interactive actions.
- Status/type/tag/date/author filters only show a generic notification.
- Refresh does not reload or change data.
- Previous, page numbers, and Next do not paginate.
- Column sort indicators are not interactive.
- Empty results show a row message but do not provide a clear-search action.
- Document data is held in a module-level array and is not persisted across reloads.

#### Search & Test

- Query input is static and is not used by the test action.
- Top-K selector is not interactive.
- Retrieved chunks and answer remain fixed regardless of query.
- Copy answer and export test are not wired in this view.
- No loading, no-information, or error result can be triggered.

#### Chunks

- Edit, Merge, Split, and Disable all use the same generic notification.
- No chunk changes appear in the list.
- Search input is not connected to chunk filtering.
- Low-quality flags cannot be changed.

#### Settings

- Save settings button has no action.
- Inputs are not validated.
- Re-index consequence is displayed but not simulated.
- Changes are not persisted.
- Embedding model, top-K, relevance threshold, tone, language, instructions, and fallback message do not affect Chat or Search & Test.

#### Activity

- View, Restore, and Retry all use the same generic activity notification.
- Activity search is not connected.
- Activity records are static and never receive events from document actions.

**Recommended implementation**

- Introduce a structured knowledge-base store with documents, chunks, activity entries, filters, pagination, and settings.
- Use stable document and chunk IDs instead of positional arrays.
- Add confirmation for destructive actions and an undo queue.
- Make every document mutation append an activity entry.

### 3. Analytics — medium priority

**Working**

- KPI cards and responsive chart render.
- Export action shows feedback.

**Needs functionality**

- Date-range control does not open a range selector or change metrics.
- Export does not create/download a CSV file.
- KPI values and chart do not respond to chat questions, feedback, date range, or demo usage changes.
- There are no loading, empty, or error states.
- No drill-down from a chart point or KPI is available.

**Recommended implementation**

- Add deterministic analytics state with date ranges and derived metrics.
- Implement a real browser CSV download from the current dataset.
- Add empty/error toggles through the Control Room.

### 4. Team — high priority

**Working**

- Invite modal validates the presence of an email sufficiently to add a simulated member.
- New invited member appears in the table.

**Needs functionality**

- Role and knowledge-base access filters do not filter the table.
- Search field is not connected to member filtering.
- Row overflow buttons have no action.
- Role changes, member removal, resend invitation, and per-KB access editing are missing.
- Permissions matrix is read-only.
- Invited member status never changes to accepted/disabled.
- Team data is not persisted across reloads.

**Recommended implementation**

- Give team members IDs and mutable role/access/status fields.
- Add member drawer with edit role, access, resend, disable, and remove actions.
- Wire search and filters to the table.

### 5. Settings, billing, and profile — medium priority

**Working**

- Workspace name and description persist.
- Security toggle changes visual class.
- Billing modal opens.
- Plan selection changes the demo plan to Plus.
- Profile modal and sign-out exist.

**Needs functionality**

- Security toggle state is not persisted and has no behavioral effect.
- Session timeout select is not persisted.
- AI behavior, Security, and Billing sidebar buttons only change an active class/toast; they do not switch content.
- Billing plan prices and usage are static; plan selection only supports one hard-coded target (`Plus`).
- Plan changes do not consistently recalculate limits, usage meters, or available features.
- Profile display name and language fields do not save.
- Auto-minimize preference only changes a CSS class in the open modal; it is not stored or used.
- Notifications and help controls in the top bar have no behavior.

**Recommended implementation**

- Use a settings object with sections and persisted values.
- Make plan selection data-driven for Basic, Plus, Ultra, and Enterprise.
- Apply selected plan limits to access checks and usage meters.
- Add a notification center and help drawer.

### 6. Role Tools / P2 surfaces — high priority

All six tool tabs render successfully, but the tool cards are currently shells.

The following tools only show a generic “opened in demo mode” notification:

- Review queue
- Approved answers
- Evaluation suite
- Accuracy sampling
- Team dashboard
- Conversation explorer
- Coaching notes
- Escalation tracker
- Training mode
- Learning path
- Quizzes
- Training assignments
- Audit log
- PII masking rules
- Compliance flags
- Deletion requests
- API keys
- Usage logs
- Webhook delivery
- Embed configurator
- Sandbox
- SCIM
- ROI report
- Scheduled reports
- Expiry report
- Content workflow

**Recommended implementation**

- Create a reusable `ToolDrawer` or detail-page template.
- Give each tool a small realistic dataset and at least one meaningful mutation.
- Start with Review Queue, Team Dashboard, API Keys, Audit Log, and Scheduled Reports because they exercise the most important role workflows.

### 7. Public, system, and staff pages — medium priority

**Needs functionality**

- Pricing “Choose plan” buttons route to the simulated auth flow instead of selecting or explaining a plan.
- Public navigation links Product, Security, and Resources are static text.
- Staff cards only show a generic notification.
- Tenant impersonation, tenant selection, support inbox, feature flags, announcements, health details, and revenue drill-down are not implemented.
- System page actions mostly return to the workspace; help has no searchable content.

**Recommended implementation**

- Add public route state and clear CTA behavior.
- Add staff drawers for tenant details, support cases, and feature flags.
- Keep impersonation explicitly simulated and show a persistent impersonation banner.

### 8. Control Room — medium priority

**Working**

- Role, plan, workspace state, theme, and workspace selectors exist.
- Local OpenAI key can be saved or cleared.
- Reset demo action exists.
- Keyboard shortcut opens the room.

**Needs functionality**

- Usage simulator sliders do not appear to drive all visible meters and limits consistently.
- Feature overrides, limit overrides, latency, error rate, streaming speed, no-information mode, offline mode, empty data, and huge data modes are not all wired to rendering behavior.
- Tenant branding/tone choices are not fully applied to the app.
- Preset save/load/delete/export/import is missing.
- Sitemap access results and links are missing.
- The OpenAI key is intentionally not used for requests; this is correct for frontend safety but should remain clearly labeled.

## Cross-cutting technical gaps

1. **State model:** Many datasets are arrays of positional values. This makes edits, deletes, sorting, and persistence fragile.
2. **Persistence:** Only selected global values, settings, and chat messages persist. Documents, members, chunks, activity, and tool data reset on reload.
3. **Feedback quality:** Generic fallback handling in `app.js` makes inactive controls look successful. It should distinguish “not implemented” from a completed simulated action.
4. **Forms:** Most forms lack required-field validation, invalid-state styling, and field-specific messages.
5. **Errors:** There are no controllable error paths for most data views or mutations.
6. **Loading states:** The UI contains static loading copy but no reusable simulated request lifecycle.
7. **Accessibility:** Several controls have no accessible name beyond visible text, and static table actions should receive explicit labels and keyboard behavior.
8. **Testing:** There is no automated test suite covering routes, mutations, role/plan gating, persistence, or ChatDock continuity.
9. **Architecture:** The static ES-module approach is working for the demo, but the large template strings in `app.js` and page modules make behavior changes harder to isolate.

## Suggested implementation order

### P0 — make existing pages genuinely usable

- Knowledge-base document CRUD, status transitions, filters, pagination, and activity events.
- Team search, filters, member editing, removal, and invitation lifecycle.
- Chat conversation selection, source preview, feedback, and call wrap-up.
- Real CSV export and date-range behavior for Analytics.

### P1 — replace shells with useful simulations

- Tool drawer template and five highest-value Role Tools.
- Settings sections, validation, persistence, and plan-driven limits.
- Notifications/help, command palette, and workspace switching.

### P2 — complete demo controls and quality

- Control Room presets and network/data simulation switches.
- Staff detail workflows and public navigation.
- Loading/empty/error states for every data view.
- Accessibility pass and browser regression tests.

## Conclusion

The app is a strong visual prototype with a functioning core demo, but it is not yet a fully clickable product simulation. The next pass should focus on shared mutable demo state and reusable workflow components. Adding more screens before these behaviors are implemented would increase surface area without solving the main usability problem.
