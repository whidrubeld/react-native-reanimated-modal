# Platforms

> The Android back button and onBackButtonPress, closable, the native Modal props passed through (status and navigation bars, hardware acceleration, iOS orientations), and the web.

## Android back button

While the modal is open, the hardware back button closes it, like a backdrop press. `onBackButtonPress` replaces that — ask before discarding a form, go back a step inside the modal, or ignore the press:

```tsx
<Modal
  visible={visible}
  onHide={hide}
  onBackButtonPress={() => {
    if (step > 0) setStep(step - 1);
    else hide();
  }}
>
  …
</Modal>
```

The handler is called on Android only, whether or not the modal is `closable`; to keep a modal open on a back press, pass one that does nothing. On iOS there is no back button, and on the web the modal does not listen for one.

## Closable

`closable={false}` turns off what the user can close the modal with — the backdrop press and the swipe — for a modal that closes only when you set `visible` to `false`: a required choice, a blocking progress screen. On Android, give it an `onBackButtonPress` as well, so that the back button cannot close it either:

```tsx
<Modal visible={saving} closable={false} onBackButtonPress={() => {}}>
  <ActivityIndicator />
</Modal>
```

## Native `Modal` props

These are passed to React Native’s [`Modal`](https://reactnative.dev/docs/modal) (and ignored with [`coverScreen`](/react-native-reanimated-modal/multiple-modals/), which does not use one):

| Prop                       | Platform | Description                                                             |
| -------------------------- | -------- | ----------------------------------------------------------------------- |
| `statusBarTranslucent`     | Android  | Draws the modal under the status bar — a backdrop over the whole screen |
| `navigationBarTranslucent` | Android  | Draws it under the navigation bar too (with `statusBarTranslucent`)     |
| `hardwareAccelerated`      | Android  | Forces hardware acceleration for the modal’s window                     |
| `supportedOrientations`    | iOS      | The orientations the modal can rotate to                                |
| `onOrientationChange`      | iOS      | Called when the orientation changes while the modal is shown            |

The modal measures the window (`useWindowDimensions`), so slide distances and swipe fades follow rotations and split screens.

On Android, set `statusBarTranslucent` for a backdrop that covers the status bar, and change the status bar’s style from inside the modal (`expo-status-bar`’s `<StatusBar style="light" />` among its children) if the backdrop needs it.

## Web

The modal runs on [React Native Web](https://necolas.github.io/react-native-web/) — the example app is built for it in CI. There, React Native Web’s `Modal` is a layer in the page, and the back button is not handled.