## Conexa AI prototype

### Project structure

```text
SUPPORTCHAT/
├── docs/
│   ├── pdfs/                 # Project reference documents
│   └── rags/                 # Simulated retrieval datasets
├── src/
│   ├── index.html            # Prototype entry point
│   ├── styles.css            # Interface styles
│   ├── app.js                # View, chat, API, and admin behavior
│   └── data/
│       └── workspaceData.js  # Activity and RAG UI data
└── README.MD
```

This is a browser-only simulation of the private Avis / Budget operations assistant described in the project PDFs. It demonstrates:

- A cloud workspace with encrypted transport messaging.
- Avis, Budget, and shared-policy knowledge sources.
- Retrieval health and indexed-document context.
- Suggested operational questions and simulated grounded responses.
- Two invented RAG pipelines: Fleet & Policies and Customer Care.
- Light/dark theme toggle.
- ChatGPT API key input for proof-of-concept browser testing.
- Direct ChatGPT test mode after a key is entered, with the selected key held in page memory only.
- Application administrator panel for clearing chat and resetting prototype state.
- Responsive layouts for desktop and smaller screens.

### Run it

Open [src/index.html](./src/index.html) directly in a browser. No build step or server is required.

Because the app uses native JavaScript modules, some browsers restrict `file://` imports. If that happens, serve the repository with any static server (for example `python -m http.server` from the project root) and open `http://localhost:8000/src/`.

### Application behavior

- **Ask Conexa AI** is the full-canvas chat screen.
- **New conversation** clears the current canvas and creates an activity entry.
- **Knowledge base** replaces the chat canvas with the two RAG managers and their document lists.
- **Recent activity** replaces the chat canvas with previous conversations that can be reopened.
- **Help** replaces the chat canvas with administrator instructions.
- The administrator profile opens the control center and API connection controls.

The RAG sources are represented by editable JSON datasets in `docs/rags/`. When an API key is entered and tested, the browser calls the OpenAI Chat Completions API directly using a fixed `gpt-4o-mini` model; there is no model selector. The key is never stored in localStorage or committed to the project, but direct browser API use is only suitable for a proof of concept. For production, move the API call behind a server-side proxy and keep the key in an environment variable.