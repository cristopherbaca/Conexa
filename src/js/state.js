export const docs = [
  ["Billing manual.pdf", "2.4 MB", "Indexed", "Billing", "Nina Patel", "Oct 02", "v3"],
  ["Refund policy.docx", "840 KB", "Indexed", "Billing", "Alex Morgan", "Oct 01", "v2"],
  ["Returns policy.pdf", "1.8 MB", "Processing", "Returns", "Sam Rivera", "Oct 03", "v4"],
  ["Account security.html", "124 KB", "Indexed", "Security", "Nina Patel", "Sep 28", "v2"],
  ["Escalation guide.txt", "64 KB", "Outdated", "Support", "Lee Kim", "Sep 15", "v1"],
  ["Payment exceptions.pdf", "4.1 MB", "Failed", "Billing", "Alex Morgan", "Oct 03", "v1"],
];
export const teamMembers = [
  ["Cristopher Baca","Administrator","All knowledge bases","Active now","Active"],
  ["Nina Patel","Editor","Documentation, Billing","2 minutes ago","Active"],
  ["Sam Rivera","Agent","Documentation, Solved Cases","Yesterday","Active"],
  ["Lee Kim","Viewer","Documentation","Sep 30","Invited"],
];
export const conversations = [
  { id: "refund", title: "Refunding a duplicate payment", days: "Today · 10:42", messages: [{ role: "user", text: "How do I refund a duplicate payment?" }, { role: "assistant", text: "Verify that both charges are successful payments for the same order, then refund only the duplicate transaction." }] },
  { id: "late-return", title: "Late return fee policy", days: "1 day ago", messages: [{ role: "user", text: "How do I handle a late return?" }, { role: "assistant", text: "Confirm the return time and grace period, then explain the hourly or daily rate in the rental agreement." }] },
  { id: "damage", title: "Vehicle damage claim", days: "2 days ago", messages: [{ role: "user", text: "What should I do with a damage claim?" }, { role: "assistant", text: "Document the condition with photos, create a damage report, and escalate disputed claims." }] },
];

let state = {
  page: "knowledge",
  tab: "documents",
  view: "table",
  modal: null,
  selected: 0,
  selectedDoc: 0,
  docPage: 1,
  docStatus: "All",
  teamQuery: "",
  teamRole: "All",
  analyticsRange: "Last 30 days",
  selectedConversation: "refund",
  query: "",
  theme: localStorage.getItem("conexa-theme") || "light",
  toast: "",
  demoMode: true,
  controlRoomOpen: false,
  role: localStorage.getItem("conexa-role") || "Admin",
  plan: localStorage.getItem("conexa-plan") || "Ultra",
  workspaceState: localStorage.getItem("conexa-workspace-state") || "Active",
  usage: { seats: 4, documents: 128, queries: 12480 },
  chatMessages: JSON.parse(sessionStorage.getItem("conexa-chat-messages") || "null") || conversations[0].messages,
  chatDraft: "",
  chatStreaming: false,
  chatDock: "full",
  authMode: "signin",
  authenticated: true,
  workspace: localStorage.getItem("conexa-workspace") || "Northstar Support",
  liveCall: false,
  callSeconds: 0,
  advancedTab: "quality",
  openaiKey: localStorage.getItem("conexa-openai-key") || "",
  settings: JSON.parse(localStorage.getItem("conexa-settings") || "null") || { workspaceName: "Northstar Support", description: "AI-powered support for our customer service teams." },
};

export { state };
