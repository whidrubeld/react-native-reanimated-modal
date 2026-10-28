---
title: Multiple modals
description: coverScreen draws the modal in your view tree instead of a native window — for modals stacked on each other, touches through to the app, and modals over React Navigation's native stack in a FullWindowOverlay.
---

By default the modal is a React Native [`Modal`](https://reactnative.dev/docs/modal): a native window above the app, transparent, with the animations drawn inside it. That is what makes it cover tab bars, headers and native screens without any setup.

With `coverScreen`, it is drawn **in your tree** instead — an absolutely positioned view over its parent, the full size of the screen when the parent is:

```tsx
<Modal visible={visible} onHide={hide} coverScreen>
  …
</Modal>
```

|                                                                            | Native `Modal` (default)                               | `coverScreen`                                              |
| -------------------------------------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------- |
| Covers                                                                     | Everything, native screens and the status bar included | Its parent: put it at the root of the screen or of the app |
| Several open at once                                                       | One native modal at a time is reliable                 | As many as you like, later ones on top                     |
| Touches outside the content                                                | Never reach the app                                    | Pass through where there is no backdrop                    |
| `statusBarTranslucent`, `supportedOrientations` and the other native props | Applied                                                | Ignored                                                    |
| Android back button                                                        | Through the native `onRequestClose`                    | Through `BackHandler`                                      |

## Stacking modals

Render the modals side by side with `coverScreen`, at a level that covers the screen; the one rendered last is on top:

```tsx
<>
  <Modal
    visible={first}
    onHide={() => setFirst(false)}
    coverScreen
    animation={{ type: 'slide', direction: 'up' }}
    swipe={{ directions: ['up', 'down', 'left', 'right'] }}
  >
    <Button title="Open the second" onPress={() => setSecond(true)} />
  </Modal>

  <Modal
    visible={second}
    onHide={() => setSecond(false)}
    coverScreen
    animation={{ type: 'slide', direction: 'left' }}
    swipe={{ directions: ['left', 'down', 'right', 'up'] }}
  >
    …
  </Modal>
</>
```

## With React Navigation

Screens of `@react-navigation/native-stack` are native views: a `coverScreen` modal inside a screen stays under the stack's header and under modal screens presented over it. On iOS, `FullWindowOverlay` from `react-native-screens` lifts its children into a window above all of them:

```tsx
import type { ReactNode } from 'react';
import { Platform } from 'react-native';
import { FullWindowOverlay } from 'react-native-screens';
import { Modal } from 'react-native-reanimated-modal';

const Overlay = ({ children }: { children: ReactNode }) =>
  Platform.OS === 'ios' ? (
    <FullWindowOverlay>{children}</FullWindowOverlay>
  ) : (
    <>{children}</>
  );

function Modals() {
  return (
    <Overlay>
      <Modal visible={first} onHide={() => setFirst(false)} coverScreen>
        …
      </Modal>
      <Modal visible={second} onHide={() => setSecond(false)} coverScreen>
        …
      </Modal>
    </Overlay>
  );
}
```

Always set `coverScreen` inside a `FullWindowOverlay`: a native `Modal` there would open a window of its own and lose the layering.
