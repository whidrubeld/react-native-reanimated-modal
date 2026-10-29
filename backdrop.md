# Backdrop

> The backdrop prop — a color and an opacity, your own component such as a blur, or none — and onBackdropPress, to close, run your own handler or ignore presses.

Behind the content, a backdrop covers the screen and fades in with it: black at 70% opacity by default. Pressing it closes the modal.

## Color and opacity

```tsx
<Modal
  visible={visible}
  onHide={hide}
  backdrop={{ color: '#1b1033', opacity: 0.85 }}
>
  …
</Modal>
```

| Option    | Default   | Description                                     |
| --------- | --------- | ----------------------------------------------- |
| `enabled` | `true`    | Whether there is a backdrop                     |
| `color`   | `'black'` | Any React Native color                          |
| `opacity` | `0.7`     | Its opacity when the modal is open, from 0 to 1 |

The options are merged over the defaults. A semi-transparent `color` multiplies with `opacity`.

## Your own backdrop

Pass an element instead, and it is drawn in the backdrop’s place — it fades in and out, and fades during a swipe, like the default one. Make it fill its parent:

```tsx
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';

function BlurredModal({ visible, hide }: Props) {
  return (
    <Modal
      visible={visible}
      onHide={hide}
      backdrop={
        <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
      }
    >
      …
    </Modal>
  );
}
```

Any element works: a gradient, an image, a view with its own animation.

## No backdrop

`backdrop={false}` (or `{ enabled: false }`) draws none: the screen behind stays visible and nothing closes the modal on a press around it. On top of a native `Modal`, the app behind still does not get touches; with [`coverScreen`](/react-native-reanimated-modal/multiple-modals/) it does — a toast or an alert that leaves the screen usable:

```tsx
<Modal
  visible={visible}
  onHide={hide}
  backdrop={false}
  coverScreen
  style={{ justifyContent: 'flex-end' }}
  animation="slide"
  swipe={{ directions: ['down', 'left', 'right'] }}
>
  …
</Modal>
```

## Pressing the backdrop

`onBackdropPress` decides what a press does:

| `onBackdropPress` | A press on the backdrop                                                  |
| ----------------- | ------------------------------------------------------------------------ |
| not set           | Closes the modal: the animation, then `onHide`                           |
| a function        | Calls it **instead** of closing — close the modal from it if you want to |
| `false`           | Does nothing; the swipe and the back button still close the modal        |

```tsx
// ask first
<Modal
  visible={visible}
  onHide={hide}
  onBackdropPress={() => confirmDiscard().then((ok) => ok && hide())}
>
  …
</Modal>
```

With `closable={false}` a press never closes the modal and `onBackdropPress` is not called.