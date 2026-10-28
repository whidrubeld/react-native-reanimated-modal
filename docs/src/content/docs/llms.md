---
title: LLMs
description: The documentation for AI assistants — every page as Markdown, llms.txt and llms-full.txt, Copy page and Open in Claude or ChatGPT, the type declarations of your version.
---

These pages are written for people and coding agents alike. Every one of them is also plain Markdown, the whole site is one file, and the package's types document every export of the version you installed.

## Every page as Markdown

Add `.md` to a page's address: [`/react-native-reanimated-modal/swipe/`](/react-native-reanimated-modal/swipe/) is also [`/react-native-reanimated-modal/swipe.md`](/react-native-reanimated-modal/swipe.md). Each page points to it with `<link rel="alternate" type="text/markdown">`, so agents that look for it find it.

Above every title, **Copy page** puts that Markdown on the clipboard; its menu also opens it as text, or in a new chat in ChatGPT, Claude and others.

## llms.txt and llms-full.txt

Following [llmstxt.org](https://llmstxt.org):

| File                                                             | What                                                                   | For                                                                       |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| [`/llms.txt`](/react-native-reanimated-modal/llms.txt)           | The index: the library in a sentence, then every page with its summary | An agent that fetches what it needs — give it this address                |
| [`/llms-full.txt`](/react-native-reanimated-modal/llms-full.txt) | Every page in one Markdown file, the guide first                       | A model with a long context, a tool that indexes docs by URL, offline use |

Prompts that work:

```text
Read https://whidrubeld.github.io/react-native-reanimated-modal/llms.txt, then
turn the filter screen in src/screens/Filters.tsx into a bottom sheet modal.
```

```text
Using https://whidrubeld.github.io/react-native-reanimated-modal/custom-animations.md,
make the modal flip in around its vertical axis.
```

## The API of your version

The pages describe the latest release. The package's type declarations describe the one you installed — every prop with its documentation comment: `node_modules/react-native-reanimated-modal/lib/typescript/src/types.d.ts`, or [the latest on unpkg](https://unpkg.com/react-native-reanimated-modal/lib/typescript/src/types.d.ts). An agent unsure of a prop's name or type should read them before guessing.
