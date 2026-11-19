/** Minimal Lexical document from plain paragraphs (and optional h2 headings prefixed with "## "). */
export const richText = (blocks: string[]) => ({
  root: {
    type: 'root',
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
    children: blocks.map((text) => {
      const heading = text.startsWith('## ')
      return {
        type: heading ? 'heading' : 'paragraph',
        ...(heading ? { tag: 'h2' } : { textFormat: 0, textStyle: '' }),
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: heading ? text.slice(3) : text,
            version: 1,
          },
        ],
      }
    }),
  },
})
