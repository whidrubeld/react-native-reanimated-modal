// A Markdown (Sätteri hast) plugin: gives every cell of a table the name of
// its column, `data-label` — on a phone a row stacks into a card that
// labels its values (theme.css).

const elements = (node, tagName) =>
  (node.children ?? []).filter(
    (child) => child.type === 'element' && child.tagName === tagName
  );

/** @type {import('satteri').HastPluginDefinition} */
export const tableLabels = {
  name: 'table-labels',
  element: {
    filter: ['table'],
    visit(table, ctx) {
      const [head] = elements(table, 'thead');
      const [row] = head ? elements(head, 'tr') : [];
      if (!row) return;
      const names = elements(row, 'th').map((cell) =>
        ctx.textContent(cell).trim()
      );
      for (const body of elements(table, 'tbody')) {
        for (const tr of elements(body, 'tr')) {
          elements(tr, 'td').forEach((cell, i) => {
            if (names[i]) ctx.setProperty(cell, 'dataLabel', names[i]);
          });
        }
      }
    },
  },
};
