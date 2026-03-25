# publicmd

A lightweight web server that renders Markdown (`.md`) documents as clean, styled HTML in your browser.

## Features

- Browse all documents in the `docs/` directory from a sidebar
- Toggle between **Rendered HTML** and **Raw source** views
- Syntax-highlighted code blocks
- GitHub-style Markdown rendering

## Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Adding Documents

Place any `.md` file in the `docs/` directory. It will appear automatically in the sidebar.

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT`   | `3000`  | Port the server listens on |

```bash
PORT=8080 npm start
```

## API

| Endpoint | Description |
|----------|-------------|
| `GET /` | Viewer UI |
| `GET /api/docs` | JSON list of available documents |
| `GET /docs/:filename` | Rendered HTML + raw content for a document |
