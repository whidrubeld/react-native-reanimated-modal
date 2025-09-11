[![documentation](https://img.shields.io/badge/documentation-blue.svg)](https://whidrubeld.github.io/react-native-reanimated-modal/)
[![npm bundle size](https://img.shields.io/bundlephobia/min/react-native-reanimated-modal)](https://www.npmjs.com/package/react-native-reanimated-modal)

A lightweight, scalable, flexible, and high-performance modal component.  Based on the vanilla [Modal](https://reactnative.dev/docs/modal) component for maximum compatibility and native feel. Built with [react-native-reanimated](https://github.com/software-mansion/react-native-reanimated/) and [react-native-gesture-handler](https://github.com/software-mansion/react-native-gesture-handler).

<img src="https://github.com/whidrubeld/react-native-reanimated-modal/blob/main/.github/images/example.gif?raw=true" width="100%" style="max-width: 500px; height: auto;" alt="React Native Reanimated Modal Demo" />

## ✨ Features

- **🚀 Performance**: Built with react-native-reanimated for 60fps animations that run on the UI thread
- **🎨 Smooth Animations**: Supports fade, slide, and scale animations with customizable configs
- **👆 Gesture Support**: Interactive swipe-to-dismiss in any direction (up, down, left, right)
- **🪶 Lightweight**: Minimal dependencies and smaller bundle size compared to alternatives
- **📱 Native Feel**: Uses React Native's Modal component as foundation for platform consistency
- **🔧 Flexible**: Highly customizable with extensive prop options
- **📚 TypeScript**: Full TypeScript support out of the box
- **🔄 Multi-Modal**: Easy integration with React Navigation and support for multiple overlays


## 🎮 Example

<img src="https://github.com/whidrubeld/react-native-reanimated-modal/blob/main/.github/images/eas-update.svg?raw=true" alt="Expo QR Code" width="200" height="200" />

1. Install [Expo Go](https://expo.dev/client) on your phone
2. Scan the QR code with your camera
3. Open the link in Expo Go
4. Explore example app!

**Or browse the code**: [**📂 View Example Code →**](https://github.com/whidrubeld/react-native-reanimated-modal/tree/main/example)

## 📚 Documentation

**Full API and usage documentation**: [**🗂️ View Documentation →**](https://whidrubeld.github.io/react-native-reanimated-modal/)
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

## 🚀 Basic Usage

```tsx
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { Modal } from 'react-native-reanimated-modal';

const App = () => {
  const [visible, setVisible] = useState(false);

  return (
    <GestureHandlerRootView>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button title="Show Modal" onPress={() => setVisible(true)} />

        <Modal visible={visible} onHide={() => setVisible(false)}>
          <View style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 10,
            margin: 20,
          }}>
            <Text>Hello from Modal!</Text>
            <Button title="Close" onPress={() => setVisible(false)} />
          </View>
        </Modal>
      </View>
    </GestureHandlerRootView>
  );
};
```

## 📖 API Documentation

### New Configuration-Based API (Recommended)

Starting from v1.1.0, we recommend using the new configuration-based API for better type safety and cleaner code:

#### Animation Configurations

```tsx
import type { ModalAnimationConfig } from 'react-native-reanimated-modal';

// Scale animation with custom settings
const scaleConfig: ModalAnimationConfig<'scale'> = {
  type: 'scale',
  duration: 400,
  scaleFactor: 0.8, // Start from 80% size
};

// Fade animation
const fadeConfig: ModalAnimationConfig<'fade'> = {
  type: 'fade',
  duration: 300,
};

// Slide animation with complex directions
const slideConfig: ModalAnimationConfig<'slide'> = {
  type: 'slide',
  duration: 500,
  direction: {
    start: 'down',        // Slides in from bottom
    end: ['down', 'right'], // Can dismiss by swiping down or right
  },
};

// Simple slide animation
const simpleSlideConfig: ModalAnimationConfig<'slide'> = {
  type: 'slide',
  duration: 400,
  direction: 'up', // Both slide-in and dismiss direction
};
```

#### Swipe Configurations

```tsx
import type { ModalSwipeConfig } from 'react-native-reanimated-modal';

// Basic swipe config
const basicSwipe: ModalSwipeConfig = {
  enabled: true,
  directions: ['down', 'left', 'right'], // Allow swiping in these directions
  threshold: 120,
};

// Advanced swipe config with custom bounce
const advancedSwipe: ModalSwipeConfig = {
  enabled: true,
  directions: ['up', 'down'], // Only vertical swipes
  threshold: 80,
  bounceSpringConfig: {
    dampingRatio: 0.7,
    duration: 400,
  },
  bounceOpacityThreshold: 0.1,
};

// Disabled swipe
const noSwipe: ModalSwipeConfig = {
  enabled: false,
};
```

#### Usage Examples

```tsx
<Modal
  visible={visible}
  animation={scaleConfig}
  swipe={advancedSwipe}
>
  {/* Your content */}
</Modal>

// Or with inline configs
<Modal
  visible={visible}
  animation={{
    type: 'scale',
    duration: 600,
    scaleFactor: 0.9,
  }}
  swipe={{
    enabled: true,
    threshold: 100,
  }}
>
  {/* Your content */}
</Modal>

// Backdrop examples
<Modal
  visible={visible}
  onBackdropPress={false} // Prevent backdrop from closing modal
  onHide={() => setVisible(false)} // Only programmatic close allowed
>
  {/* Your content */}
</Modal>

<Modal
  visible={visible}
  backdrop={{ color: 'red', opacity: 0.8 }} // Custom backdrop styling
  onBackdropPress={() => console.log('Backdrop pressed!')} // Custom handler
>
  {/* Your content */}
</Modal>

// Legacy string syntax still supported
<Modal
  visible={visible}
  animation="fade" // Equivalent to { type: 'fade', duration: 300 }
>
  {/* Your content */}
</Modal>
```

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
| `closable` | `boolean` | `true` | Whether the modal can be closed by user actions |
| `children` | `ReactNode` | - | Content to render inside the modal |
| `style` | `StyleProp<ViewStyle>` | - | Style for the modal container |
| `contentContainerStyle` | `StyleProp<ViewStyle>` | - | Style for the content wrapper |

#### Configuration Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `animation` | `ModalAnimationConfigUnion \| ModalAnimation` | `{ type: 'fade', duration: 300 }` | Animation configuration object or simple animation type string |
| `swipe` | `ModalSwipeConfig \| false` | `{ enabled: true, directions: ['down'], threshold: 100 }` | Swipe gesture configuration |

#### Backdrop Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `backdrop` | `ModalBackdropConfig \| ReactNode \| false` | `{ enabled: true, color: 'black', opacity: 0.7 }` | Backdrop configuration: false (no backdrop), ReactNode for custom backdrop, or config object |
| `onBackdropPress` | `(() => void) \| false` | - | Callback when backdrop is pressed. Set to `false` to prevent backdrop from closing the modal |

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

### Constants

The library exports several useful constants for customization:

```tsx
import {
  DEFAULT_MODAL_ANIMATION_DURATION,    // 300
  DEFAULT_MODAL_SCALE_FACTOR,          // 0.8
  DEFAULT_MODAL_BACKDROP_CONFIG,       // { enabled: true, color: 'black', opacity: 0.7 }
  DEFAULT_MODAL_SWIPE_THRESHOLD,       // 100
  DEFAULT_MODAL_BOUNCE_SPRING_CONFIG,  // { dampingRatio: 0.5, duration: 700 }
  DEFAULT_MODAL_BOUNCE_OPACITY_THRESHOLD, // 0.05
  DEFAULT_MODAL_SWIPE_DIRECTION, // 'down'
} from 'react-native-reanimated-modal';

// Use in your custom configurations
const customAnimationConfig = {
  type: 'scale',
  duration: DEFAULT_MODAL_ANIMATION_DURATION * 2, // 600ms
  scaleFactor: DEFAULT_MODAL_SCALE_FACTOR,         // 0.8
};

const customBackdropConfig = {
  ...DEFAULT_MODAL_BACKDROP_CONFIG,
  color: 'rgba(0, 0, 0, 0.8)', // Darker backdrop
  opacity: 0.9,
};
```

### Types

```tsx
type SwipeDirection = 'up' | 'down' | 'left' | 'right';
type ModalAnimation = 'fade' | 'slide' | 'scale';

// New Configuration Types
type ModalAnimationConfig<T extends ModalAnimation> =
  T extends 'fade' ? FadeAnimationConfig :
  T extends 'slide' ? SlideAnimationConfig :
  T extends 'scale' ? ScaleAnimationConfig : never;

interface FadeAnimationConfig {
  type: 'fade';
  duration?: number;
}

interface SlideAnimationConfig {
  type: 'slide';
  duration?: number;
  direction?: SwipeDirection | {
    start: SwipeDirection;
    end: SwipeDirection | SwipeDirection[]; // swipe enabled for this directions (low priority)
  };
}

interface ScaleAnimationConfig {
  type: 'scale';
  duration?: number;
  scaleFactor?: number; // 0-1, default: 0.8
}

interface ModalSwipeConfig {
  enabled?: boolean;
  directions?: SwipeDirection[], // swipe enabled for this directions (high priority)
  threshold?: number;
  bounceSpringConfig?: SpringConfig;
  bounceOpacityThreshold?: number;
}

interface ModalBackdropConfig {
  enabled?: boolean;
  color?: string;
  opacity?: number;
}

type ModalAnimationConfigUnion =
  | FadeAnimationConfig
  | SlideAnimationConfig
  | ScaleAnimationConfig;
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
        onHide={() => setFirstModalVisible(false)}
      >
        {/* First modal content */}
      </Modal>

      <Modal
        visible={secondModalVisible}
        coverScreen // Important: excludes native Modal usage
        onHide={() => setSecondModalVisible(false)}
      >
        {/* Second modal content */}
      </Modal>
    </>
  );
};
```

> **Important**: When using multiple modals with `FullWindowOverlay`, always set `coverScreen={true}` prop to exclude the usage of React Native's native Modal component and ensure proper layering.

## 🎨 Advanced Examples

### Fade Animation with Custom Duration

```tsx
<Modal
  visible={visible}
  animation={{
    type: 'fade',
    duration: 400,
  }}
  swipe={{
    directions: ['down', 'right'],
    threshold: 100,
  }}
  onHide={() => setVisible(false)}
>
  {/* Modal content */}
</Modal>
```

### Scale Animation with Custom Duration

```tsx
<Modal
  visible={visible}
  animation={{
    type: 'scale',
    duration: 400,
    scaleFactor: 0.8,
  }}
  swipe={{
    directions: ['down', 'right'],
    threshold: 100,
  }}
  onHide={() => setVisible(false)}
>
  {/* Modal content */}
</Modal>
```

### Custom Slide Animation with Swipe Directions

```tsx
<Modal
  visible={visible}
  animation={{
    type: 'slide',
    duration: 500,
    direction: {
      start: 'down',           // Slides in from bottom
      end: ['down', 'right'],  // Can dismiss by swiping down or right
    },
  }}
  swipe={{
    threshold: 150,
    bounceSpringConfig: {
      dampingRatio: 0.8,
      duration: 400,
    },
  }}
  onHide={() => setVisible(false)}
>
  {/* Modal content */}
</Modal>
```

> **Note**: When using slide animation with complex directions, the `start` property determines the initial slide-in direction, while the `end` property (array or single direction) defines the available swipe-to-dismiss directions.

### Full Screen Modal

```tsx
<Modal
  visible={visible}
  contentContainerStyle={{ flex: 1 }}
  animation={{
    type: 'slide',
    duration: 300,
    direction: 'down',
  }}
  swipe={{
    directions: ['down'],
    threshold: 80,
  }}
  backdrop={false} // No backdrop for full screen
  onHide={() => setVisible(false)}
>
  {/* Modal content */}
</Modal>
```

### Custom Backdrop Examples

```tsx
// Disable backdrop completely
<Modal visible={visible} backdrop={false}>
  {/* Modal content */}
</Modal>

// Custom backdrop configuration
<Modal
  visible={visible}
  backdrop={{
    enabled: true,
    color: 'rgba(255, 0, 0, 0.3)',
    opacity: 0.8
  }}
>
  {/* Modal content */}
</Modal>

// Custom backdrop renderer (e.g., BlurView)
<Modal
  visible={visible}
  backdrop={
    <BlurView
      style={StyleSheet.absoluteFill}
      blurType="light"
      blurAmount={10}
    />
  }
>
  {/* Modal content */}
</Modal>
```

## 🤝 Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## 📄 License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
