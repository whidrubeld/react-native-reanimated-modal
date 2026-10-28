// @ts-check
import { satteri } from '@astrojs/markdown-satteri';
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import starlightLinksValidator from 'starlight-links-validator';
import starlightLlmActions from 'starlight-llm-actions';

import { tableLabels } from './src/table-labels.mjs';

const repository =
  'https://github.com/whidrubeld/react-native-reanimated-modal';

/** The guide in reading order: the sidebar's, and llms.txt's. */
const GUIDE = [
  'getting-started',
  'animations',
  'custom-animations',
  'swipe',
  'backdrop',
  'ref',
  'multiple-modals',
  'platforms',
  'testing',
];
const REFERENCE = ['api/modal', 'api/types', 'api/constants'];

export default defineConfig({
  site: 'https://whidrubeld.github.io',
  base: '/react-native-reanimated-modal',
  // Starlight adds its own plugins to this processor
  markdown: { processor: satteri({ hastPlugins: [tableLabels] }) },
  integrations: [
    starlight({
      title: 'react-native-reanimated-modal',
      description:
        'A lightweight, performant modal for React Native: fade, slide, scale or your own animations on the UI thread, swipe to dismiss in any direction, on top of the native Modal.',
      favicon: '/favicon.svg',
      logo: {
        dark: './src/assets/logo-dark.svg',
        light: './src/assets/logo-light.svg',
        alt: '',
      },
      social: [{ icon: 'github', label: 'GitHub', href: repository }],
      editLink: { baseUrl: `${repository}/edit/master/docs/` },
      customCss: ['./src/styles/theme.css'],
      // the fonts, preloaded
      components: { Head: './src/components/Head.astro' },
      // square frames in the site's black and white, the file name a label;
      // shell blocks too look like code, not a terminal window
      expressiveCode: {
        themes: ['vesper', 'min-light'],
        defaultProps: { frame: 'code' },
        styleOverrides: {
          borderRadius: '0',
          borderColor: 'var(--line)',
          codeBackground: 'var(--panel)',
          codeFontFamily: "'JetBrains Mono Variable', ui-monospace, monospace",
          codeFontSize: '0.8125rem',
          uiFontFamily: "'JetBrains Mono Variable', ui-monospace, monospace",
          uiFontSize: '0.6875rem',
          frames: {
            shadowColor: 'transparent',
            editorTabBarBackground: 'var(--bg)',
            editorTabBarBorderBottomColor: 'var(--line)',
            editorActiveTabBackground: 'var(--panel)',
            editorActiveTabForeground: 'var(--fg)',
            editorActiveTabBorderColor: 'var(--line)',
            editorActiveTabIndicatorTopColor: 'var(--fg)',
            editorActiveTabIndicatorBottomColor: 'transparent',
            frameBoxShadowCssValue: 'none',
            inlineButtonBorder: 'var(--line-strong)',
            inlineButtonBackground: 'var(--bg)',
            inlineButtonForeground: 'var(--fg)',
            tooltipSuccessBackground: 'var(--fg)',
            tooltipSuccessForeground: 'var(--bg)',
          },
        },
      },
      sidebar: [
        { label: 'Guide', items: GUIDE },
        {
          label: 'Reference',
          items: [
            { slug: 'api/modal', label: 'Modal' },
            { slug: 'api/types', label: 'Types' },
            { slug: 'api/constants', label: 'Constants and helpers' },
          ],
        },
        'example',
        'llms',
      ],
      plugins: [
        starlightLinksValidator(),
        starlightLlmActions({
          // pages as Markdown — their chrome left out
          renderMarkdown: { module: './src/markdown.ts' },
          linkAlternate: true,
          llmsTxt: {
            promote: [
              'index*',
              ...[...GUIDE, ...REFERENCE, 'example', 'llms'].map(
                (slug) => `${slug}*`
              ),
            ],
          },
        }),
      ],
    }),
  ],
});
