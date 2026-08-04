# mcp-bhagavad-gita

Bhagavad Gita MCP — Hindu scripture / Vedic text.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `list_chapters` | List all 18 chapters of the Bhagavad Gita (Hindu scripture / Vedic text). Returns chapter number, Sanskrit name, transliteration, English meaning, summary, and verse count. |
| `get_chapter` | Get one chapter of the Bhagavad Gita (Vedic scripture) by number. Returns the Sanskrit name, transliteration, English meaning, summary, and verse count. |
| `get_verse` | Get a single verse (sloka) of the Bhagavad Gita by chapter and verse number. Returns the Sanskrit verse in Devanagari, its transliteration, and English translations from multiple commentators (Sivananda, Purohit, Gambirananda, Adidevananda) plus commentary. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "bhagavad-gita": {
      "url": "https://gateway.pipeworx.io/bhagavad-gita/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Bhagavad Gita data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
