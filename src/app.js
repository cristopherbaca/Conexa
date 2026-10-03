import { activity, ragDocuments } from "./data/workspaceData.js";

/**
 * Conexa AI browser controller.
 *
 * This module owns the temporary UI state for the prototype: the active
 * canvas, current API session, conversation messages, activity list, and
 * administrator actions. Persistent cloud storage is intentionally not
 * implemented here yet.
 */
const conversation = document.querySelector("#conversation");
const prompt = document.querySelector("#prompt");
const sendButton = document.querySelector("#sendButton");
const themeToggle = document.querySelector("#themeToggle");
const apiKeyInput = document.querySelector("#apiKey");
const apiStatus = document.querySelector("#apiStatus");
const connectionLabel = document.querySelector("#connectionLabel");
const toast = document.querySelector("#toast");
let apiKey = "";
let toastTimer;

// Keep the credential in memory for this proof of concept; production should use a server proxy.
if (localStorage.getItem("supportchat-theme") === "dark") setTheme(true);

function setTheme(dark) {
  document.body.classList.toggle("dark-theme", dark);
  localStorage.setItem("supportchat-theme", dark ? "dark" : "light");
  themeToggle.innerHTML = dark ? "☀ <span>Light</span>" : "☾ <span>Dark</span>";
  themeToggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
}

/** Display a short, non-blocking status message to the administrator. */
function notify(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 3200);
}

/** Append a safely escaped message to the active chat canvas. */
function addMessage(text, role, source = true) {
  const item = document.createElement("div");
  item.className = `message ${role}`;
  const safeText = text.replace(/</g, "&lt;").replace(/\n/g, "<br>");
  item.innerHTML = role === "user"
    ? `<div class="message-avatar user-message">CY</div><div><div class="message-meta"><strong>You</strong><span>just now</span></div><div class="message-bubble">${safeText}</div></div>`
    : `<div class="message-avatar">✦</div><div><div class="message-meta"><strong>Conexa AI</strong><span>just now</span></div><div class="message-bubble">${safeText}</div>${source ? '<div class="answer-source">⌁  2 simulated RAG sources · ChatGPT response</div>' : ""}</div>`;
  conversation.appendChild(item);
  conversation.scrollTop = conversation.scrollHeight;
}

/** Send a question to the fixed proof-of-concept ChatGPT model. */
async function askChatGPT(question) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        { role: "system", content: "You are Conexa AI, a cloud-based Avis and Budget operations assistant. Use these simulated retrieval sources as context: Fleet & Policies RAG contains operational playbooks, vehicle returns, fleet checklists and policies. Customer Care RAG contains roadside assistance, escalation, customer support and case workflows. Be concise, practical, and say when information is only simulated." },
        { role: "user", content: question }
      ]
    })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || `API request failed (${response.status})`);
  return data.choices?.[0]?.message?.content || "The API returned no message.";
}

/** Validate the session, render the user message, and handle the API response. */
async function submitQuestion(value) {
  const clean = value.trim();
  if (!clean) return;
  if (!apiKey) {
    notify("Add and test your ChatGPT API key before sending a message.");
    apiKeyInput.focus();
    return;
  }
  addMessage(clean, "user", false);
  prompt.value = "";
  sendButton.disabled = true;
  sendButton.textContent = "…";
  try {
    addMessage(await askChatGPT(clean), "assistant");
  } catch (error) {
    addMessage(`I couldn't reach ChatGPT. ${error.message}`, "assistant", false);
    notify("Chat request failed. Check the API key and browser network access.");
  } finally {
    sendButton.disabled = false;
    sendButton.textContent = "↑";
  }
}

