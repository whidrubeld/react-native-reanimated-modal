---
title: Swipe to dismiss
description: The swipe prop — directions, the distance that dismisses, the spring back after a short swipe — what it needs to be on, and scrolling content inside a swipeable modal.
---

A modal closes when its content is dragged far enough in an allowed direction: it then leaves the screen that way, the backdrop fading with it. A shorter drag springs it back. By default the direction is `down` and the distance 100 pixels:

```tsx
<Modal
  visible={visible}
  onHide={hide}
  swipe={{ directions: ['down', 'left', 'right'], threshold: 120 }}
>
  …
</Modal>
```

`swipe={false}` turns it off. The swipe is also off when the modal is not `closable` or has no `onHide`.

## Options

| Option                   | Default                                | Description                                                                                                                                      |
| ------------------------ | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `enabled`                | `true`                                 | Whether a swipe can dismiss the modal                                                                                                            |
| `directions`             | `['down']`                             | The directions that dismiss: any of `'up'`, `'down'`, `'left'`, `'right'`                                                                        |
| `threshold`              | `100`                                  | Pixels to drag for the modal to close when released                                                                                              |
| `bounceSpringConfig`     | `{ dampingRatio: 0.5, duration: 700 }` | Reanimated's [spring config](https://docs.swmansion.com/react-native-reanimated/docs/animations/withSpring/) of the way back after a short swipe |
| `bounceOpacityThreshold` | `0.05`                                 | While springing back, the backdrop snaps to its full opacity once it is this close to it                                                         |

The options you pass are merged over the defaults: `{ threshold: 150 }` keeps `directions: ['down']`.

## Directions

A swipe takes the direction it first moves in — horizontal or vertical, whichever is larger — and follows only that axis. A direction not in `directions` does not move the content.

`directions` always wins over the [slide direction](/react-native-reanimated-modal/animations/#slide-direction). The slide's `direction` (or its `end`) decides the swipe only when `directions` is empty:

```tsx
// slides in from the top; swiped up, it leaves the way it came
<Modal
  visible={visible}
  onHide={hide}
  animation={{ type: 'slide', direction: 'up' }}
  swipe={{ directions: [] }}
>
  …
</Modal>

// the same, spelled out
<Modal
  visible={visible}
  onHide={hide}
  animation={{ type: 'slide', direction: 'up' }}
  swipe={{ directions: ['up'] }}
>
  …
</Modal>
```

## While dragging

The content follows the finger at full opacity; the backdrop fades by how far the content has moved compared to the screen's width or height. The [animation worklets](/react-native-reanimated-modal/custom-animations/) get `animationState: 'sliding'`, `offsetX` / `offsetY` and `swipeDirection`, then `'bouncing'` or `'closing'` when it is released.

## Scrolling inside the modal

The swipe is a Gesture Handler pan on the content. Use Gesture Handler's `ScrollView` (or `FlatList`) inside it, and keep the swipe to the axis the list does not scroll along, or only to `down`:

```tsx
import { ScrollView } from 'react-native-gesture-handler';

function ListModal({ visible, hide }: Props) {
  return (
    <Modal
      visible={visible}
      onHide={hide}
      animation="scale"
      swipe={{ directions: ['down'] }}
    >
      <View style={{ maxHeight: '70%', backgroundColor: 'white' }}>
        <ScrollView>…</ScrollView>
      </View>
    </Modal>
  );
}
```

The example app's _Scroll_ modal does this.
