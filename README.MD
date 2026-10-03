## Conexa AI prototype

### Project structure

```text
SUPPORTCHAT/
├── docs/
│   └── pdfs/                 # Project reference documents
├── src/
│   ├── index.html            # Prototype entry point
│   ├── styles.css            # Interface styles
│   └── app.js                # Simulated chat behavior
└── README.MD
```

This is a browser-only simulation of the private Avis / Budget operations assistant described in the project PDFs. It demonstrates:

- A private, self-hosted workspace with local Llama model status.
- Avis, Budget, and shared-policy knowledge sources.
- Retrieval health and indexed-document context.
- Suggested operational questions and simulated grounded responses.
- Two invented RAG pipelines: Fleet & Policies and Customer Care.
- Light/dark theme toggle.
- Local-only ChatGPT API key input for future integration testing.
- Direct ChatGPT test mode after a key is entered, with the selected key held in page memory only.
- Application administrator panel for clearing chat and resetting prototype state.
- Responsive layouts for desktop and smaller screens.

### Run it

Open [src/index.html](./src/index.html) directly in a browser. No build step or server is required.

The RAG sources remain simulated. When an API key is entered and tested, the browser calls the OpenAI Chat Completions API directly using a fixed `gpt-4o-mini` model; there is no model selector. The key is never stored in localStorage or committed to the project, but direct browser API use is only suitable for a private proof of concept. For production, move the API call behind a server-side proxy and keep the key in an environment variable.