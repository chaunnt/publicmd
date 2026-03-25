# Markdown Syntax Guide

This document demonstrates the Markdown features supported by publicmd.

## Headings

```
# H1
## H2
### H3
#### H4
```

## Emphasis

- *italic* or _italic_
- **bold** or __bold__
- ~~strikethrough~~
- **_bold italic_**

## Lists

### Unordered

- Item one
- Item two
  - Nested item
  - Another nested item
- Item three

### Ordered

1. First item
2. Second item
3. Third item

## Links & Images

[GitHub](https://github.com) — external link

## Blockquotes

> "The best way to predict the future is to invent it."
> — Alan Kay

> Nested blockquotes:
> > Inner quote

## Code

Inline `code` looks like this.

### Fenced code block (JavaScript)

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}

console.log(greet('World'));
```

### Fenced code block (Python)

```python
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

print(list(fibonacci(10)))
```

## Tables

| Language   | Paradigm     | Typing  |
|------------|--------------|---------|
| JavaScript | Multi-paradigm | Dynamic |
| Python     | Multi-paradigm | Dynamic |
| Rust       | Systems      | Static  |
| Haskell    | Functional   | Static  |

## Horizontal Rule

---

## Task Lists

- [x] Create the server
- [x] Build the viewer UI
- [x] Add sample documents
- [ ] Deploy to production

## HTML Entities

&copy; 2024 &mdash; publicmd &trade;
