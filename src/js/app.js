import { state, docs, teamMembers, conversations } from "./state.js";
import { icon } from "./helpers.js";
import { shell } from "./shell.js";
import { modal } from "./components/modal.js";
import { knowledgeOverview, kbDetail } from "./pages/knowledge.js";
import { modulePage } from "./pages/modules.js";
import { controlRoom } from "./components/control-room.js";
import { useAccess } from "./config/access.js";
import { authPage } from "./pages/auth.js";
import { advancedPage, publicPage, systemPage, staffPage } from "./pages/advanced.js";
const app = document.querySelector("#app");
const featureForPage = { chat: "chat", knowledge: "knowledgeBases", analytics: "analytics", team: "team", settings: "settings", advanced: "supervisorTools" };
function accessState() {
  return useAccess(state, featureForPage[state.page] || "settings");
}
function accessPage(result) {
  const copy = {
    forbidden: ["No permission", "Your current role does not have access to this workspace area."],
    locked: ["Feature locked", `This feature is not included in the ${state.plan} plan.`],
    blocked: ["Workspace unavailable", `The workspace is currently ${state.workspaceState.toLowerCase()}.`],
  }[result.result];
  return `<section class="access-state"><span class="eyebrow">Conexa access</span><h1>${copy[0]}</h1><p>${copy[1]}</p><button class="button primary" data-action="toggle-control-room">Open demo controls</button></section>`;
}
function render() {
  document.body.dataset.theme = state.theme;
  if (!state.authenticated) {
    app.innerHTML = state.page === "public" || state.page === "pricing" ? publicPage(state.page) : authPage();
    return;
  }
  if (["404", "500", "help", "maintenance", "suspended", "trial-expired", "status"].includes(state.page)) {
    app.innerHTML = systemPage(state.page);
    return;
  }
  if (state.page === "staff") {
    app.innerHTML = shell(staffPage()) + controlRoom();
    return;
  }
  const access = accessState();
  const content = !access.allowed ? accessPage(access) : state.page === "advanced" ? advancedPage() : state.page === "knowledge" && state.tab === "overview" ? knowledgeOverview() : state.page === "knowledge" ? kbDetail() : modulePage(state.page);
  app.innerHTML = shell(content) + modal() + controlRoom() + (state.toast ? `<div class="toast">${icon("info")}${state.toast}</div>` : "");
}

function notify(message) {
  state.toast = message;
  render();
  window.clearTimeout(notify.timer);
  notify.timer = window.setTimeout(() => { state.toast = ""; render(); }, 2600);
}

function saveChat() {
  sessionStorage.setItem("conexa-chat-messages", JSON.stringify(state.chatMessages));
  const conversation = conversations.find(item => item.id === state.selectedConversation);
  if (conversation) conversation.messages = state.chatMessages;
}

function sendChat(text) {
  const question = (text || state.chatDraft).trim();
  if (!question || state.chatStreaming) return;
  state.chatMessages.push({ role: "user", text: question });
  state.chatDraft = "";
  state.chatStreaming = true;
  saveChat();
  render();
  window.setTimeout(() => {
    state.chatMessages.push({ role: "assistant", text: answerFor(question) });
    state.chatStreaming = false;
    saveChat();
    render();
  }, 1100);
}

