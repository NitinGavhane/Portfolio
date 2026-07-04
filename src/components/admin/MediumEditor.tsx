import { useState, useRef, useCallback } from 'react';
import { Image, Code, Link, Plus, X, Heading, Heading2, List, Quote } from 'lucide-react';

type BlockType =
  | 'paragraph'
  | 'heading'
  | 'subheading'
  | 'quote'
  | 'list'
  | 'image'
  | 'code'
  | 'embed';

interface Block {
  id: string;
  type: BlockType;
  content: string;
}

interface MediumEditorProps {
  initialContent?: string;
  onChange: (content: string) => void;
}

let blockCounter = 0;
const newBlock = (type: BlockType = 'paragraph', content = ''): Block => ({
  id: `b_${++blockCounter}`,
  type,
  content,
});

const allLinesStartWith = (segment: string, re: RegExp) =>
  segment.split('\n').filter(Boolean).every((l) => re.test(l));

function parseMarkdownToBlocks(md: string): Block[] {
  if (!md) return [newBlock('paragraph', '')];
  const segments = md.split('\n\n').filter((s) => s.length > 0);
  const blocks: Block[] = [];
  let inCode = false;
  let codeBuffer: string[] = [];

  for (const seg of segments) {
    if (seg.startsWith('```')) {
      if (inCode) {
        blocks.push(newBlock('code', codeBuffer.join('\n\n')));
        codeBuffer = [];
        inCode = false;
      } else {
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      codeBuffer.push(seg);
      continue;
    }
    if (seg.startsWith('![')) {
      const match = seg.match(/!\[.*?\]\((.*?)\)/);
      if (match) blocks.push(newBlock('image', match[1]));
      continue;
    }
    if (seg.startsWith('### ')) {
      blocks.push(newBlock('subheading', seg.slice(4)));
      continue;
    }
    if (seg.startsWith('## ')) {
      blocks.push(newBlock('heading', seg.slice(3)));
      continue;
    }
    if (allLinesStartWith(seg, /^>\s/)) {
      blocks.push(newBlock('quote', seg.split('\n').map((l) => l.replace(/^>\s/, '')).join('\n')));
      continue;
    }
    if (allLinesStartWith(seg, /^[-*]\s/)) {
      blocks.push(newBlock('list', seg.split('\n').map((l) => l.replace(/^[-*]\s/, '')).join('\n')));
      continue;
    }
    if (seg.startsWith('http') && !seg.includes('\n')) {
      blocks.push(newBlock('embed', seg));
      continue;
    }
    blocks.push(newBlock('paragraph', seg));
  }
  if (inCode && codeBuffer.length) blocks.push(newBlock('code', codeBuffer.join('\n\n')));
  if (!blocks.length) blocks.push(newBlock('paragraph', ''));
  return blocks;
}

function serializeBlocksToMarkdown(blocks: Block[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case 'paragraph': return b.content;
        case 'heading': return `## ${b.content}`;
        case 'subheading': return `### ${b.content}`;
        case 'quote': return b.content.split('\n').map((l) => `> ${l}`).join('\n');
        case 'list': return b.content.split('\n').filter(Boolean).map((l) => `- ${l}`).join('\n');
        case 'image': return `![image](${b.content})`;
        case 'code': return '```\n' + b.content + '\n```';
        case 'embed': return b.content;
        default: return b.content;
      }
    })
    .join('\n\n');
}

const MENU: { type: BlockType; label: string; Icon: typeof Image }[] = [
  { type: 'heading', label: 'Heading (H2)', Icon: Heading },
  { type: 'subheading', label: 'Subheading (H3)', Icon: Heading2 },
  { type: 'list', label: 'Bulleted List', Icon: List },
  { type: 'quote', label: 'Quote', Icon: Quote },
  { type: 'image', label: 'Image', Icon: Image },
  { type: 'code', label: 'Code Block', Icon: Code },
  { type: 'embed', label: 'Embed', Icon: Link },
];

