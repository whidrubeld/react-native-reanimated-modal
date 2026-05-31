/* global jest */

require('react-native-gesture-handler/jestSetup');

jest.mock('react-native-worklets', () => {
  const mock = require('react-native-worklets/src/mock');
  return {
    ...mock,
    scheduleOnRN: (fun, ...args) => fun(...args),
  };
});
require('react-native-reanimated').setUpTests();
