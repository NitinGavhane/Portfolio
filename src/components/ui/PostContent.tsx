import { Fragment, ReactNode } from 'react';

/**
 * Renders blog-post body text written in a lightweight Markdown subset:
 *   ## Heading            → h2
 *   ### Subheading        → h3
 *   > Quote               → blockquote
 *   - item  /  * item     → unordered list
 *   1. item               → ordered list
 *   ```                   → fenced code block (may span blank lines)
 *   ![alt](url)           → image
 *   | a | b | / | - | - | → table (header row + separator + rows)
 *   plain text            → paragraph
 *
 * Inline `code`, **bold**, and [links](url) are supported within paragraphs,
 * list items, and table cells.
 */

type Block =
  | { type: 'h2' | 'h3' | 'p' | 'quote'; text: string }
  | { type: 'ul' | 'ol'; items: string[] }
  | { type: 'code'; text: string }
  | { type: 'img'; src: string; alt: string }
  | { type: 'table'; header: string[]; rows: string[][] };

const splitRow = (line: string): string[] =>
  line.replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());

const isTableSeparator = (line: string): boolean =>
  /^\|?[\s:|-]+\|?$/.test(line.trim()) && line.includes('-') && line.includes('|');

function parse(content: string): Block[] {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];

  let para: string[] = [];
  let list: { type: 'ul' | 'ol'; items: string[] } | null = null;
  let quote: string[] = [];
  let inCode = false;
  let code: string[] = [];

  const flushPara = () => {
    if (para.length) {
      blocks.push({ type: 'p', text: para.join(' ') });
      para = [];
    }
  };
  const flushList = () => {
    if (list) {
      blocks.push(list);
      list = null;
    }
  };
  const flushQuote = () => {
    if (quote.length) {
      blocks.push({ type: 'quote', text: quote.join(' ') });
      quote = [];
    }
  };
  const flushAll = () => {
    flushPara();
    flushList();
    flushQuote();
  };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trimEnd();

    // Fenced code blocks — take priority so their contents are verbatim.
    if (line.trimStart().startsWith('```')) {
      if (inCode) {
        blocks.push({ type: 'code', text: code.join('\n') });
        code = [];
        inCode = false;
      } else {
        flushAll();
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      code.push(raw);
      continue;
    }

    if (line.trim() === '') {
      flushAll();
      continue;
    }

    // Tables: a "| a | b |" row immediately followed by a "| --- | --- |" separator.
    if (line.trim().startsWith('|') && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      flushAll();
      const header = splitRow(line.trim());
      const rows: string[][] = [];
      i += 2; // skip header + separator
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(splitRow(lines[i].trim()));
        i++;
      }
      i--; // for-loop will increment
      blocks.push({ type: 'table', header, rows });
      continue;
    }

    const img = line.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (img) {
      flushAll();
      blocks.push({ type: 'img', alt: img[1], src: img[2] });
      continue;
    }

    if (line.startsWith('## ')) {
      flushAll();
      blocks.push({ type: 'h2', text: line.slice(3) });
      continue;
    }
    if (line.startsWith('### ')) {
      flushAll();
      blocks.push({ type: 'h3', text: line.slice(4) });
      continue;
    }
    if (line.startsWith('> ')) {
      flushPara();
      flushList();
      quote.push(line.slice(2));
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      flushPara();
      flushQuote();
      if (!list || list.type !== 'ul') {
        flushList();
        list = { type: 'ul', items: [] };
      }
      list.items.push(line.replace(/^[-*]\s+/, ''));
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      flushPara();
      flushQuote();
      if (!list || list.type !== 'ol') {
        flushList();
        list = { type: 'ol', items: [] };
      }
      list.items.push(line.replace(/^\d+\.\s+/, ''));
      continue;
    }

    // Plain text — accumulate into the current paragraph.
    flushList();
    flushQuote();
    para.push(line);
  }

  if (inCode && code.length) blocks.push({ type: 'code', text: code.join('\n') });
  flushAll();
  return blocks;
}