const MediumEditor = ({ initialContent, onChange }: MediumEditorProps) => {
  const [blocks, setBlocks] = useState<Block[]>(() => parseMarkdownToBlocks(initialContent || ''));
  const [plusIndex, setPlusIndex] = useState<number | null>(null);
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const blockRefs = useRef<Map<string, HTMLTextAreaElement | HTMLInputElement>>(new Map());

  const emitChange = useCallback((updated: Block[]) => {
    onChange(serializeBlocksToMarkdown(updated));
  }, [onChange]);

  const updateBlock = (id: string, content: string) => {
    setBlocks(prev => {
      const next = prev.map(b => b.id === id ? { ...b, content } : b);
      emitChange(next);
      return next;
    });
  };

  const addBlock = (afterIndex: number, type: BlockType) => {
    const b = newBlock(type, '');
    setBlocks(prev => {
      const next = [...prev];
      next.splice(afterIndex + 1, 0, b);
      emitChange(next);
      return next;
    });
    setOpenMenuIndex(null);
    setTimeout(() => blockRefs.current.get(b.id)?.focus(), 50);
  };

  const removeBlock = (id: string) => {
    setBlocks(prev => {
      if (prev.length <= 1) return prev;
      const next = prev.filter(b => b.id !== id);
      emitChange(next);
      return next;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent, block: Block, index: number) => {
    const el = e.currentTarget as HTMLTextAreaElement;
    // Paragraph: Enter splits into a new paragraph at the cursor.
    if (e.key === 'Enter' && !e.shiftKey && block.type === 'paragraph') {
      e.preventDefault();
      const cursorPos = el.selectionStart;
      const before = block.content.slice(0, cursorPos);
      const after = block.content.slice(cursorPos);
      updateBlock(block.id, before);
      const b = newBlock('paragraph', after);
      setBlocks(prev => {
        const next = [...prev];
        next.splice(index + 1, 0, b);
        emitChange(next);
        return next;
      });
      setTimeout(() => blockRefs.current.get(b.id)?.focus(), 50);
      return;
    }
    // Headings: Enter exits into a fresh paragraph.
    if (e.key === 'Enter' && !e.shiftKey && (block.type === 'heading' || block.type === 'subheading')) {
      e.preventDefault();
      addBlock(index, 'paragraph');
      return;
    }
    // Backspace on an empty block removes it.
    if (e.key === 'Backspace' && block.content === '' && blocks.length > 1) {
      e.preventDefault();
      removeBlock(block.id);
      setTimeout(() => {
        const prevBlock = blocks[index - 1];
        if (prevBlock) blockRefs.current.get(prevBlock.id)?.focus();
      }, 50);
    }
    // quote / list / code allow Enter to insert newlines (multi-line blocks).
  };

  const autoGrow = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  };

  const setRef = (block: Block) => (el: HTMLTextAreaElement | HTMLInputElement | null) => {
    if (el) {
      blockRefs.current.set(block.id, el);
      if (el instanceof HTMLTextAreaElement) autoGrow(el);
    }
  };

  const textBlock = (block: Block, index: number, className: string, placeholder: string) => (
    <div className="group relative">
      <textarea
        ref={setRef(block)}
        value={block.content}
        onChange={e => { updateBlock(block.id, e.target.value); autoGrow(e.target); }}
        onKeyDown={e => handleKeyDown(e, block, index)}
        onFocus={() => setPlusIndex(null)}
        className={`w-full bg-transparent outline-none resize-none overflow-hidden ${className}`}
        placeholder={placeholder}
        rows={1}
      />
    </div>
  );

  const renderBlock = (block: Block, index: number) => {
    switch (block.type) {
      case 'heading':
        return textBlock(block, index, 'font-serif text-[30px] leading-tight text-[var(--text-primary)] placeholder:text-[var(--text-muted)]', 'Heading');
      case 'subheading':
        return textBlock(block, index, 'font-sans font-semibold text-[20px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]', 'Subheading');
      case 'quote':
        return (
          <div className="group relative my-4 border-l-2 border-[var(--text-primary)] pl-5">
            {textBlock(block, index, 'italic text-[19px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]', 'Quote…')}
          </div>
        );
      case 'list':
        return (
          <div className="group relative my-2">
            <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">One item per line</div>
            {textBlock(block, index, 'text-[17px] leading-[1.9] text-[var(--text-secondary)] placeholder:text-[var(--text-muted)]', 'List item 1\nList item 2')}
          </div>
        );

      case 'image':
        return (
          <div className="group relative my-6">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                {block.content && (
                  <img src={block.content} alt="" className="max-w-full h-auto rounded-sm mb-2" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                )}
                <input
                  ref={setRef(block)}
                  type="text" value={block.content}
                  onChange={e => updateBlock(block.id, e.target.value)}
                  className="w-full text-sm text-[var(--text-tertiary)] bg-transparent border-b border-[var(--border-primary)] focus:border-[var(--text-primary)] outline-none pb-1"
                  placeholder="Paste image URL..."
                />
              </div>
              <button onClick={() => removeBlock(block.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                <X size={14} />
              </button>
            </div>
          </div>
        );

      case 'code':
        return (
          <div className="group relative my-6">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-sm">
              <div className="flex items-center justify-between px-4 py-1.5 border-b border-[var(--border-primary)]">
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Code</span>
                <button onClick={() => removeBlock(block.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                  <X size={13} />
                </button>
              </div>
              <textarea
                ref={setRef(block)}
                value={block.content}
                onChange={e => updateBlock(block.id, e.target.value)}
                onKeyDown={e => handleKeyDown(e, block, index)}
                className="w-full bg-transparent text-sm font-mono text-[var(--text-secondary)] p-4 outline-none resize-y min-h-[80px]"
                placeholder="Write code here..."
                spellCheck={false}
              />
            </div>
          </div>
        );

      case 'embed':
        return (
          <div className="group relative my-6">
            <div className="flex items-start gap-3">
              <div className="flex-1 flex items-center gap-2 px-4 py-3 border border-[var(--border-primary)] rounded-sm bg-[var(--bg-secondary)]">
                <Link size={14} className="text-[var(--text-muted)] flex-shrink-0" />
                <input
                  ref={setRef(block)}
                  type="text" value={block.content}
                  onChange={e => updateBlock(block.id, e.target.value)}
                  className="flex-1 bg-transparent text-sm text-[var(--text-secondary)] outline-none"
                  placeholder="Paste embed URL (YouTube, Tweet, etc)..."
                />
              </div>
              <button onClick={() => removeBlock(block.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                <X size={14} />
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="group relative">
            {textBlock(block, index, 'text-[var(--text-secondary)] text-[18px] leading-[1.7]', index === blocks.length - 1 ? 'Tell your story…' : '')}
          </div>
        );
    }
  };

  return (
    <div className="max-w-[680px] mx-auto">
      <div className="space-y-1">
        {blocks.map((block, index) => (
          <div key={block.id} className="relative">
            <div
              className="absolute -left-12 top-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              style={{ opacity: plusIndex === index ? 1 : undefined }}
              onMouseEnter={() => setPlusIndex(index)}
              onMouseLeave={() => setPlusIndex(null)}
            >
              <div className="relative">
                <button
                  onClick={() => setOpenMenuIndex(openMenuIndex === index ? null : index)}
                  className="w-7 h-7 rounded-full border border-[var(--border-primary)] bg-[var(--bg-primary)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-colors"
                  aria-label="Insert block"
                >
                  <Plus size={14} />
                </button>
                {openMenuIndex === index && (
                  <div className="absolute left-0 top-8 bg-[var(--bg-primary)] border border-[var(--border-primary)] shadow-card rounded-sm z-20 py-1 w-48">
                    {MENU.map(({ type, label, Icon }) => (
                      <button
                        key={type}
                        onClick={() => addBlock(index, type)}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
                      >
                        <Icon size={14} /> {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div
              onMouseEnter={() => setPlusIndex(index)}
              onMouseLeave={() => setPlusIndex(p => (p === index ? null : p))}
            >
              {renderBlock(block, index)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediumEditor;