function answerFor(question) {
  const input = question.toLowerCase();
  if (input.includes("fuel")) return "For a full-to-full rental, return the vehicle with a full tank. If the customer purchases the fuel option, no refueling charge is applied at return.";
  if (input.includes("late") || input.includes("return")) return "A late return may incur the hourly or daily rate shown in the rental agreement. Confirm the return time, grace period, and any approved extension before explaining the charge.";
  if (input.includes("damage") || input.includes("claim")) return "Document the vehicle condition with photos, create a damage report, and avoid accepting liability on behalf of the company. Escalate disputed damage claims to the supervisor queue.";
  if (input.includes("upgrade")) return "Upgrade eligibility depends on vehicle availability, membership status, and the price difference. Confirm the requested class and quote the updated total before changing the reservation.";
  if (input.includes("billing") || input.includes("payment") || input.includes("refund")) return "Verify the order ID, amount, and customer first. Refund only the duplicate or incorrect transaction and explain that the original payment method may take 5–10 business days.";
  return "I found related guidance in Documentation and Solved Cases. Verify the customer, reservation, and transaction details, then follow the documented escalation policy before confirming the resolution.";
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("button,[data-page],[data-tab],[data-action]");
  if (!target) return;
  if (target.dataset.page) { state.page = target.dataset.page; state.tab = target.dataset.page === "knowledge" ? "overview" : "overview"; }
  if (target.dataset.advancedTab) { state.advancedTab = target.dataset.advancedTab; state.page = "advanced"; }
  if (target.dataset.tab) state.tab = target.dataset.tab;
  const action = target.dataset.action;
  if (action === "toggle-control-room") state.controlRoomOpen = !state.controlRoomOpen;
  if (action === "save-openai-key") { state.openaiKey = document.querySelector("[data-openai-key]")?.value.trim() || ""; localStorage.setItem("conexa-openai-key", state.openaiKey); notify(state.openaiKey ? "OpenAI key saved locally for this browser." : "No key was saved."); return; }
  if (action === "clear-openai-key") { state.openaiKey = ""; localStorage.removeItem("conexa-openai-key"); notify("Local OpenAI key cleared."); return; }
  if (action === "tool-action") { const tool = target.closest(".tool-card")?.querySelector("h2")?.textContent || "Tool"; state.modal = `tool:${tool}`; }
  if (action === "advanced-tab") { state.advancedTab = target.dataset.advancedTab; state.page = "advanced"; }
  if (action === "chunk-action" || action === "activity-action") notify(`${target.textContent.trim()} action completed in demo mode.`);
  if (action === "open-public") { state.authenticated = false; state.page = "public"; state.controlRoomOpen = false; render(); return; }
  if (action === "open-staff") { state.page = "staff"; state.controlRoomOpen = false; render(); return; }
  if (action === "open-system") { state.authenticated = true; state.page = "status"; state.controlRoomOpen = false; render(); return; }
  if (action === "public-pricing") { state.authenticated = false; state.page = "pricing"; render(); return; }
  if (action === "return-home") { state.authenticated = true; state.page = "knowledge"; render(); return; }
  if (action === "auth-mode") { state.authMode = target.dataset.mode; render(); return; }
  if (action === "auth-submit" || action === "auth-sso") { state.authMode = "workspace"; state.page = "auth"; render(); return; }
  if (action === "select-workspace") { state.workspace = target.querySelector("b").textContent; localStorage.setItem("conexa-workspace", state.workspace); state.authenticated = true; state.modal = null; render(); return; }
  if (action === "sign-out") { state.authenticated = false; state.authMode = "signin"; render(); return; }
  if (action === "profile") { state.modal = "profile"; }
  if (action === "chat-dock-mini") state.chatDock = "mini";
  if (action === "chat-dock-bubble") state.chatDock = "bubble";
  if (action === "chat-dock-full") { state.chatDock = "full"; state.page = "chat"; }
  if (action === "select-conversation") { const conversation = conversations.find(item => item.id === target.dataset.conversationId); if (conversation) { state.selectedConversation = conversation.id; state.chatMessages = conversation.messages; saveChat(); } }
  if (action === "start-call") { state.liveCall = true; state.callSeconds = 0; notify("Live call mode started."); }
  if (action === "end-call") { state.liveCall = false; notify("Call ended. Wrap-up summary is ready."); }
  if (action === "new-chat") { state.chatMessages = []; state.chatDraft = ""; saveChat(); notify("New conversation started."); return; }
  if (action === "send-chat" || action === "suggest-chat") sendChat(action === "suggest-chat" ? target.textContent : "");
  if (action === "copy-answer") navigator.clipboard?.writeText(state.chatMessages.findLast?.(message => message.role === "assistant")?.text || "").then(() => notify("Answer copied to clipboard."));
  if (action === "regenerate") { state.chatMessages = state.chatMessages.filter((message, index) => !(message.role === "assistant" && index === state.chatMessages.length - 1)); sendChat("Regenerate the answer"); return; }
  if (action === "reset-demo") {
    state.role = "Admin"; state.plan = "Ultra"; state.workspaceState = "Active"; state.controlRoomOpen = false;
    localStorage.removeItem("conexa-role"); localStorage.removeItem("conexa-plan"); localStorage.removeItem("conexa-workspace-state");
    notify("Demo state reset.");
    return;
  }
  if (action === "theme") {
    state.theme = state.theme === "light" ? "dark" : "light";
    localStorage.setItem("conexa-theme", state.theme);
  }
  if (action === "create") state.modal = "create";
  if (action === "upload") state.modal = "upload";
  if (action === "drawer" || action === "open-docs") { state.tab = "documents"; state.page = "knowledge"; state.selectedDoc = Number(target.dataset.docIndex || 0); state.modal = action === "drawer" ? "drawer" : null; }
  if (action === "close-modal") state.modal = null;
  if (action === "toggle-view") state.view = state.view === "table" ? "grid" : "table";
  if (action === "cycle-doc-status") { const statuses = ["All", "Indexed", "Processing", "Failed", "Outdated"]; state.docStatus = statuses[(statuses.indexOf(state.docStatus) + 1) % statuses.length]; state.docPage = 1; }
  if (action === "doc-prev") state.docPage = Math.max(1, state.docPage - 1);
  if (action === "doc-next") state.docPage += 1;
  if (action === "select-row" || action === "select-all") state.selected = state.selected ? 0 : 3;
  if (action === "clear-selection") state.selected = 0;
  if (action === "activity") { state.tab = "activity"; state.page = "knowledge"; }
  if (action === "index-files") { docs.push(["Agent handbook.txt", "64 KB", "Indexed", "Support", "Cristopher Baca", "Today", "v1"]); state.usage.documents += 1; state.modal = null; notify("Agent handbook.txt was added and indexed."); return; }
  if (action === "create-kb") { state.modal = null; notify("Knowledge base created successfully."); return; }
  if (action === "simulate-upload") notify("File picker simulated. Ready files added to the queue.");
  if (action === "paste-text") { state.modal = "paste"; }
  if (action === "import-url") { state.modal = "url"; }
  if (action === "reindex") { if (docs[state.selectedDoc]) docs[state.selectedDoc][2] = "Processing"; state.modal = null; notify("Document queued for re-indexing."); window.setTimeout(() => { if (docs[state.selectedDoc]) docs[state.selectedDoc][2] = "Indexed"; render(); }, 900); return; }
  if (action === "replace") notify("Replacement flow opened for Billing manual.pdf.");
  if (action === "edit-metadata") notify("Metadata editor opened.");
  if (action === "delete-document") { const removed = docs.splice(state.selectedDoc, 1)[0]; state.modal = null; notify(removed ? `${removed[0]} deleted.` : "Document was not found."); return; }
  if (action === "add-insight") notify("Insight added to the Documentation backlog.");
  if (action === "export") { const csv = "metric,value\\nquestions,12480\\nanswer_success,98.4\\naverage_response_seconds,1.8\\n"; const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); link.download = "conexa-analytics.csv"; link.click(); URL.revokeObjectURL(link.href); notify("Analytics CSV downloaded."); }
  if (action === "date-range") { const ranges = ["Last 7 days", "Last 30 days", "Last 90 days"]; state.analyticsRange = ranges[(ranges.indexOf(state.analyticsRange) + 1) % ranges.length]; notify(`Showing ${state.analyticsRange}.`); }
  if (action === "invite") { state.modal = "invite"; }
  if (action === "save-settings") { document.querySelectorAll("[data-setting]").forEach((input) => { state.settings[input.dataset.setting] = input.value; }); localStorage.setItem("conexa-settings", JSON.stringify(state.settings)); state.workspace = state.settings.workspaceName; localStorage.setItem("conexa-workspace", state.workspace); notify("Workspace settings saved."); }
  if (action === "save-profile") { state.modal = null; notify("Profile preferences saved."); return; }
  if (action === "add-content") { docs.push(["New knowledge note.txt", "12 KB", "Processing", "Support", "Cristopher Baca", "Today", "v1"]); state.usage.documents += 1; state.modal = null; notify("Content added and queued for indexing."); return; }
  if (action === "billing") state.modal = "billing";
  if (action === "send-invite") { const email = document.querySelector('.modal input[type="email"]')?.value.trim(); if (email) teamMembers.push([email, "Agent", "Documentation", "Invitation sent now", "Invited"]); state.modal = null; notify(email ? `Invitation sent to ${email}.` : "Enter an email address to send an invitation."); return; }
  if (action === "member-menu") { const member = teamMembers[Number(target.dataset.memberIndex)]; if (member) { member[4] = member[4] === "Active" ? "Disabled" : "Active"; notify(`${member[0]} is now ${member[4].toLowerCase()}.`); } }
  if (action === "bulk-delete") { for (let i = docs.length - 1; i >= 0 && state.selected > 0; i -= 1) { docs.splice(i, 1); state.selected -= 1; } notify("Selected documents deleted."); }
  if (action === "choose-plan") { state.plan = "Plus"; localStorage.setItem("conexa-plan", state.plan); state.modal = null; notify("Plan changed to Plus in demo mode."); return; }
  if (action === "settings-section") {
    target.parentElement.querySelectorAll("button").forEach((button) => button.classList.remove("active"));
    target.classList.add("active");
    notify(`${target.textContent.trim()} settings selected.`);
  }
  if (action === "toggle-setting") target.classList.toggle("on");
  if (["menu", "run-test", "refresh", "filter", "date-range", "toggle-view", "none"].includes(action)) notify("Demo action completed.");
  if (!action && target.tagName === "BUTTON") {
    const label = target.textContent.trim().replace(/\s+/g, " ");
    if (label) notify(`${label} selected in demo mode.`);
  }
  render();
});

