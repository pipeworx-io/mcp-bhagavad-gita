interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Bhagavad Gita MCP — Hindu scripture / Vedic text.
 * Sanskrit verses (slokas) with English translations, via the Vedic Scriptures API.
 * Keyless, GitHub Pages JSON. https://vedicscriptures.github.io
 */


const BASE = 'https://vedicscriptures.github.io';
const UA = 'pipeworx/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'list_chapters',
    description:
      'List all 18 chapters of the Bhagavad Gita (Hindu scripture / Vedic text). Returns chapter number, Sanskrit name, transliteration, English meaning, summary, and verse count.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'get_chapter',
    description:
      'Get one chapter of the Bhagavad Gita (Vedic scripture) by number. Returns the Sanskrit name, transliteration, English meaning, summary, and verse count.',
    inputSchema: {
      type: 'object',
      properties: { chapter: { type: 'number', description: 'Chapter number, 1-18.' } },
      required: ['chapter'],
    },
  },
  {
    name: 'get_verse',
    description:
      'Get a single verse (sloka) of the Bhagavad Gita by chapter and verse number. Returns the Sanskrit verse in Devanagari, its transliteration, and English translations from multiple commentators (Sivananda, Purohit, Gambirananda, Adidevananda) plus commentary.',
    inputSchema: {
      type: 'object',
      properties: {
        chapter: { type: 'number', description: 'Chapter number, 1-18.' },
        verse: { type: 'number', description: 'Verse (sloka) number within the chapter.' },
      },
      required: ['chapter', 'verse'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'list_chapters': {
      const data = (await gitaGet('/chapters')) as Array<Record<string, any>>;
      return (data || []).map((c) => ({
        chapter: c.chapter_number,
        name: c.name,
        name_translit: c.translation,
        meaning: c.meaning?.en,
        summary: c.summary?.en,
        verses_count: c.verses_count,
      }));
    }
    case 'get_chapter': {
      const chapter = reqNum(args, 'chapter');
      const data = (await gitaGet(`/chapter/${encodeURIComponent(String(chapter))}`)) as Record<string, any>;
      return {
        chapter: data.chapter_number,
        name: data.name,
        name_translit: data.translation,
        meaning: data.meaning?.en,
        summary: data.summary?.en,
        verses_count: data.verses_count,
      };
    }
    case 'get_verse': {
      const chapter = reqNum(args, 'chapter');
      const verse = reqNum(args, 'verse');
      const data = (await gitaGet(
        `/slok/${encodeURIComponent(String(chapter))}/${encodeURIComponent(String(verse))}`,
      )) as Record<string, any>;
      return {
        chapter: data.chapter,
        verse: data.verse,
        sanskrit: data.slok,
        transliteration: data.transliteration,
        translations: {
          sivananda: data.siva?.et,
          purohit: data.purohit?.et,
          gambirananda: data.gambir?.et,
          adidevananda: data.adi?.et,
        },
        commentary: data.chinmay?.hc || data.siva?.ec,
      };
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function gitaGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Accept: 'application/json', 'User-Agent': UA },
  });
  if (!res.ok) {
    return { error: res.status, message: await res.text().then((t) => t.slice(0, 500)) };
  }
  return res.json();
}

function reqNum(args: Record<string, unknown>, key: string): number {
  const v = args[key];
  const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : NaN;
  if (!Number.isFinite(n)) throw new Error(`Required argument "${key}" must be a number.`);
  return n;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
