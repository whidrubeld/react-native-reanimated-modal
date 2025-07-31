/** @type {Partial<import("typedoc").TypeDocOptions>} */
const config = {
  plugin: ['typedoc-github-theme'],
  theme: 'typedoc-github-theme',
  includeVersion: true,
  navigation: {
    includeGroups: true,
  },
  //
  name: 'react-native-reanimated-modal',
  entryPoints: ['./src/index.ts'],
  out: 'docs',
  tsconfig: './tsconfig.json',
};

export default config;
