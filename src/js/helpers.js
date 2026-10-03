import { icons } from "./icons.js";
export function icon(name, cls = "") { return `<span class="icon ${cls}">${icons[name] || ""}</span>`; }
export function button(label, cls = "", action = "") { return `<button class="button ${cls}" data-action="${action}">${label}</button>`; }
export function status(label) { return `<span class="status status-${label.toLowerCase()}">${label}</span>`; }
export function titleCase(value) { return value[0].toUpperCase() + value.slice(1); }