document.addEventListener("input", (event) => {
  if (event.target.matches("[data-query]")) state.query = event.target.value;
  if (event.target.matches("[data-chat-input]")) state.chatDraft = event.target.value;
  if (event.target.matches("[data-setting]")) state.settings[event.target.dataset.setting] = event.target.value;
  if (event.target.matches("[data-conversation-query]")) { state.conversationQuery = event.target.value; render(); }
  if (event.target.matches("[data-team-query]")) { state.teamQuery = event.target.value; render(); }
});
document.addEventListener("change", (event) => {
  if (event.target.matches("[data-team-role]")) { state.teamRole = event.target.value; render(); }
});
document.addEventListener("keydown", (event) => {
  if (event.target.matches("[data-chat-input]") && event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendChat();
  }
});
document.addEventListener("change", (event) => {
  const key = event.target.dataset.control;
  if (!key) return;
  state[key] = event.target.value;
  localStorage.setItem(`conexa-${key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}`, event.target.value);
  render();
});
document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key.toLowerCase() === "d") {
    event.preventDefault();
    state.controlRoomOpen = !state.controlRoomOpen;
    render();
  }
});
state.tab = "overview";
render();
window.setInterval(() => {
  if (state.liveCall) { state.callSeconds += 1; render(); }
}, 1000);
