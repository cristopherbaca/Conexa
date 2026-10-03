export const docs = [
  ["Billing manual.pdf", "2.4 MB", "Indexed", "Billing", "Nina Patel", "Oct 02", "v3"],
  ["Refund policy.docx", "840 KB", "Indexed", "Billing", "Alex Morgan", "Oct 01", "v2"],
  ["Returns policy.pdf", "1.8 MB", "Processing", "Returns", "Sam Rivera", "Oct 03", "v4"],
  ["Account security.html", "124 KB", "Indexed", "Security", "Nina Patel", "Sep 28", "v2"],
  ["Escalation guide.txt", "64 KB", "Outdated", "Support", "Lee Kim", "Sep 15", "v1"],
  ["Payment exceptions.pdf", "4.1 MB", "Failed", "Billing", "Alex Morgan", "Oct 03", "v1"],
];

let state = {
  page: "knowledge",
  tab: "documents",
  view: "table",
  modal: null,
  selected: 0,
  query: "",
  theme: localStorage.getItem("conexa-theme") || "light",
  toast: "",
  connectedIntegrations: ["Zendesk"],
  resolvedInsights: [],
};

export { state };
