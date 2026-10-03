# Conexa AI architecture

## Application layers

- `src/index.html` contains the shell and the three user views: chat, knowledge base, and activity.
- `src/styles.css` contains the responsive visual system, light/dark themes, chat layout, administration modal, and view components.
- `src/app.js` contains interaction state, API calls, navigation, activity rendering, RAG document rendering, and administrator actions.
- `docs/rags/*.json` contains the two simulated retrieval datasets used as product content and UI examples.

## Runtime flow

1. The administrator enters an API key and selects **Test & enable chat**.
2. The browser validates the key against the OpenAI models endpoint.
3. Questions are sent to Chat Completions with a fixed `gpt-4o-mini` model.
4. The system prompt supplies the Fleet & Policies and Customer Care RAG descriptions.
5. Knowledge base management is currently a prototype UI. Editing a document in the UI changes the visible session only; durable changes should be implemented through a cloud API.

## Production migration

The current direct browser call is intentionally limited to a proof of concept. A production deployment should:

- Move OpenAI requests into a server-side API route.
- Store secrets in a cloud secret manager or environment variable.
- Store RAG documents and embeddings in a managed database/vector store.
- Add authentication and role-based authorization for the administrator tools.
- Persist conversations and activity records in the cloud.
