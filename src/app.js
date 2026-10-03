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

if (localStorage.getItem("supportchat-theme") === "dark") setTheme(true);

function setTheme(dark) {
  document.body.classList.toggle("dark-theme", dark);
  localStorage.setItem("supportchat-theme", dark ? "dark" : "light");
  themeToggle.innerHTML = dark ? "☀ <span>Light</span>" : "☾ <span>Dark</span>";
  themeToggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
}

function notify(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 3200);
}

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

async function askChatGPT(question) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        { role: "system", content: "You are Conexa AI, an internal Avis and Budget operations assistant. Use these two simulated retrieval sources as context: Fleet & Policies RAG contains operational playbooks, vehicle returns, fleet checklists and policies. Customer Care RAG contains roadside assistance, escalation, customer support and case workflows. Be concise, practical, and say when information is only simulated." },
        { role: "user", content: question }
      ]
    })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || `API request failed (${response.status})`);
  return data.choices?.[0]?.message?.content || "The API returned no message.";
}

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
  const candidate = apiKeyInput.value.trim();
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
  conversation.innerHTML = "";
  addMessage("New conversation started. Add your API key in the administrator panel to begin.", "assistant", false);
  prompt.focus();
});
themeToggle.addEventListener("click", () => setTheme(!document.body.classList.contains("dark-theme")));
document.querySelector("#toggleKey").addEventListener("click", event => {
  const visible = apiKeyInput.type === "text";
  apiKeyInput.type = visible ? "password" : "text";
  event.currentTarget.textContent = visible ? "Show" : "Hide";
});
document.querySelector("#saveApi").addEventListener("click", testApiKey);

const adminModal = document.querySelector("#adminModal");
function openAdmin() { adminModal.classList.add("open"); adminModal.setAttribute("aria-hidden", "false"); }
function closeAdmin() { adminModal.classList.remove("open"); adminModal.setAttribute("aria-hidden", "true"); }
document.querySelector("#adminProfile").addEventListener("click", openAdmin);
document.querySelector("#closeAdmin").addEventListener("click", closeAdmin);
adminModal.addEventListener("click", event => { if (event.target === adminModal) closeAdmin(); });
document.querySelector("#adminClear").addEventListener("click", () => { conversation.innerHTML = ""; addMessage("Chat history cleared by the application administrator.", "assistant", false); closeAdmin(); notify("Chat history cleared."); });
document.querySelector("#adminReset").addEventListener("click", () => { apiKey = ""; apiKeyInput.value = ""; apiStatus.textContent = "Not connected · key stays in memory only"; connectionLabel.textContent = "API key required"; document.querySelector("#adminApiState").textContent = "Not connected"; closeAdmin(); notify("Prototype state reset."); });

document.querySelectorAll(".nav-item").forEach(item => item.addEventListener("click", event => {
  event.preventDefault();
  document.querySelectorAll(".nav-item").forEach(nav => nav.classList.remove("active"));
  item.classList.add("active");
  const view = item.dataset.view;
  document.querySelector("#breadcrumbTitle").textContent = view === "knowledge" ? "Knowledge base" : view === "activity" ? "Recent activity" : "Ask Conexa AI";
  notify(view === "knowledge" ? "Knowledge base tools are ready in the workspace context." : view === "activity" ? "Recent activity is shown in the conversation list." : "Chat workspace selected.");
}));
document.querySelector("#notificationsButton").addEventListener("click", () => notify("No new operational alerts."));
document.querySelector("#helpButton").addEventListener("click", () => notify("Tip: connect an API key, then ask about a policy, fleet process, or customer case."));
document.querySelector("#knowledgeButton").addEventListener("click", () => notify("Three simulated sources are indexed and healthy."));
document.querySelector("#chatMenuButton").addEventListener("click", () => notify("Chat actions: new conversation or clear history are available to the administrator."));
