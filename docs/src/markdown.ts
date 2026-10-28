// The pages as Markdown (`.md` twins, llms-full.txt): rendered and flattened
// by starlight-llm-actions' `simple` renderer — components resolved, a demo
// left as its code.

import type { MarkdownRenderer } from 'starlight-llm-actions';
import simple from 'starlight-llm-actions/internal/simple-markdown';

const FENCED = /^```[^\n]*\n[\s\S]*?\n```$/gm;

const render: MarkdownRenderer = async (entry, context) => {
  const markdown = await simple(entry, context);
  // Expressive Code keeps a newline in an empty line: blank lines of code
  // come out doubled
  return markdown.replace(FENCED, (block) =>
    block.replaceAll('\n\n\n', '\n\n')
  );
};

export default render;
