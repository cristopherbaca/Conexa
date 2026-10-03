const responses = {
  "what is our vehicle return policy": "Vehicles should be returned to the agreed branch by the time shown on the rental agreement. The return agent completes the inspection, records fuel and mileage, and flags damage before closing the contract. I found the current Avis and Budget return playbooks in the private knowledge base.",
  "how do i escalate a roadside case": "Create a roadside incident, add the contract number and current vehicle location, then route it to the regional assistance queue. Cases involving safety, injury, or an immobilized customer should be marked urgent and escalated immediately.",
  "show me the latest fleet checklist": "The latest fleet checklist covers exterior condition, tire pressure, warning lights, fuel level, cleanliness, registration, and telematics status. The indexed version was updated 8 minutes ago."
};
const conversation = document.querySelector("#conversation");
const prompt = document.querySelector("#prompt");
const sendButton = document.querySelector("#sendButton");
const themeToggle = document.querySelector("#themeToggle");
const apiKey = document.querySelector("#apiKey");
const apiStatus = document.querySelector("#apiStatus");

if (localStorage.getItem("supportchat-theme") === "dark") {
  document.body.classList.add("dark-theme");
  themeToggle.innerHTML = "☀ <span>Light</span>";
  themeToggle.setAttribute("aria-label", "Switch to light theme");
}

function addMessage(text, role) {
  const item = document.createElement("div");
  item.className = `message ${role}`;
  item.innerHTML = role === "user"
    ? `<div class="message-avatar user-message">CY</div><div><div class="message-meta"><strong>You</strong><span>just now</span></div><div class="message-bubble">${text}</div></div>`
    : `<div class="message-avatar">✦</div><div><div class="message-meta"><strong>Conexa AI</strong><span>just now</span></div><div class="message-bubble">${text}</div><div class="answer-source">⌁  3 sources used · Local retrieval</div></div>`;
  conversation.appendChild(item);
  conversation.scrollTop = conversation.scrollHeight;
}

function submitQuestion(value) {
  const clean = value.trim();
  if (!clean) return;
  addMessage(clean.replace(/</g, "&lt;"), "user");
  prompt.value = "";
  sendButton.disabled = true;
  setTimeout(() => {
    const key = clean.toLowerCase().replace(/[?!.]/g, "");
    addMessage(responses[key] || "I can help with that. I searched the private operations index and found relevant guidance. For a more precise answer, include the branch, team, or policy name involved.", "assistant");
    sendButton.disabled = false;
  }, 650);
}

sendButton.addEventListener("click", () => submitQuestion(prompt.value));
prompt.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); submitQuestion(prompt.value); }
});
document.querySelectorAll(".suggestion").forEach((button) => button.addEventListener("click", () => submitQuestion(button.textContent)));
document.querySelector("#newChat").addEventListener("click", () => {
  conversation.innerHTML = "";
  addMessage("New conversation started. What would you like to look up in the Avis and Budget knowledge base?", "assistant");
  prompt.focus();
});

themeToggle.addEventListener("click", () => {
  const dark = document.body.classList.toggle("dark-theme");
  localStorage.setItem("supportchat-theme", dark ? "dark" : "light");
  themeToggle.innerHTML = dark ? "☀ <span>Light</span>" : "☾ <span>Dark</span>";
  themeToggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
});

document.querySelector("#toggleKey").addEventListener("click", (event) => {
  const isPassword = apiKey.type === "password";
  apiKey.type = isPassword ? "text" : "password";
  event.currentTarget.textContent = isPassword ? "Hide" : "Show";
});

document.querySelector("#saveApi").addEventListener("click", () => {
  if (!apiKey.value.trim()) {
    apiStatus.textContent = "Enter a key to simulate a connection";
    apiStatus.classList.add("api-error");
    return;
  }
  apiStatus.textContent = "Connected for this prototype · key stays in this browser";
  apiStatus.classList.remove("api-error");
});
