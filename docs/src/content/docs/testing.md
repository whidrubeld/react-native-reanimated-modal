---
title: Testing
description: The modal's test IDs, and a Jest setup for React Native Testing Library — Reanimated's test mode, Worklets' mock and Gesture Handler's root view.
---

## Test IDs

Three elements carry a `testID`, each with a default and a prop to change it — for several modals on one screen, or your end-to-end tests:

| Prop              | Default             | Element                                                        |
| ----------------- | ------------------- | -------------------------------------------------------------- |
| `containerTestID` | `'modal-container'` | The full-screen container (`style`)                            |
| `backdropTestID`  | `'modal-backdrop'`  | The backdrop's `Pressable` — absent with `backdrop={false}`    |
| `contentTestID`   | `'modal-content'`   | The animated wrapper of your content (`contentContainerStyle`) |

Nothing is rendered while the modal is closed: `queryByTestId('modal-content')` is `null`.

## Jest

The library's own tests run on `@react-native/jest-preset` with React Native Testing Library. Reanimated, Worklets and Gesture Handler need their test setups — in a file listed in `setupFilesAfterEnv`:

```js title="jest-setup.js"
require('react-native-gesture-handler/jestSetup');

jest.mock('react-native-worklets', () => {
  const mock = require('react-native-worklets/src/mock');
  // run callbacks scheduled from worklets right away
  return { ...mock, scheduleOnRN: (fn, ...args) => fn(...args) };
});

require('react-native-reanimated').setUpTests();
```

```json title="package.json"
{
  "jest": {
    "preset": "@react-native/jest-preset",
    "resolver": "react-native-reanimated/jest/resolver",
    "setupFilesAfterEnv": ["<rootDir>/jest-setup.js"]
  }
}
```

Render under a `GestureHandlerRootView`, as the app does — Gesture Handler 3 throws when a gesture has no root view above it:

```tsx
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Modal } from 'react-native-reanimated-modal';

it('closes on a backdrop press', async () => {
  const onHide = jest.fn();
  await render(
    <Modal visible onHide={onHide}>
      <Text>Hello</Text>
    </Modal>,
    { wrapper: GestureHandlerRootView }
  );

  expect(screen.getByText('Hello')).toBeTruthy();
  fireEvent.press(screen.getByTestId('modal-backdrop'));
  // …advance timers or wait for onHide: the modal closes after its animation
});
```

The animations run in Reanimated's test mode; use Jest's fake timers (`jest.useFakeTimers()`, `jest.advanceTimersByTime(300)`) to move them along. Swipes are Gesture Handler gestures: drive them with its [testing API](https://docs.swmansion.com/react-native-gesture-handler/docs/guides/testing), or test `onHide` through the backdrop and `visible`.