async function testApiKey() {
  const candidate = (apiKeyInput.value || document.querySelector("#adminApiKey").value).trim();
  if (!candidate) {
    apiStatus.textContent = "Enter an API key to enable chat";
    apiStatus.classList.add("api-error");
    return;
  }
  apiStatus.textContent = "Testing key…";
  apiStatus.classList.remove("api-error");
  try {
    const response = await fetch("https://api.openai.com/v1/models", { headers: { Authorization: `Bearer ${candidate}` } });
    if (!response.ok) throw new Error("The API rejected this key.");
    apiKey = candidate;
    apiStatus.textContent = "Connected · chat enabled for this page";
    connectionLabel.textContent = "ChatGPT API ready";
    document.querySelector("#adminApiState").textContent = "Connected";
    notify("ChatGPT connection enabled.");
  } catch (error) {
    apiKey = "";
    apiStatus.textContent = error.message;
    apiStatus.classList.add("api-error");
  }
}

sendButton.addEventListener("click", () => submitQuestion(prompt.value));
prompt.addEventListener("keydown", event => {
  if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); submitQuestion(prompt.value); }
});
document.querySelectorAll(".suggestion").forEach(button => button.addEventListener("click", () => submitQuestion(button.textContent)));
document.querySelector("#newChat").addEventListener("click", () => {
  showView("chat");
  conversation.innerHTML = "";
  const title = `New conversation ${activity.length + 1}`;
  activity.unshift({ title, detail: "New conversation created from the workspace.", time: "Now" });
  addMessage("New conversation started. Add your API key in the administrator panel to begin.", "assistant", false);
  notify("New conversation created.");
  prompt.focus();
});
themeToggle.addEventListener("click", () => setTheme(!document.body.classList.contains("dark-theme")));
document.querySelector("#toggleKey").addEventListener("click", event => {
  const visible = apiKeyInput.type === "text";
  apiKeyInput.type = visible ? "password" : "text";
  event.currentTarget.textContent = visible ? "Show" : "Hide";
});
document.querySelector("#saveApi").addEventListener("click", testApiKey);
document.querySelector("#adminTestApi").addEventListener("click", testApiKey);

const adminModal = document.querySelector("#adminModal");
function openAdmin() { adminModal.classList.add("open"); adminModal.setAttribute("aria-hidden", "false"); }
function closeAdmin() { adminModal.classList.remove("open"); adminModal.setAttribute("aria-hidden", "true"); }
document.querySelector("#adminProfile").addEventListener("click", openAdmin);
document.querySelector("#closeAdmin").addEventListener("click", closeAdmin);
adminModal.addEventListener("click", event => { if (event.target === adminModal) closeAdmin(); });
document.querySelector("#adminClear").addEventListener("click", () => { conversation.innerHTML = ""; addMessage("Chat history cleared by the application administrator.", "assistant", false); closeAdmin(); notify("Chat history cleared."); });
document.querySelector("#adminReset").addEventListener("click", () => { apiKey = ""; apiKeyInput.value = ""; apiStatus.textContent = "Not connected · key stays in memory only"; connectionLabel.textContent = "API key required"; document.querySelector("#adminApiState").textContent = "Not connected"; closeAdmin(); notify("Prototype state reset."); });

// Replace the main canvas instead of stacking secondary screens below the chat.
function showView(view) {
  const chat = document.querySelector(".workspace-grid");
  const views = { knowledge: document.querySelector("#knowledgeView"), activity: document.querySelector("#activityView"), help: document.querySelector("#helpView") };
  chat.hidden = view !== "chat";
  Object.entries(views).forEach(([name, element]) => { element.hidden = name !== view; });
  document.querySelector("#breadcrumbTitle").textContent = view === "knowledge" ? "Knowledge base" : view === "activity" ? "Recent activity" : view === "help" ? "Help center" : "Ask Conexa AI";
}

