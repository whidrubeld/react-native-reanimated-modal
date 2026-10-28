# react-native-reanimated-modal · docs

The documentation site, <https://whidrubeld.github.io/react-native-reanimated-modal/>:
[Astro Starlight](https://starlight.astro.build), pages in Markdown, every
page also as Markdown for LLMs (`llms.txt`, Copy page). How it is put
together — pages, links, the look, the deploy — is in the repository's
[AGENTS.md](../AGENTS.md#documentation-docs).

It is a package of the repository's pnpm workspace:

```bash
# repository root
pnpm install

pnpm docs dev         # http://localhost:4321/react-native-reanimated-modal/
                      # (a fresh content cache; replaces a dev server already running)
pnpm docs typecheck   # astro check
pnpm docs build       # astro check + the site in docs/dist/ (validates internal links)
```

In this folder, the same without the `docs` prefix: `pnpm dev`, `pnpm build`.
