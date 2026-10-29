# Animations

> The fade, slide and scale presets — as a string or a typed config with its duration, slide direction and scale factor — and layouts built on them, a bottom sheet and a full-screen modal.

The `animation` prop picks how the modal comes in and goes out. A string takes a preset with its defaults; an object sets its options:

```tsx
<Modal visible={visible} onHide={hide} animation="scale">…</Modal>

<Modal
  visible={visible}
  onHide={hide}
  animation={{ type: 'scale', duration: 400, scaleFactor: 0.9 }}
>
  …
</Modal>
```

Without `animation`, the modal fades in 300 ms. Opening eases out, closing eases in, both over the same `duration`; the backdrop fades with the content whatever the preset.

## Presets

| `type`   | Content                                                                               | Options                                                |
| -------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `fade`   | Opacity 0 → 1                                                                         | `duration` (`300`)                                     |
| `slide`  | Moves in from beyond an edge of the screen, fully opaque                              | `duration` (`300`), `direction` (`'down'`)             |
| `scale`  | Grows from `scaleFactor` to its size while fading in                                  | `duration` (`300`), `scaleFactor` (`0.8`, from 0 to 1) |
| `custom` | Opacity only — the rest is [yours](/react-native-reanimated-modal/custom-animations/) | `duration` (`300`), `contentAnimatedStyle`             |

Every preset also takes `contentAnimatedStyle` and `backdropAnimatedStyle`, worklets that add to its styles: [Custom animations](/react-native-reanimated-modal/custom-animations/).

## Slide direction

`direction` is the edge the content comes from — `'down'` is the bottom of the screen — and the one it leaves through when closed:

```tsx
<Modal
  visible={visible}
  onHide={hide}
  animation={{ type: 'slide', direction: 'up' }}
>
  …
</Modal>
```

It also takes `{ start, end }`: `start` is the edge it comes from, `end` one or more directions meant for swipe to dismiss:

```tsx
animation={{
  type: 'slide',
  duration: 500,
  direction: { start: 'down', end: ['down', 'right'] },
}}
```

> **Caution**
>
> The swipe directions are set by the `swipe` prop, and it has `['down']` by default: `direction` (and its `end`) only decide them when you pass `swipe={{ directions: [] }}`. To dismiss a modal sliding from the top with a swipe up, set `swipe={{ directions: ['up'] }}` — see [Swipe to dismiss](/react-native-reanimated-modal/swipe/#directions).

## Typed configs

Each preset’s config has its own type; `ModalAnimationConfig<'slide'>` and the others check the options of that preset:

```tsx
import type { ModalAnimationConfig } from 'react-native-reanimated-modal';

const sheet: ModalAnimationConfig<'slide'> = {
  type: 'slide',
  duration: 500,
  direction: 'down',
};

const pop: ModalAnimationConfig<'scale'> = {
  type: 'scale',
  duration: 250,
  scaleFactor: 0.6,
};
```

Define configs outside the component, or memoize them: the modal recomputes its setup when `animation` changes identity.

## A bottom sheet

`style` is the full-screen container the content is laid out in — move the content to its bottom, and slide it from there:

```tsx
<Modal
  visible={visible}
  onHide={hide}
  style={{ justifyContent: 'flex-end' }}
  animation={{ type: 'slide', duration: 500 }}
  swipe={{ directions: ['down'], threshold: 150 }}
  statusBarTranslucent
>
  <View
    style={{
      padding: 30,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      backgroundColor: 'white',
    }}
  >
    …
  </View>
</Modal>
```

Add the bottom safe area inset to its padding (`useSafeAreaInsets` from `react-native-safe-area-context`).

## A full-screen sheet

`contentContainerStyle` styles the animated wrapper of your content: `flex: 1` makes it fill the screen. A full-screen modal usually needs no backdrop:

```tsx
<Modal
  visible={visible}
  onHide={hide}
  contentContainerStyle={{ flex: 1 }}
  animation={{ type: 'slide', direction: 'down' }}
  swipe={{ directions: ['down'], threshold: 80 }}
  backdrop={false}
  statusBarTranslucent
>
  <View style={{ flex: 1, backgroundColor: 'white' }}>…</View>
</Modal>
```