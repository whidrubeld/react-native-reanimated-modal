const path = require('path');
const { getDefaultConfig } = require('@expo/metro-config');
const { withMetroConfig } = require('react-native-monorepo-config');

const root = path.resolve(__dirname, '..');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = withMetroConfig(getDefaultConfig(__dirname), {
  root,
  dirname: __dirname,
  // pnpm lists the packages in pnpm-workspace.yaml, not in package.json's
  // `workspaces`; the library itself (the root) is added by its name
  workspaces: ['example'],
});

config.resolver.unstable_enablePackageExports = true;

module.exports = config;
