[![downloads](https://img.shields.io/npm/dw/react-native-reanimated-modal.svg)](https://www.npmjs.com/package/react-native-reanimated-modal)
[![npm](https://img.shields.io/npm/v/react-native-reanimated-modal.svg)](https://www.npmjs.com/package/react-native-reanimated-modal)

A lightweight, scalable, flexible, and high-performance modal component.  Based on the vanilla [Modal](https://reactnative.dev/docs/modal) component for maximum compatibility and native feel. Built with [react-native-reanimated](https://github.com/software-mansion/react-native-reanimated/) and [react-native-gesture-handler](https://github.com/software-mansion/react-native-gesture-handler).

<p align="center">
<img src="https://github.com/WhidRubeld/react-native-reanimated-modal/blob/main/.github/images/example.gif?raw=true" width="300" alt="React Native Reanimated Modal Demo" />
</p>


## ✨ Features

- **🚀 Performance**: Built with react-native-reanimated for 60fps animations that run on the UI thread
- **🎨 Smooth Animations**: Supports both fade and slide animations with customizable durations
- **👆 Gesture Support**: Interactive swipe-to-dismiss in any direction (up, down, left, right)
- **🪶 Lightweight**: Minimal dependencies and smaller bundle size compared to alternatives (**13KB**)
- **📱 Native Feel**: Uses React Native's Modal component as foundation for platform consistency
- **🔧 Flexible**: Highly customizable with extensive prop options
- **📚 TypeScript**: Full TypeScript support out of the box
- **🔄 Multi-Modal**: Easy integration with React Navigation and support for multiple overlays

## 📱 Example

**See it in action!** A comprehensive example app with **15 interactive demos** showcasing every feature and use case.

<div align="center">

### 🎮 Try the Example App

<table>
<tr>
<td align="center" width="50%">

**📱 Scan & Play**

<img src="https://github.com/WhidRubeld/react-native-reanimated-modal/blob/main/.github/images/expo-go-qr.svg?raw=true" alt="Expo QR Code" width="200" height="200" />

_Scan with your camera or Expo Go app_

</td>
<td align="center" width="50%">

**🚀 Quick Start**

1. Install [Expo Go](https://expo.dev/client) on your phone
2. Scan the QR code with your camera
3. Open the link in Expo Go
4. Explore 15 interactive examples!

**Or browse the code:**
[**📂 View Example →**](https://github.com/WhidRubeld/react-native-reanimated-modal/tree/main/example)

</td>
</tr>
</table>

## 📦 Installation

```sh
npm install react-native-reanimated-modal
```

```sh
yarn add react-native-reanimated-modal
```

```sh
pnpm add react-native-reanimated-modal
```

```sh
bun add react-native-reanimated-modal
```

### Required Dependencies

This library depends on the following peer dependencies:

1. **[react-native-reanimated](https://github.com/software-mansion/react-native-reanimated)** (>= 3.0.0)
2. **[react-native-gesture-handler](https://github.com/software-mansion/react-native-gesture-handler)** (>= 2.0.0)

> **Note**: Make sure to follow the installation guides for both libraries, as they require additional platform-specific setup steps.

### Important Setup

Make sure to wrap your root App component with `gestureHandlerRootHOC` for gesture handling to work properly:

```tsx
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

const App = () => {
  // Your app content
};

export default gestureHandlerRootHOC(App);
```

## 🚀 Basic Usage

```tsx
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { Modal } from 'react-native-reanimated-modal';

const App = () => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Show Modal" onPress={() => setVisible(true)} />

      <Modal
        visible={visible}
        onHide={() => setVisible(false)}
      >
        <View style={{
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 10,
          margin: 20
        }}>
          <Text>Hello from Modal!</Text>
          <Button title="Close" onPress={() => setVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

export default gestureHandlerRootHOC(App);
```

## 📖 API Documentation


### Test IDs

You can pass custom testID props to key elements for easier testing:

| Prop              | Type     | Default             | Description                                 |
|-------------------|----------|---------------------|---------------------------------------------|
| `backdropTestID`  | `string`   | `'modal-backdrop'`    | testID for the backdrop Pressable            |
| `contentTestID`   | `string`   | `'modal-content'`     | testID for the modal content (Animated.View) |
| `containerTestID` | `string`   | `'modal-container'`   | testID for the root container View           |

These props are optional and help you write robust e2e/unit tests.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | `false` | Controls the visibility of the modal |
| `closable` | `boolean` | `true` | Whether the modal can be closed by user actions (backdrop press, swipe, hardware back). |
| `children` | `ReactNode` | - | Content to render inside the modal |
| `style` | `StyleProp<ViewStyle>` | - | Style for the modal container |
| `contentContainerStyle` | `StyleProp<ViewStyle>` | - | Style for the content wrapper |
| `renderBackdrop` | `() => ReactNode` | - | Custom backdrop renderer. If provided, it will be rendered instead of the default backdrop. Useful for BlurView, gradients, etc. |

#### Animation Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `animation` | `'fade' \| 'slide'` | `'slide'` | Animation type for modal appearance |
| `animationDuration` | `number` | `300` | Duration of the animation in milliseconds |

#### Backdrop Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `hasBackdrop` | `boolean` | `true` | Whether to show backdrop behind modal |
| `backdropColor` | `string` | `'black'` | Color of the backdrop |
| `backdropOpacity` | `number` | `0.7` | Opacity of the backdrop (0-1) |
| `onBackdropPress` | `() => void` | - | Callback when backdrop is pressed |

#### Swipe Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `swipeDirection` | `SwipeDirection \| SwipeDirection[]` | `'down'` | Direction(s) to enable swipe-to-dismiss. When array is provided, the first element determines the initial slide-in direction |
| `swipeThreshold` | `number` | `100` | Distance in pixels to trigger dismiss |
| `swipeEnabled` | `boolean` | `true` | Whether swipe gestures are enabled |

#### Bounce Props

| Prop                     | Type           | Default                                    | Description                                                                                                                                                      |
| ------------------------ | -------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bounceSpringConfig`     | `SpringConfig` | `{ stiffness: 200, dampingRatio: 0.5, duration: 7e2 }` | Spring config for bounce-back animation after failed swipe. Accepts the same shape as Reanimated's spring config.|
| `bounceOpacityThreshold` | `number`       | `0.05` | Threshold for backdrop opacity correction during bounce. If difference between target and current opacity is less than this value, opacity is snapped to target. |

#### Other Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `coverScreen` | `boolean` | `false` | If true, covers entire screen without using native Modal |

#### Event Props

| Prop | Type | Description |
|------|------|-------------|
| `onShow` | `() => void` | Called when modal appears |
| `onHide` | `() => void` | Called when modal disappears |

#### React Native Modal Props

The component also accepts these props from React Native's Modal:

- `hardwareAccelerated` (Android)
- `navigationBarTranslucent` (Android)
- `statusBarTranslucent` (Android)
- `onOrientationChange` (iOS)
- `supportedOrientations` (iOS)

### Types

```tsx
type SwipeDirection = 'up' | 'down' | 'left' | 'right';
type ModalAnimation = 'fade' | 'slide';
```

## 🔄 React Navigation support

When using multiple modals simultaneously with `@react-navigation/native-stack`, you can leverage iOS's `FullWindowOverlay` for better layering:

```tsx
import React from 'react';
import { Platform } from 'react-native';
import { FullWindowOverlay } from 'react-native-screens';
import { Modal } from 'react-native-reanimated-modal';

const isIOS = Platform.OS === 'ios';

const withOverlay = (element: React.ReactNode) =>
  isIOS ? <FullWindowOverlay>{element}</FullWindowOverlay> : element;

const MultiModalExample = () => {
  const [firstModalVisible, setFirstModalVisible] = useState(false);
  const [secondModalVisible, setSecondModalVisible] = useState(false);

  return withOverlay(
    <>
      <Modal
        visible={firstModalVisible}
        coverScreen // Important: excludes native Modal usage
        onBackdropPress={() => setFirstModalVisible(false)}
      >
        {/* First modal content */}
      </Modal>

      <Modal
        visible={secondModalVisible}
        coverScreen // Important: excludes native Modal usage
        onBackdropPress={() => setSecondModalVisible(false)}
      >
        {/* Second modal content */}
      </Modal>
    </>
  );
};
```

> **Important**: When using multiple modals with `FullWindowOverlay`, always set `coverScreen={true}` prop to exclude the usage of React Native's native Modal component and ensure proper layering.

## 🎨 Advanced Examples

### Custom Animation with Swipe Directions

```tsx
<Modal
  visible={visible}
  animation="slide"
  animationDuration={500}
  swipeDirection={['down', 'right']} // Modal slides in from bottom, can be dismissed by swiping down or right
  swipeThreshold={150}
  onBackdropPress={() => setVisible(false)}
>
  <YourContent />
</Modal>
```

> **Note**: When using an array for `swipeDirection`, the first element (`'down'` in this example) determines the initial slide-in animation direction, while all elements in the array define the available swipe-to-dismiss directions.

### Full Screen Modal

```tsx
<Modal
  visible={visible}
  contentContainerStyle={{ flex: 1 }}
>
  <YourFullScreenContent />
</Modal>
```

## 🤝 Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## 📄 License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
