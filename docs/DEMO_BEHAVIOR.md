# Demo behavior

The Conexa frontend is fully simulated and runs without a backend. Chat answers are generated from seeded contact-center scenarios covering fuel policy, late returns, damage claims, upgrades, billing, and refunds.

The Control Room accepts an optional OpenAI API key for demo configuration. It is stored only in browser `localStorage`, masked in the UI, and is not sent anywhere by this frontend-only build. A real production integration should move the key to a secure server-side environment and never expose it to browser JavaScript.