/** Inline formatting: **bold** and `code`. */
function inline(text: string): ReactNode {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      return (
        <a
          key={i}
          href={link[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--text-primary)] underline underline-offset-2 decoration-[var(--border-secondary)] hover:decoration-[var(--text-primary)] transition-colors break-words"
        >
          {link[1]}
        </a>
      );
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-[var(--text-primary)]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] text-[0.9em] font-mono text-[var(--text-primary)]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

const PostContent = ({ content }: { content: string }) => {
  const blocks = parse(content);

  return (
    <div className="text-[17px] sm:text-[18px] leading-[1.75] text-[var(--text-secondary)] space-y-5">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'h2':
            return (
              <h2
                key={i}
                className="font-serif text-[26px] sm:text-[30px] text-[var(--text-primary)] leading-tight tracking-tight mt-12 mb-2"
              >
                {block.text}
              </h2>
            );
          case 'h3':
            return (
              <h3
                key={i}
                className="font-sans font-semibold text-[19px] sm:text-[20px] text-[var(--text-primary)] mt-9 mb-1"
              >
                {block.text}
              </h3>
            );
          case 'quote':
            return (
              <blockquote
                key={i}
                className="border-l-2 border-[var(--text-primary)] pl-6 italic text-[var(--text-primary)] my-8 text-[18px] sm:text-[20px] leading-relaxed"
              >
                {inline(block.text)}
              </blockquote>
            );
          case 'ul':
            return (
              <ul key={i} className="space-y-2.5 my-6">
                {block.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <span className="mt-[0.7em] w-1.5 h-1.5 rounded-full bg-[var(--text-tertiary)] flex-shrink-0" />
                    <span>{inline(item)}</span>
                  </li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={i} className="space-y-2.5 my-6">
                {block.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <span className="mt-[0.15em] flex-shrink-0 w-6 h-6 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-primary)] text-xs font-semibold flex items-center justify-center">
                      {j + 1}
                    </span>
                    <span className="pt-0.5">{inline(item)}</span>
                  </li>
                ))}
              </ol>
            );
          case 'code':
            return (
              <pre
                key={i}
                className="my-6 overflow-x-auto rounded-md bg-[var(--bg-tertiary)] border border-[var(--border-primary)] p-4 text-[14px] leading-relaxed"
              >
                <code className="font-mono text-[var(--text-primary)] whitespace-pre">
                  {block.text}
                </code>
              </pre>
            );
          case 'table':
            return (
              <div key={i} className="my-6 overflow-x-auto rounded-md border border-[var(--border-primary)]">
                <table className="w-full text-[15px] border-collapse">
                  <thead>
                    <tr className="bg-[var(--bg-secondary)]">
                      {block.header.map((h, j) => (
                        <th
                          key={j}
                          className="text-left font-semibold text-[var(--text-primary)] px-4 py-2.5 border-b border-[var(--border-primary)] whitespace-nowrap"
                        >
                          {inline(h)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, r) => (
                      <tr key={r} className="border-b border-[var(--border-primary)] last:border-0">
                        {row.map((cell, c) => (
                          <td key={c} className="px-4 py-2.5 align-top text-[var(--text-secondary)]">
                            {inline(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case 'img':
            return (
              <figure key={i} className="my-8">
                <img
                  src={block.src}
                  alt={block.alt}
                  loading="lazy"
                  className="w-full rounded-md border border-[var(--border-primary)]"
                />
                {block.alt && (
                  <figcaption className="mt-2 text-center text-sm text-[var(--text-muted)]">
                    {block.alt}
                  </figcaption>
                )}
              </figure>
            );
          default:
            return (
              <p key={i}>{inline((block as { text: string }).text)}</p>
            );
        }
      })}
    </div>
  );
};

export default PostContent;