function renderActivity() {
  document.querySelector("#activityList").innerHTML = activity.map((item, index) => `<div class="activity-item" data-activity="${index}"><button class="activity-open"><span class="activity-icon">◷</span><span><strong>${item.title}</strong><small>${item.detail}</small></span><time>${item.time}</time><span class="activity-arrow">→</span></button><button class="delete-chat" data-delete="${index}" aria-label="Delete ${item.title}">×</button></div>`).join("");
  document.querySelectorAll(".activity-open").forEach(item => item.addEventListener("click", () => {
    const index = item.closest(".activity-item").dataset.activity;
    showView("chat");
    addMessage(`Reopened conversation: ${activity[index].title}.`, "assistant", false);
    notify("Previous conversation reopened.");
  }));
  document.querySelectorAll(".delete-chat").forEach(button => button.addEventListener("click", () => {
    activity.splice(Number(button.dataset.delete), 1);
    renderActivity();
    notify("Conversation deleted.");
  }));
}

function renderDocuments(type) {
  const title = type === "fleet" ? "Fleet & Policies RAG documents" : "Customer Care RAG documents";
  document.querySelector("#editorTitle").textContent = title;
  document.querySelector("#documentList").innerHTML = ragDocuments[type].map(([name, content], index) => `<article class="document-row"><div><strong>${name}</strong><p>${content}</p></div><button class="delete-document" data-index="${index}" type="button">Remove</button></article>`).join("");
  document.querySelectorAll(".delete-document").forEach(button => button.addEventListener("click", () => { ragDocuments[type].splice(Number(button.dataset.index), 1); renderDocuments(type); notify("Document removed from this RAG."); }));
}

document.querySelectorAll(".nav-item").forEach(item => item.addEventListener("click", event => {
  event.preventDefault();
  document.querySelectorAll(".nav-item").forEach(nav => nav.classList.remove("active"));
  item.classList.add("active");
  const view = item.dataset.view;
  showView(view);
  if (view === "activity") renderActivity();
  notify(view === "knowledge" ? "Knowledge base opened." : view === "activity" ? "Conversation history opened." : "Chat workspace selected.");
}));
document.querySelector("#notificationsButton").addEventListener("click", () => notify("No new operational alerts."));
document.querySelector("#helpButton").addEventListener("click", () => { showView("help"); notify("Help center opened."); });
document.querySelector("#knowledgeButton").addEventListener("click", () => { showView("knowledge"); notify("Knowledge base opened."); });
document.querySelector("#chatMenuButton").addEventListener("click", () => notify("Chat actions: new conversation or clear history are available to the administrator."));
document.querySelectorAll(".rag-editor").forEach(button => button.addEventListener("click", () => { document.querySelector("#documentEditor").classList.add("visible"); renderDocuments(button.dataset.rag); }));
document.querySelector("#closeEditor").addEventListener("click", () => document.querySelector("#documentEditor").classList.remove("visible"));
document.querySelector("#addDocument").addEventListener("click", () => {
  document.querySelector("#documentEditor").classList.add("visible");
  renderDocuments(document.querySelector("#ragTarget").value);
  document.querySelector("#documentTitle").focus();
});
document.querySelector("#clearActivity").addEventListener("click", () => { activity.length = 0; renderActivity(); notify("Activity list cleared."); });
document.querySelector("#ragTarget").addEventListener("change", event => renderDocuments(event.target.value));
document.querySelector("#documentForm").addEventListener("submit", event => {
  event.preventDefault();
  const target = document.querySelector("#ragTarget").value;
  ragDocuments[target].push([document.querySelector("#documentTitle").value.trim(), document.querySelector("#documentContent").value.trim()]);
  event.currentTarget.reset();
  renderDocuments(target);
  notify("Document added to the selected RAG.");
});
document.querySelectorAll(".history-item").forEach(item => item.addEventListener("click", event => {
  if (event.target.closest(".delete-history")) return;
  showView("chat");
  document.querySelectorAll(".history-item").forEach(entry => entry.classList.remove("selected"));
  item.classList.add("selected");
  conversation.innerHTML = "";
  addMessage(`Reopened "${item.dataset.title}". Ask a follow-up question to continue this conversation.`, "assistant", false);
}));
document.querySelectorAll(".delete-history").forEach(button => button.addEventListener("click", event => {
  event.stopPropagation();
  event.currentTarget.closest(".history-item").remove();
  notify("Conversation deleted.");
}));
