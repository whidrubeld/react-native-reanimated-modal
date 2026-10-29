# Example app

> The Expo example app — open it on your phone with Expo Go from its QR code, or run it from the repository — and the use cases it shows, from a bottom sheet to stacked modals.

The repository’s [`example/`](https://github.com/whidrubeld/react-native-reanimated-modal/tree/master/example) is an Expo app with a modal for every use case below.

## On your phone

![QR code of the example app's EAS Update](/react-native-reanimated-modal/images/eas-update.svg)

1. Install [Expo Go](https://expo.dev/go).
2. Scan the QR code with the camera (iOS) or from Expo Go (Android).
3. The example opens in Expo Go.

## From the repository

```bash
pnpm install
pnpm example start     # Metro; then press i, a or w
pnpm example ios       # or: android, web
```

The app uses the library’s source (`src/`) through Metro: changes show up without a build. More in [CONTRIBUTING.md](https://github.com/whidrubeld/react-native-reanimated-modal/blob/master/CONTRIBUTING.md).

## Use cases

| Modal       | Shows                                                                                   | Source                                                                                                                           |
| ----------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Basic       | The defaults: fade, backdrop, swipe down                                                | [`Basic.tsx`](https://github.com/whidrubeld/react-native-reanimated-modal/blob/master/example/src/use-cases/Basic.tsx)           |
| Multiple    | Two `coverScreen` modals stacked, sliding from different edges, swiped in any direction | [`Multiple.tsx`](https://github.com/whidrubeld/react-native-reanimated-modal/blob/master/example/src/use-cases/Multiple.tsx)     |
| Input       | A text field over the keyboard (`react-native-keyboard-controller`)                     | [`Input.tsx`](https://github.com/whidrubeld/react-native-reanimated-modal/blob/master/example/src/use-cases/Input.tsx)           |
| Scroll      | A scrolling list in a `scale` modal swiped down                                         | [`Scroll.tsx`](https://github.com/whidrubeld/react-native-reanimated-modal/blob/master/example/src/use-cases/Scroll.tsx)         |
| Blur        | An `expo-blur` backdrop                                                                 | [`Blur.tsx`](https://github.com/whidrubeld/react-native-reanimated-modal/blob/master/example/src/use-cases/Blur.tsx)             |
| Fullscreen  | `contentContainerStyle={{ flex: 1 }}`, sliding                                          | [`Fullscreen.tsx`](https://github.com/whidrubeld/react-native-reanimated-modal/blob/master/example/src/use-cases/Fullscreen.tsx) |
| Alert       | A toast without backdrop over a usable screen, dismissed by a swipe or a timer          | [`Alert.tsx`](https://github.com/whidrubeld/react-native-reanimated-modal/blob/master/example/src/use-cases/Alert.tsx)           |
| Bottom half | A bottom sheet: `justifyContent: 'flex-end'`, a slide, a longer swipe threshold         | [`BottomHalf.tsx`](https://github.com/whidrubeld/react-native-reanimated-modal/blob/master/example/src/use-cases/BottomHalf.tsx) |