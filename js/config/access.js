export const ROLES = [
  "Agent",
  "Trainee",
  "Supervisor",
  "Editor",
  "Admin",
  "QA/Compliance",
  "Developer",
  "Viewer",
];

export const PLANS = {
  Trial: { seats: 5, documents: 250, queries: 5000, features: ["chat", "sources", "knowledgeBases", "analytics", "team", "settings"] },
  Basic: { seats: 10, documents: 500, queries: 5000, features: ["chat", "sources", "knowledgeBases", "analytics", "team", "settings"] },
  Plus: { seats: 50, documents: 5000, queries: 50000, features: ["chat", "sources", "knowledgeBases", "analytics", "team", "settings", "supervisorTools", "savedAnswers", "apiKeys"] },
  Ultra: { seats: 200, documents: 50000, queries: 250000, features: ["chat", "sources", "knowledgeBases", "analytics", "team", "settings", "supervisorTools", "savedAnswers", "apiKeys", "compliance", "training", "scheduledReports"] },
  Enterprise: { seats: Infinity, documents: Infinity, queries: Infinity, features: ["chat", "sources", "knowledgeBases", "analytics", "team", "settings", "supervisorTools", "savedAnswers", "apiKeys", "compliance", "training", "scheduledReports", "whiteLabel"] },
};

export const ROLE_FEATURES = {
  Agent: ["chat", "sources"],
  Trainee: ["chat", "sources", "training"],
  Supervisor: ["chat", "sources", "analytics", "team", "supervisorTools"],
  Editor: ["chat", "sources", "knowledgeBases", "analytics"],
  Admin: ["chat", "sources", "knowledgeBases", "analytics", "team", "settings", "billing", "supervisorTools", "apiKeys", "compliance", "training", "staff"],
  "QA/Compliance": ["chat", "sources", "analytics", "compliance"],
  Developer: ["chat", "sources", "analytics", "apiKeys"],
  Viewer: ["analytics", "knowledgeBases"],
};

export const WORKSPACE_STATES = ["Active", "Trial", "Trial expired", "Payment past due", "Suspended", "Maintenance"];

export function useAccess(state, feature, action = "view") {
  const roleAllowed = (ROLE_FEATURES[state.role] || []).includes(feature);
  const planAllowed = (PLANS[state.plan]?.features || []).includes(feature);
  const blocked = ["Trial expired", "Payment past due", "Suspended", "Maintenance"].includes(state.workspaceState);
  const usageKey = feature === "team" ? "seats" : feature === "knowledgeBases" ? "documents" : "queries";
  const limit = PLANS[state.plan]?.[usageKey] ?? Infinity;
  const usage = state.usage?.[usageKey] ?? 0;

  if (blocked && feature !== "settings") return { allowed: false, result: "blocked", action };
  if (!roleAllowed) return { allowed: false, result: "forbidden", action };
  if (!planAllowed) return { allowed: false, result: "locked", action };
  if (usage >= limit && action !== "view") return { allowed: false, result: "limit_reached", action };
  return { allowed: true, result: "allowed", action };
}
