import { state } from "../state.js";
import { icon, button } from "../helpers.js";

export function authPage() {
  const mode = state.authMode || "signin";
  const brand = `<div class="brand auth-brand"><span class="brand-mark">${icon("grid")}</span><strong>Conexa</strong></div>`;
  if (mode === "workspace") {
    const workspaces = ["Northstar Support", "Roadly Rentals", "Helio Telecom"];
    return `<main class="auth-screen"><section class="auth-card workspace-picker">${brand}<span class="eyebrow">Choose a workspace</span><h1>Where do you want to work?</h1><p class="auth-subtitle">Select a workspace to continue as Cristopher Baca.</p><div class="workspace-options">${workspaces.map((name, index) => {
      const detail = index === 0 ? "Enterprise workspace · Admin" : "Demo workspace · Viewer";
      return `<button class="workspace-option" data-action="select-workspace"><span class="workspace-avatar">${name[0]}</span><span><b>${name}</b><small>${detail}</small></span><span>›</span></button>`;
    }).join("")}</div><button class="text-button" data-action="auth-mode" data-mode="signin">Back to sign in</button></section></main>`;
  }
  const heading = mode === "signup" ? "Create your account" : mode === "forgot" ? "Reset your password" : "Sign in to Conexa";
  const subtitle = mode === "forgot" ? "We will send a reset link to your work email." : "Your team's knowledge, connected.";
  const fields = mode === "forgot"
    ? `<label>Work email<input type="email" placeholder="you@company.com" /></label>${button("Send reset link", "primary", "auth-submit")}`
    : `<label>Work email<input type="email" value="cristopher@northstar.example" /></label><label>Password<input type="password" value="demo-password" /></label>${mode === "signup" ? `<label>Workspace name<input value="Northstar Support" /></label>` : `<div class="auth-row"><label class="check"><input type="checkbox" checked /> Remember me</label><button class="text-button" data-action="auth-mode" data-mode="forgot">Forgot password?</button></div>`}${button(mode === "signup" ? "Create account" : "Sign in", "primary", "auth-submit")}<div class="auth-divider"><span>or</span></div>${button(`${icon("grid")} Continue with SSO`, "ghost", "auth-sso")}`;
  const switchMode = mode === "signup" ? "signin" : "signup";
  const switchText = mode === "signup" ? "Already have an account?" : "New to Conexa?";
  const switchLabel = mode === "signup" ? "Sign in" : "Create an account";
  return `<main class="auth-screen"><section class="auth-card">${brand}<span class="eyebrow">Welcome back</span><h1>${heading}</h1><p class="auth-subtitle">${subtitle}</p>${fields}<p class="auth-switch">${switchText} <button class="text-button" data-action="auth-mode" data-mode="${switchMode}">${switchLabel}</button></p></section></main>`;
}
