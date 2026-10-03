import { state } from "./state.js";
import { icon, titleCase } from "./helpers.js";
export function shell(content) {
  const nav = [
    ["chat", "Chat", "chat"],
    ["book", "Knowledge Bases", "knowledge"],
    ["chart", "Insights", "insights"],
    ["chart", "Analytics", "analytics"],
    ["users", "Team", "team"],
    ["plug", "Integrations", "integrations"],
    ["settings", "Settings", "settings"],
  ];
  return `<div class="shell">
    <aside class="sidebar">
      <div class="brand"><span class="brand-mark">${icon("grid")}</span><strong>Conexa</strong></div>
      <div class="workspace-card"><span class="workspace-avatar">N</span><span><b>Northstar Support</b><small>Enterprise workspace</small></span>${icon("chevron")}</div>
      <nav>${nav.map(([i, label, page]) => `<button class="nav-item ${state.page === page ? "active" : ""}" data-page="${page}">${icon(i)}<span>${label}</span></button>`).join("")}</nav>
      <div class="sidebar-bottom">
        <div class="usage"><div><span>Monthly queries</span><b>62%</b></div><div class="meter"><i></i></div><small>12,480 / 20,000 used</small></div>
        <button class="appearance" data-action="theme">${icon(state.theme === "light" ? "moon" : "sun")} ${state.theme === "light" ? "Dark" : "Light"} appearance ${icon("chevron")}</button>
        <div class="profile"><span class="profile-avatar">AM</span><span><b>Alex Morgan</b><small>Administrator</small></span></div>
        <small class="powered">Powered by Conexa</small>
      </div>
    </aside>
    <main class="main"><header class="topbar"><div class="crumb"><span>${icon("grid")}</span><span>Northstar</span><b>/</b><span>${state.page === "knowledge" ? "Knowledge Bases" : titleCase(state.page)}</span></div><div class="top-actions"><label class="workspace-search">${icon("search")}<input placeholder="Search workspace" /><kbd>⌘ K</kbd></label><button class="top-icon" aria-label="Notifications">${icon("bell")}</button><span class="help">?</span></div></header>${content}</main>
  </div>`;
}
