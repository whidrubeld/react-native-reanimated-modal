# <span class="hero-logo" aria-hidden="true"><svg viewBox="0 0 15 11" shape-rendering="crispEdges"><path fill="currentColor" d="M0 0h15v1h-15zM0 10h15v1h-15zM0 1h1v9h-1zM14 1h1v9h-1zM3 4h9v1h-9zM3 5h1v3h-1zM11 5h1v3h-1zM3 8h9v1h-9zM6 6h3v1h-3z"/></svg></span>react-native-reanimated-modal

> A lightweight, performant modal for React Native — fade, slide, scale or your own animations on the UI thread, swipe to dismiss in any direction, on top of the native Modal.

A lightweight, performant modal for React Native — animations on the UI thread, swipe to dismiss in any direction, on top of the native Modal.

- [Get started](/react-native-reanimated-modal/getting-started/)
- [Example app](/react-native-reanimated-modal/example/)
- [GitHub](https://github.com/whidrubeld/react-native-reanimated-modal)

![The example app: modals fading, sliding and scaling in, dismissed with a swipe, over a dimmed and a blurred backdrop](/react-native-reanimated-modal/images/example.gif)

Fig. 01The example app

A modal built on React Native’s own [`Modal`](https://reactnative.dev/docs/modal) — so it behaves like one on every platform — with its animations and gestures in [Reanimated](https://docs.swmansion.com/react-native-reanimated/) and [Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/): they run on the UI thread, and stay smooth while JavaScript is busy.

```bash
npm install react-native-reanimated-modal
```

## Features

* **[Animations](/react-native-reanimated-modal/animations/)**

  `fade`, `slide` from any edge and `scale`, each with its duration — as a string, or a typed config.

* **[Your own animations](/react-native-reanimated-modal/custom-animations/)**

  Worklets for the content and the backdrop get the progress, the swipe offset and the state, and return a style: on top of a preset, or as `custom` on their own.

* **[Swipe to dismiss](/react-native-reanimated-modal/swipe/)**

  In one direction or all four, with a distance to reach, and a spring back when it is not reached; the backdrop fades as the content goes.

* **[Backdrop](/react-native-reanimated-modal/backdrop/)**

  A color and an opacity, your own component (a blur), or none; a press closes the modal, or calls your handler, or does nothing.

* **[Declarative or imperative](/react-native-reanimated-modal/ref/)**

  `visible` and `onHide` like any modal, or `ref.current.open()` / `close()` when the modal is mounted visible.

* **[Several at once](/react-native-reanimated-modal/multiple-modals/)**

  `coverScreen` draws the modal in your tree instead of a native window: modals stack, and sit in a `FullWindowOverlay` above React Navigation’s screens.

* **[Native behaviour](/react-native-reanimated-modal/platforms/)**

  The Android back button (or your handler for it), translucent status and navigation bars, iOS orientations — the native `Modal`’s props, passed through.

* **[Testable](/react-native-reanimated-modal/testing/)**

  Test IDs for the container, the backdrop and the content; works with Jest and React Native Testing Library.

* **Small**

  One component in TypeScript, no dependencies of its own: Reanimated, Worklets and Gesture Handler are peers.

## For AI assistants

Every page is also Markdown: add `.md` to its URL, or use **Copy page** above its title. [`llms.txt`](/react-native-reanimated-modal/llms.txt) lists them, [`llms-full.txt`](/react-native-reanimated-modal/llms-full.txt) is all of them in one file — [LLMs](/react-native-reanimated-modal/llms/).