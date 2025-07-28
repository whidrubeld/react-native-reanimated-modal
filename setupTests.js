/* global jest */
import 'react-native-gesture-handler/jestSetup';

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock')
);

// Optional: mock NativeAnimatedHelper to silence warnings
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
