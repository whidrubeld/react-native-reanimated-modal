---
title: Types
description: The exported TypeScript types — animation presets and their configs, the worklet signature and animation states, swipe and backdrop configs, ModalRef.
---

Everything below is exported from `react-native-reanimated-modal` as a type. The type declarations in your `node_modules` document the version you installed: `lib/typescript/src/types.d.ts`.

## Names

```ts
type ModalAnimation = 'fade' | 'slide' | 'scale' | 'custom';
type SwipeDirection = 'up' | 'down' | 'left' | 'right';
type ModalAnimationState = 'opening' | 'sliding' | 'bouncing' | 'closing';
```

| `ModalAnimationState` | When                                                                           |
| --------------------- | ------------------------------------------------------------------------------ |
| `'opening'`           | The opening animation: `progress` 0 → 1                                        |
| `'closing'`           | The closing animation (`progress` 1 → 0), or the content leaving after a swipe |
| `'sliding'`           | The user is dragging the content                                               |
| `'bouncing'`          | The content springs back after a swipe too short to close                      |

## Animation configs

```ts
// shared by every preset (not exported itself)
interface BaseAnimationConfig {
  duration?: number; // ms, default 300
  contentAnimatedStyle?: ModalAnimatedStyleFunction;
  backdropAnimatedStyle?: ModalAnimatedStyleFunction;
}

interface FadeAnimationConfig extends BaseAnimationConfig {
  type: 'fade';
}

interface SlideAnimationConfig extends BaseAnimationConfig {
  type: 'slide';
  direction?: // default 'down'
    | SwipeDirection
    | { start: SwipeDirection; end: SwipeDirection | SwipeDirection[] };
}

interface ScaleAnimationConfig extends BaseAnimationConfig {
  type: 'scale';
  scaleFactor?: number; // 0–1, default 0.8
}

interface CustomAnimationConfig extends BaseAnimationConfig {
  type: 'custom';
}

type ModalAnimationConfigUnion =
  | FadeAnimationConfig
  | SlideAnimationConfig
  | ScaleAnimationConfig
  | CustomAnimationConfig;

// the config of one preset: ModalAnimationConfig<'slide'> is SlideAnimationConfig
type ModalAnimationConfig<T extends ModalAnimation> = /* … */;
```

[Animations](/react-native-reanimated-modal/animations/)

## `ModalAnimatedStyleFunction`

The signature of `contentAnimatedStyle` and `backdropAnimatedStyle` — a worklet:

```ts
type ModalAnimatedStyleFunction = (props: {
  animationState: ModalAnimationState | null;
  swipeDirection?: SwipeDirection | null; // while swiped
  progress: number; // 0 closed → 1 open
  offsetX: number; // px, while swiped
  offsetY: number; // px, while swiped
  screenWidth: number;
  screenHeight: number;
}) => ViewStyle;
```

[Custom animations](/react-native-reanimated-modal/custom-animations/)

## `ModalSwipeConfig`

```ts
interface ModalSwipeConfig {
  enabled?: boolean; // default true
  directions?: SwipeDirection[]; // default ['down']
  threshold?: number; // px, default 100
  bounceSpringConfig?: SpringConfig; // Reanimated's, default { dampingRatio: 0.5, duration: 700 }
  bounceOpacityThreshold?: number; // default 0.05
}
```

[Swipe to dismiss](/react-native-reanimated-modal/swipe/)

## `ModalBackdropConfig`

```ts
interface ModalBackdropConfig {
  enabled?: boolean; // default true
  color?: string; // default 'black'
  opacity?: number; // 0–1, default 0.7
}
```

[Backdrop](/react-native-reanimated-modal/backdrop/)

## `ModalRef` and `ModalProps`

`ModalRef` is the ref's handle, `{ open(): void; close(): void }`; `ModalProps` the component's props. Both are in the [`Modal` reference](/react-native-reanimated-modal/api/modal/).
