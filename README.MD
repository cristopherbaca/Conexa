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
- Responsive layouts for desktop and smaller screens.

### Run it

Open [src/index.html](./src/index.html) directly in a browser. No build step or server is required.

The assistant is intentionally simulated for this prototype: it does not connect to Ollama, a vector database, OpenAI, or real company documents yet. The API key field only simulates connection state and never sends the key to a server.