import { state } from "./state.js";
import { icon } from "./helpers.js";
import { shell } from "./shell.js";
import { modal } from "./components/modal.js";
import { knowledgeOverview, kbDetail } from "./pages/knowledge.js";
import { modulePage } from "./pages/modules.js";
const app = document.querySelector("#app");
function render() {
  document.body.dataset.theme = state.theme;
  const content = state.page === "knowledge" && state.tab === "overview" ? knowledgeOverview() : state.page === "knowledge" ? kbDetail() : modulePage(state.page);
  app.innerHTML = shell(content) + modal() + (state.toast ? `<div class="toast">${icon("info")}${state.toast}</div>` : "");
}

function notify(message) {
  state.toast = message;
  render();
  window.clearTimeout(notify.timer);
  notify.timer = window.setTimeout(() => { state.toast = ""; render(); }, 2600);
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-page],[data-tab],[data-action]");
  if (!target) return;
  if (target.dataset.page) { state.page = target.dataset.page; state.tab = target.dataset.page === "knowledge" ? "overview" : "overview"; }
  if (target.dataset.tab) state.tab = target.dataset.tab;
  const action = target.dataset.action;
  if (action === "theme") {
    state.theme = state.theme === "light" ? "dark" : "light";
    localStorage.setItem("conexa-theme", state.theme);
  }
  if (action === "create") state.modal = "create";
  if (action === "upload") state.modal = "upload";
  if (action === "drawer" || action === "open-docs") { state.tab = "documents"; state.page = "knowledge"; state.modal = action === "drawer" ? "drawer" : null; }
  if (action === "close-modal") state.modal = null;
  if (action === "toggle-view") state.view = state.view === "table" ? "grid" : "table";
  if (action === "select-row" || action === "select-all") state.selected = state.selected ? 0 : 3;
  if (action === "clear-selection") state.selected = 0;
  if (action === "activity") { state.tab = "activity"; state.page = "knowledge"; }
  if (action === "index-files") { state.modal = null; notify("3 documents indexed successfully."); return; }
  if (action === "create-kb") { state.modal = null; notify("Knowledge base created successfully."); return; }
  if (action === "simulate-upload") notify("File picker simulated. Ready files added to the queue.");
  if (action === "reindex") notify("Billing manual.pdf queued for re-indexing.");
  if (action === "replace") notify("Replacement flow opened for Billing manual.pdf.");
  if (action === "edit-metadata") notify("Metadata editor opened.");
  if (action === "delete-document") { state.modal = null; notify("Document deletion simulated and undo is available."); return; }
  if (action === "add-insight") notify("Insight added to the Documentation backlog.");
  if (action === "export") notify("Analytics CSV export prepared.");
  if (action === "date-range") notify("Date range selector opened.");
  if (action === "invite") { state.modal = "invite"; }
  if (action === "save-settings") notify("Workspace settings saved.");
  if (action === "billing") notify("Billing details opened.");
  if (action === "settings-section") {
    target.parentElement.querySelectorAll("button").forEach((button) => button.classList.remove("active"));
    target.classList.add("active");
    notify(`${target.textContent.trim()} settings selected.`);
  }
  if (action === "toggle-setting") target.classList.toggle("on");
  render();
});

document.addEventListener("input", (event) => { if (event.target.matches("[data-query]")) { state.query = event.target.value; } });
state.tab = "overview";
render();
