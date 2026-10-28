---
title: Getting started
description: Install react-native-reanimated-modal and its peers, check the version for your Expo SDK or Worklets, and show a first modal.
---

## Install

```bash
npm install react-native-reanimated-modal
# or: yarn add react-native-reanimated-modal · pnpm add react-native-reanimated-modal · bun add react-native-reanimated-modal
```

The library has no dependencies of its own. It needs these peers, each installed by its own guide — they have native code and a Babel plugin to set up:

| Package                                                                                                                  | Why                                     |
| ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------- |
| [`react-native-reanimated`](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/)       | The animations, on the UI thread        |
| [`react-native-worklets`](https://docs.swmansion.com/react-native-worklets/docs/)                                        | Reanimated 4's worklets, and its plugin |
| [`react-native-gesture-handler`](https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/installation) | Swipe to dismiss                        |

With Expo, `npx expo install react-native-reanimated react-native-worklets react-native-gesture-handler` picks the versions of your SDK, and `babel-preset-expo` adds the Worklets plugin by itself. Without Expo, add `react-native-worklets/plugin` to your `babel.config.js`.

## Version compatibility

Version **1.2.5** moved to the Worklets API of `react-native-worklets` 0.7.2 and later; it does not run with older Worklets.

| `react-native-reanimated-modal` | `react-native-worklets` | Expo SDK |
| ------------------------------- | ----------------------- | -------- |
| 1.2.5 and later                 | 0.7.2 and later         | 55+      |
| 1.2.4                           | 0.5.1                   | 54       |

On Expo SDK 54 or below, or with `react-native-worklets@0.5.1`, install 1.2.4:

```bash
npm install react-native-reanimated-modal@1.2.4
```

Mismatched versions fail at runtime or leave the modal without its animations. The current release is developed and tested against the [example app](/react-native-reanimated-modal/example/)'s versions: Expo SDK 58, React Native 0.88, Reanimated 4.7, Worklets 0.13 and Gesture Handler 3.3.

## A first modal

Wrap your app in `GestureHandlerRootView` once — the modal's swipe needs it on iOS (on Android the modal brings its own):

```tsx
import { useState } from 'react';
import { Button, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Modal } from 'react-native-reanimated-modal';

export default function App() {
  const [visible, setVisible] = useState(false);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button title="Show modal" onPress={() => setVisible(true)} />
      </View>

      <Modal visible={visible} onHide={() => setVisible(false)}>
        <View
          style={{
            margin: 20,
            padding: 20,
            borderRadius: 12,
            backgroundColor: 'white',
          }}
        >
          <Text>Hello from the modal!</Text>
          <Button title="Close" onPress={() => setVisible(false)} />
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
}
```

By default it fades in over a black backdrop at 70% opacity, and closes on a press of the backdrop, a swipe down or the Android back button.

`visible` is yours: the modal animates whenever it changes. When the user closes the modal — backdrop, swipe, back button — it animates out and calls `onHide`, where you set `visible` to `false`. **Always pass `onHide`**: swipe to dismiss is off without it, and a modal closed by the user while `visible` stays `true` opens again.

The content is laid out in a full-screen container, centered vertically by default. Style that container with `style` and the animated wrapper around your content with `contentContainerStyle` — `{ flex: 1 }` for a [full-screen modal](/react-native-reanimated-modal/animations/#a-full-screen-sheet), `justifyContent: 'flex-end'` on `style` for a [bottom sheet](/react-native-reanimated-modal/animations/#a-bottom-sheet).

## Next

- [Animations](/react-native-reanimated-modal/animations/) — fade, slide and scale, and their options.
- [Swipe to dismiss](/react-native-reanimated-modal/swipe/) — directions, distance, bounce.
- [Backdrop](/react-native-reanimated-modal/backdrop/) — color, blur, press handling.
- [`Modal` props](/react-native-reanimated-modal/api/modal/) — all of them in one table.
