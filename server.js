const express = require('express');
const { marked } = require('marked');
const hljs = require('highlight.js');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DOCS_DIR = path.join(__dirname, 'docs');

// Rate limiter: max 60 requests per minute per IP for doc endpoints
const docLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

// Configure marked with syntax highlighting
marked.use({
  gfm: true,
  breaks: true,
  renderer: {
    code({ text, lang }) {
      const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
      const highlighted = hljs.highlight(text, { language }).value;
      return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>\n`;
    },
  },
});

app.use(express.static(path.join(__dirname, 'public')));

// List all available markdown documents
app.get('/api/docs', docLimiter, (req, res) => {
  fs.readdir(DOCS_DIR, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read docs directory' });
    }
    const mdFiles = files
      .filter((f) => f.endsWith('.md'))
      .map((f) => ({
        name: f.replace(/\.md$/, ''),
        filename: f,
        url: `/docs/${encodeURIComponent(f)}`,
      }));
    res.json(mdFiles);
  });
});

// Serve a markdown file rendered as HTML
app.get('/docs/:filename', docLimiter, (req, res) => {
  const filename = req.params.filename;

  // Security: ensure the filename stays within DOCS_DIR (normalized for cross-platform safety)
  const filePath = path.normalize(path.resolve(DOCS_DIR, filename));
  const normalizedDocsDir = path.normalize(DOCS_DIR);
  if (!filePath.startsWith(normalizedDocsDir + path.sep) && filePath !== normalizedDocsDir) {
    return res.status(400).send('Invalid filename');
  }

  if (!filename.endsWith('.md')) {
    return res.status(400).send('Only .md files are supported');
  }

  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err) {
      return res.status(404).send('Document not found');
    }
    const html = marked(content);
    res.json({ html, raw: content, filename });
  });
});

const server = app.listen(PORT, () => {
  console.log(`publicmd server running at http://localhost:${PORT}`);
});

module.exports = server;
