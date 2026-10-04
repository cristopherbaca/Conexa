import { state } from "./state.js";
import { icon, titleCase } from "./helpers.js";
import { useAccess } from "./config/access.js";
function chatDock() {
  const latest = state.chatMessages[state.chatMessages.length - 1];
  const time = `${String(Math.floor(state.callSeconds / 60)).padStart(2, "0")}:${String(state.callSeconds % 60).padStart(2, "0")}`;
  if (state.chatDock === "bubble") return `<button class="chat-bubble" data-action="chat-dock-mini" aria-label="Open chat">${state.liveCall ? time : "1"}</button>`;
  return `<aside class="chat-dock ${state.chatDock === "mini" ? "mini" : ""}" aria-label="Chat preview"><div class="chat-dock-head"><b>${state.liveCall ? `Active call · ${time}` : "Conexa chat"}</b><span><button data-action="chat-dock-full" aria-label="Expand chat">↗</button><button data-action="chat-dock-bubble" aria-label="Minimize chat">−</button></span></div><p>${latest?.role === "assistant" ? latest.text : "Your conversation is ready to continue."}</p>${state.liveCall ? `<button class="chat-dock-open danger" data-action="end-call">End live call</button>` : `<button class="chat-dock-open" data-action="chat-dock-full">Return to chat</button>`}</aside>`;
}
export function shell(content) {
  const nav = [
    ["chat", "Chat", "chat"],
    ["book", "Knowledge Bases", "knowledge"],
    ["chart", "Analytics", "analytics"],
    ["users", "Team", "team"],
    ["chart", "Role tools", "advanced"],
    ["settings", "Settings", "settings"],
  ];
  return `<div class="shell">
    <aside class="sidebar">
      <div class="brand"><span class="brand-mark">${icon("grid")}</span><strong>Conexa</strong></div>
      <div class="workspace-card"><span class="workspace-avatar">${state.workspace[0]}</span><span><b>${state.workspace}</b><small>${state.plan} workspace</small></span>${icon("chevron")}</div>
      <nav>${nav.map(([i, label, page]) => { const access = useAccess(state, { chat: "chat", knowledge: "knowledgeBases", analytics: "analytics", team: "team", advanced: "supervisorTools", settings: "settings" }[page]); return access.result === "forbidden" ? "" : `<button class="nav-item ${state.page === page ? "active" : ""}" data-page="${page}">${icon(i)}<span>${label}</span>${access.result === "locked" ? `<small class="nav-lock">${icon("lock")}</small>` : ""}</button>`; }).join("")}</nav>
      <div class="sidebar-bottom">
        <div class="usage"><div><span>Monthly queries</span><b>${Math.round((state.usage.queries / 20000) * 100)}%</b></div><div class="meter"><i style="width:${Math.min(100, (state.usage.queries / 20000) * 100)}%"></i></div><small>${state.usage.queries.toLocaleString()} / 20,000 used</small></div>
        <button class="appearance" data-action="theme">${icon(state.theme === "light" ? "moon" : "sun")} ${state.theme === "light" ? "Dark" : "Light"} appearance ${icon("chevron")}</button>
        <button class="profile" data-action="profile"><span class="profile-avatar">CB</span><span><b>Cristopher Baca</b><small>${state.role}</small></span></button>
        <small class="powered">Powered by Conexa</small>
      </div>
    </aside>
    <main class="main"><header class="topbar">${state.liveCall ? `<div class="call-banner">Active call · ${String(Math.floor(state.callSeconds / 60)).padStart(2, "0")}:${String(state.callSeconds % 60).padStart(2, "0")} <button data-action="chat-dock-full">Return to chat</button></div>` : ""}<div class="crumb"><span>${icon("grid")}</span><span>${state.workspace}</span><b>/</b><span>${state.page === "knowledge" ? "Knowledge Bases" : titleCase(state.page)}</span></div><div class="top-actions"><label class="workspace-search">${icon("search")}<input placeholder="Search workspace" /><kbd>⌘ K</kbd></label><button class="top-icon" aria-label="Notifications">${icon("bell")}</button><span class="help">?</span></div></header>${content}</main>${state.page !== "chat" && state.chatMessages.length ? chatDock() : ""}
  </div>`;
}
