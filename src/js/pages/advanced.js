import { state } from "../state.js";
import { button, status } from "../helpers.js";

const toolsets = {
  quality: ["Review queue", "Approved answers", "Evaluation suite", "Accuracy sampling"],
  supervisor: ["Team dashboard", "Conversation explorer", "Coaching notes", "Escalation tracker"],
  training: ["Training mode", "Learning path", "Quizzes", "Training assignments"],
  compliance: ["Audit log", "PII masking rules", "Compliance flags", "Deletion requests"],
  developer: ["API keys", "Usage logs", "Webhook delivery", "Embed configurator", "Sandbox", "SCIM"],
  reporting: ["ROI report", "Scheduled reports", "Expiry report", "Content workflow"],
};

export function advancedPage() {
  const active = state.advancedTab || "quality";
  const items = toolsets[active];
  return `<section class="content">${pageHeading("Role tools", "Tools for quality, supervisors, training, compliance, developers, and reporting.")}<div class="advanced-tabs">${Object.keys(toolsets).map(key => `<button class="${active === key ? "active" : ""}" data-action="advanced-tab" data-advanced-tab="${key}">${key[0].toUpperCase() + key.slice(1)}</button>`).join("")}</div><div class="tool-grid">${items.map((item, index) => `<article class="panel tool-card"><div class="tool-card-head"><span class="tool-icon">${index + 1}</span>${status(index === 0 ? "Active" : "Ready")}</div><h2>${item}</h2><p>${toolDescription(item)}</p>${button(item === "API keys" ? "Manage keys" : item === "Review queue" ? "Open queue" : "Open tool", "ghost", "tool-action")}</article>`).join("")}</div><div class="panel table-panel"><div class="panel-header"><div><h2>Recent workspace signals</h2><p>Live demo data from the selected toolset</p></div>${button("Export report", "ghost", "export")}</div><table><thead><tr><th>Signal</th><th>Owner</th><th>Priority</th><th>Status</th></tr></thead><tbody>${["Refund answer needs review", "New trainee assignment", "PII masking rule updated", "Webhook delivery recovered"].map((x, i) => `<tr><td>${x}</td><td>${["Nina Patel", "Cristopher Baca", "QA team", "Developer"][i]}</td><td>${i < 2 ? "High" : "Normal"}</td><td>${status(i === 0 ? "Processing" : "Indexed")}</td></tr>`).join("")}</tbody></table></div></section>`;
}

function pageHeading(title, subtitle) {
  return `<div class="page-heading"><div><p class="eyebrow">Workspace / Advanced tools</p><h1>${title}</h1><p class="subtitle">${subtitle}</p></div></div>`;
}

function toolDescription(item) {
  const descriptions = {
    "Review queue": "Review low-confidence answers and approve trusted responses.",
    "Team dashboard": "See agent performance, AHT, FCR, and usage at a glance.",
    "Training mode": "Practice realistic scenarios with supervisor feedback.",
    "Audit log": "Track changes, exports, and sensitive workspace events.",
    "API keys": "Create and revoke keys for your workspace integrations.",
    "ROI report": "Measure answer adoption, time saved, and business impact.",
  };
  return descriptions[item] || "Explore this workspace capability with realistic demo data and actions.";
}

export function publicPage(page) {
  const content = page === "pricing"
    ? `<h1>Simple plans for smarter support</h1><p>Start with the tools your team needs and grow when you are ready.</p><div class="public-plans">${["Basic", "Plus", "Ultra", "Enterprise"].map((plan, i) => `<article class="panel"><h2>${plan}</h2><strong>${i === 0 ? "$49" : i === 1 ? "$149" : i === 2 ? "$480" : "Custom"}</strong><p>Knowledge, answers, and analytics for modern contact centers.</p>${button("Choose plan", "primary", "auth-submit")}</article>`).join("")}</div>`
    : `<span class="eyebrow">Conexa</span><h1>Your team's knowledge, connected.</h1><p>Give every agent instant, grounded answers from the knowledge your company already owns.</p><div class="public-actions">${button("Start free trial", "primary", "auth-submit")}${button("View pricing", "ghost", "public-pricing")}</div><div class="panel public-hero"><h2>One workspace for better answers</h2><p>Connect policies, solved cases, and team expertise in a focused AI assistant.</p></div>`;
  return `<main class="public-screen"><div class="public-nav"><b>Conexa</b><span>Product</span><span>Security</span><span>Resources</span><button data-action="public-pricing">Pricing</button></div><section class="public-content">${content}</section></main>`;
}

export function systemPage(page) {
  const copy = { "404": ["Page not found", "The page you requested does not exist."], "500": ["Something went wrong", "The demo encountered an unexpected error."], help: ["Help center", "Find answers about chat, knowledge bases, and workspace administration."], maintenance: ["Scheduled maintenance", "Conexa is temporarily unavailable while we improve the service."], suspended: ["Workspace suspended", "Contact your workspace administrator to restore access."], "trial-expired": ["Your trial has ended", "Choose a plan to keep using your workspace."] }[page] || ["System status", "All Conexa systems are operating normally."];
  return `<main class="system-screen"><div class="brand"><strong>Conexa</strong></div><section class="system-card"><span class="eyebrow">Conexa</span><h1>${copy[0]}</h1><p>${copy[1]}</p>${button(page === "help" ? "Back to workspace" : "Return home", "primary", "return-home")}</section></main>`;
}

export function staffPage() {
  return `<section class="content">${pageHeading("Conexa staff", "Back-office tools for tenants, revenue, support, and platform health.")}<div class="summary-strip"><div><span>Active tenants</span><strong>248</strong></div><div><span>Monthly revenue</span><strong>$84.2k</strong></div><div><span>Platform uptime</span><strong class="good">99.98%</strong></div><div><span>Open support cases</span><strong>12</strong></div></div><div class="staff-grid">${["Tenant directory", "Revenue dashboard", "Plans & feature flags", "Platform health", "Support inbox", "Announcements"].map((x, i) => `<article class="panel tool-card"><h2>${x}</h2><p>${["Browse workspaces and impersonate a tenant safely.", "Monitor subscriptions, upgrades, and usage.", "Manage plan limits and staged rollouts.", "Monitor jobs, latency, and service health.", "Respond to customer requests and escalations.", "Publish updates to workspace admins."][i]}</p>${button("Open", "ghost", "tool-action")}</article>`).join("")}</div></section>`;
}
