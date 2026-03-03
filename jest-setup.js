/* global jest */

require('react-native-gesture-handler/jestSetup');

jest.mock('react-native-worklets', () =>
  require('react-native-worklets/src/mock')
);
require('react-native-reanimated').setUpTests();
