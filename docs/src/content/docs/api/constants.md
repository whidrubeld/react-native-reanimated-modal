---
title: Constants and helpers
description: The exported defaults — durations, scale factor, swipe threshold and direction, bounce spring, backdrop — and the functions that fill a partial config with them.
---

## Defaults

| Constant                                 | Value                                                                                                                         |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `DEFAULT_MODAL_ANIMATION_DURATION`       | `300`                                                                                                                         |
| `DEFAULT_MODAL_SCALE_FACTOR`             | `0.8`                                                                                                                         |
| `DEFAULT_MODAL_SWIPE_THRESHOLD`          | `100`                                                                                                                         |
| `DEFAULT_MODAL_SWIPE_DIRECTION`          | `'down'`                                                                                                                      |
| `DEFAULT_MODAL_BOUNCE_SPRING_CONFIG`     | `{ dampingRatio: 0.5, duration: 700 }`                                                                                        |
| `DEFAULT_MODAL_BOUNCE_OPACITY_THRESHOLD` | `0.05`                                                                                                                        |
| `DEFAULT_MODAL_BACKDROP_CONFIG`          | `{ enabled: true, color: 'black', opacity: 0.7 }`                                                                             |
| `DEFAULT_MODAL_SWIPE_CONFIG`             | `{ enabled: true, directions: ['down'], threshold: 100, bounceSpringConfig, bounceOpacityThreshold }` — the defaults above    |
| `DEFAULT_MODAL_ANIMATION_CONFIGS`        | `{ fade, slide, scale }`: each preset with `duration: 300`, `slide` with `direction: 'down'`, `scale` with `scaleFactor: 0.8` |

Build on them rather than repeating the numbers:

```tsx
import {
  DEFAULT_MODAL_BACKDROP_CONFIG,
  DEFAULT_MODAL_SWIPE_THRESHOLD,
} from 'react-native-reanimated-modal';

const backdrop = { ...DEFAULT_MODAL_BACKDROP_CONFIG, opacity: 0.9 };
const swipe = { threshold: DEFAULT_MODAL_SWIPE_THRESHOLD * 1.5 };

// <Modal visible={visible} onHide={hide} backdrop={backdrop} swipe={swipe}>
```

## Helpers

The functions the modal fills its props with, for wrappers of your own that need the same resolved values:

| Function                                                   | Returns                                                                                                                 |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `normalizeAnimationConfig(animation?)`                     | A complete `ModalAnimationConfigUnion`: a preset name becomes its default config; a missing `type` is `'fade'`          |
| `normalizeSwipeConfig(swipe?)`                             | A complete `ModalSwipeConfig` — the defaults with yours over them; `false` gives `{ enabled: false }`                   |
| `normalizeBackdropConfig(backdrop?)`                       | `{ enabled, isCustom, config, customRenderer? }`: whether there is one, and whether it is your element                  |
| `getSwipeDirections(swipe, animation?, fallback = 'down')` | The dismissing directions: `swipe.directions` when not empty, else the slide's `direction` (its `end`), else `fallback` |
| `getSlideInDirection(animation, fallback = 'down')`        | The edge a slide comes from: its `direction` (its `start`), else `fallback`                                             |
