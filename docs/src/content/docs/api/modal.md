---
title: Modal
description: Every prop of the Modal component — visibility, layout, animation, swipe, backdrop, events, native Modal props and test IDs — with types and defaults, and its ref.
---

```tsx
import {
  Modal,
  type ModalProps,
  type ModalRef,
} from 'react-native-reanimated-modal';
```

`Modal` is a function component with `forwardRef`; its props are `ModalProps`, its ref is [`ModalRef`](#ref).

## Visibility and layout

| Prop                    | Type                   | Default | Description                                                                                                                  |
| ----------------------- | ---------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `visible`               | `boolean`              | —       | Whether the modal is shown. A change animates it in or out                                                                   |
| `children`              | `ReactNode`            | —       | The content                                                                                                                  |
| `closable`              | `boolean`              | `true`  | Whether a backdrop press or a swipe can close it. [Platforms](/react-native-reanimated-modal/platforms/#closable)            |
| `style`                 | `StyleProp<ViewStyle>` | —       | The full-screen container the content is laid out in (`flex: 1`, `justifyContent: 'center'`)                                 |
| `contentContainerStyle` | `StyleProp<ViewStyle>` | —       | The animated wrapper of the content                                                                                          |
| `coverScreen`           | `boolean`              | `false` | Draws the modal in your tree instead of a native `Modal`. [Multiple modals](/react-native-reanimated-modal/multiple-modals/) |

## Animation, swipe, backdrop

| Prop              | Type                                          | Default                                                   | Description                                                                                                                                 |
| ----------------- | --------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `animation`       | `ModalAnimationConfigUnion \| ModalAnimation` | `{ type: 'fade', duration: 300 }`                         | A preset name or a config. [Animations](/react-native-reanimated-modal/animations/)                                                         |
| `swipe`           | `ModalSwipeConfig \| false`                   | `{ enabled: true, directions: ['down'], threshold: 100 }` | Swipe to dismiss; `false` turns it off. [Swipe to dismiss](/react-native-reanimated-modal/swipe/)                                           |
| `backdrop`        | `ModalBackdropConfig \| ReactNode \| false`   | `{ enabled: true, color: 'black', opacity: 0.7 }`         | A config, your element, or `false` for none. [Backdrop](/react-native-reanimated-modal/backdrop/)                                           |
| `onBackdropPress` | `(() => void) \| false`                       | —                                                         | Replaces the close on a backdrop press; `false` ignores presses. [Backdrop](/react-native-reanimated-modal/backdrop/#pressing-the-backdrop) |

## Events

| Prop                | Type         | Description                                                                                                                                              |
| ------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `onShow`            | `() => void` | Called when the opening animation has finished                                                                                                           |
| `onHide`            | `() => void` | Called when the closing animation has finished — set `visible` to `false` here. Without it the swipe is off                                              |
| `onBackButtonPress` | `() => void` | Android: replaces the close on a hardware back press while the modal is open. [Platforms](/react-native-reanimated-modal/platforms/#android-back-button) |

## Native `Modal` props

Passed through to React Native's `Modal`; ignored with `coverScreen`. [Platforms](/react-native-reanimated-modal/platforms/#native-modal-props)

| Prop                       | Platform |
| -------------------------- | -------- |
| `statusBarTranslucent`     | Android  |
| `navigationBarTranslucent` | Android  |
| `hardwareAccelerated`      | Android  |
| `supportedOrientations`    | iOS      |
| `onOrientationChange`      | iOS      |

## Test IDs

| Prop              | Type     | Default             |
| ----------------- | -------- | ------------------- |
| `containerTestID` | `string` | `'modal-container'` |
| `backdropTestID`  | `string` | `'modal-backdrop'`  |
| `contentTestID`   | `string` | `'modal-content'`   |

[Testing](/react-native-reanimated-modal/testing/)

## Ref

```ts
interface ModalRef {
  open: () => void;
  close: () => void;
}
```

| Method    | Description                                                                                  |
| --------- | -------------------------------------------------------------------------------------------- |
| `open()`  | Opens the modal with its animation. Does nothing if it is open or animating                  |
| `close()` | Closes it with its animation, then calls `onHide`. Does nothing if it is closed or animating |

[Ref API](/react-native-reanimated-modal/ref/)
