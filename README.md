[![downloads](https://img.shields.io/npm/dw/react-native-reanimated-modal.svg)](https://www.npmjs.com/package/react-native-reanimated-modal)
[![npm](https://img.shields.io/npm/v/react-native-reanimated-modal.svg)](https://www.npmjs.com/package/react-native-reanimated-modal)

# react-native-reanimated-modal

A lightweight and scalable alternative to [react-native-modal](https://github.com/react-native-modal/react-native-modal), built with [react-native-reanimated](https://github.com/software-mansion/react-native-reanimated/) and [react-native-gesture-handler](https://github.com/software-mansion/react-native-gesture-handler). Based on React Native's vanilla Modal component, this library is designed for smooth animations, flexibility, and minimal footprint.

<p align="center">
<img src="/.github/images/example.gif" width="300" alt="React Native Reanimated Modal Demo" />
</p>


## ✨ Features

- **🚀 Performance**: Built with react-native-reanimated for 60fps animations that run on the UI thread
- **🎨 Smooth Animations**: Supports both fade and slide animations with customizable durations
- **👆 Gesture Support**: Interactive swipe-to-dismiss in any direction (up, down, left, right)
- **🪶 Lightweight**: Minimal dependencies and smaller bundle size compared to alternatives (12kb)
- **📱 Native Feel**: Uses React Native's Modal component as foundation for platform consistency
- **🔧 Flexible**: Highly customizable with extensive prop options
- **📚 TypeScript**: Full TypeScript support out of the box
- **🔄 Multi-Modal**: Easy integration with React Navigation and support for multiple overlays

## 📦 Installation

```sh
npm install react-native-reanimated-modal
```

or

```sh
yarn add react-native-reanimated-modal
```

### Required Dependencies

This library depends on the following peer dependencies:

1. **[react-native-reanimated](https://github.com/software-mansion/react-native-reanimated)** (>= 3.0.0)
   ```sh
   npm install react-native-reanimated
   ```

2. **[react-native-gesture-handler](https://github.com/software-mansion/react-native-gesture-handler)** (>= 2.0.0)
   ```sh
   npm install react-native-gesture-handler
   ```

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
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Show Modal" onPress={() => setIsVisible(true)} />

      <Modal
        isVisible={isVisible}
        swipeDirection="down"
        onHide={() => setIsVisible(false)}
      >
        <View style={{
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 10,
          margin: 20
        }}>
          <Text>Hello from Modal!</Text>
          <Button title="Close" onPress={() => setIsVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

export default gestureHandlerRootHOC(App);
```

## 📖 API Documentation

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isVisible` | `boolean` | `false` | Controls the visibility of the modal |
| `children` | `React.ReactNode` | - | Content to render inside the modal |
| `style` | `StyleProp<ViewStyle>` | - | Style for the modal container |
| `contentContainerStyle` | `StyleProp<ViewStyle>` | - | Style for the content wrapper |

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

#### Other Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `coverScreen` | `boolean` | `false` | If true, covers entire screen without using native Modal |

#### Event Props

| Prop | Type | Description |
|------|------|-------------|
| `onShow` | `() => void` | Called when modal appears |
| `onHide` | `() => void` | Called when modal disappears |
| `onRequestClose` | `() => void` | Called when modal requests to close (Android back button, etc.) |

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

## 🔄 Multi-Modal Integration with React Navigation

When using multiple modals simultaneously with React Navigation Native Stack, you can leverage iOS's `FullWindowOverlay` for better layering:

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
        isVisible={firstModalVisible}
        coverScreen // Important: excludes native Modal usage
        onBackdropPress={() => setFirstModalVisible(false)}
      >
        {/* First modal content */}
      </Modal>

      <Modal
        isVisible={secondModalVisible}
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
  isVisible={isVisible}
  animation="slide"
  animationDuration={500}
  swipeDirection={['down', 'right']} // Modal slides in from bottom, can be dismissed by swiping down or right
  swipeThreshold={150}
  onBackdropPress={() => setIsVisible(false)}
>
  <YourContent />
</Modal>
```

> **Note**: When using an array for `swipeDirection`, the first element (`'down'` in this example) determines the initial slide-in animation direction, while all elements in the array define the available swipe-to-dismiss directions.

### Full Screen Modal

```tsx
<Modal
  isVisible={isVisible}
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
