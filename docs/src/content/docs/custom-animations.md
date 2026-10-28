---
title: Custom animations
description: Worklets for the content and the backdrop — what they receive (state, progress, swipe offsets, screen size), how their style merges with a preset's, and the custom type that has none.
---

Every animation config takes two optional worklets, `contentAnimatedStyle` and `backdropAnimatedStyle`. They run on the UI thread on every frame of the animation and of a swipe, and return a style that is merged into the preset's:

```tsx
<Modal
  visible={visible}
  onHide={hide}
  animation={{
    type: 'fade',
    duration: 600,
    contentAnimatedStyle: ({ progress }) => {
      'worklet';
      // a wobble on top of the fade
      return {
        transform: [{ scale: 1 + Math.sin(progress * Math.PI * 2) * 0.1 }],
      };
    },
  }}
>
  …
</Modal>
```

Start each function with the `'worklet'` directive. It runs on the UI thread: use only its arguments, shared values and other worklets — no React state, no JavaScript functions without `scheduleOnRN`.

## What they receive

| Argument         | Type                          | Meaning                                                                                                  |
| ---------------- | ----------------------------- | -------------------------------------------------------------------------------------------------------- |
| `animationState` | `ModalAnimationState \| null` | `'opening'`, `'closing'`, `'sliding'` (a swipe), `'bouncing'` (back after a short swipe), `null` at rest |
| `progress`       | `number`                      | `0` closed → `1` open; moves while opening and closing                                                   |
| `offsetX`        | `number`                      | The content's horizontal offset in pixels while swiped (and while it leaves after a swipe)               |
| `offsetY`        | `number`                      | The same, vertical                                                                                       |
| `swipeDirection` | `SwipeDirection \| null`      | The direction of the current swipe, once it is known                                                     |
| `screenWidth`    | `number`                      | The window's width                                                                                       |
| `screenHeight`   | `number`                      | The window's height                                                                                      |

A swipe that dismisses the modal switches the state to `'closing'` but leaves `progress` at `1`: the content leaves along `offsetX` / `offsetY`, then the modal hides.

## How the styles merge

Your style is spread over the preset's, so a key you return replaces the preset's value — `opacity`, for instance. `transform` is the exception: your transforms are **appended** to the preset's (a slide's `translateX`/`translateY`, a scale's `scale`), so a `rotate` adds to the slide instead of cancelling it.

For the backdrop, the preset's style is its `opacity`; return `backgroundColor` to tint it as it fades:

```tsx
animation={{
  type: 'slide',
  direction: 'down',
  contentAnimatedStyle: ({ progress }) => {
    'worklet';
    return { transform: [{ rotate: `${(1 - progress) * 15}deg` }] };
  },
  backdropAnimatedStyle: ({ progress }) => {
    'worklet';
    return { backgroundColor: `rgba(20, 0, 60, ${progress * 0.6})` };
  },
}}
```

## The `custom` type

`type: 'custom'` has no preset motion — the content only fades with `progress` — and is meant for a `contentAnimatedStyle` that does the rest, the swipe included:

```tsx
animation={{
  type: 'custom',
  duration: 800,
  contentAnimatedStyle: ({ animationState, progress, offsetX, offsetY }) => {
    'worklet';
    if (animationState === 'sliding' || animationState === 'bouncing') {
      const pulled = Math.min(1, Math.hypot(offsetX, offsetY) / 300);
      return { opacity: 1 - pulled * 0.5, transform: [{ scale: 1 - pulled * 0.2 }] };
    }
    return {
      opacity: progress,
      transform: [{ perspective: 800 }, { rotateY: `${(1 - progress) * 90}deg` }],
    };
  },
}}
```

While swiped, every preset — `custom` included — already moves the content by `offsetX` / `offsetY`; your transforms come after those.

## Reusing the defaults

The defaults are exported, for configs built on them:

```tsx
import {
  DEFAULT_MODAL_ANIMATION_DURATION,
  DEFAULT_MODAL_SCALE_FACTOR,
  type ModalAnimationConfig,
} from 'react-native-reanimated-modal';

const slowPop: ModalAnimationConfig<'scale'> = {
  type: 'scale',
  duration: DEFAULT_MODAL_ANIMATION_DURATION * 2,
  scaleFactor: DEFAULT_MODAL_SCALE_FACTOR,
};
```

All of them: [Constants and helpers](/react-native-reanimated-modal/api/constants/).
