module.exports = {
  overrides: [
    {
      exclude: /\/node_modules\//,
      presets: ['module:react-native-builder-bob/babel-preset'],
    },
    {
      include: /\/node_modules\//,
      presets: ['module:@react-native/babel-preset'],
    },
  ],
  plugins: ['react-native-worklets/plugin'],
  // TODO: Fix after upgrading to React Native 0.81.x (Flow syntax in core files)
  env: {
    test: {
      presets: [
        [
          'module:@react-native/babel-preset',
          {
            unstable_disableES6Transforms: true,
            flow: true,
          },
        ],
      ],
      plugins: [
        'react-native-worklets/plugin',
        [
          '@babel/plugin-transform-flow-strip-types',
          {
            all: true,
          },
        ],
      ],
    },
  },
};
