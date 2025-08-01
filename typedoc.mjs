/** @type {Partial<import("typedoc").TypeDocOptions>} */
const config = {
  plugin: ['typedoc-theme-oxide'],
  theme: 'oxide',
  includeVersion: true,
  navigation: {
    includeGroups: true,
  },
  //
  name: 'React Native Reanimated Modal',
  entryPoints: ['./src/index.ts'],
  out: 'docs',
  tsconfig: './tsconfig.json',
};

export default config;
