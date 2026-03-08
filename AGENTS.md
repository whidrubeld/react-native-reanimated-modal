# AI Agents Configuration

This document provides specialized configurations for AI coding assistants working with the `react-native-reanimated-modal` project.

## Project Overview

**react-native-reanimated-modal** is a high-performance React Native library that provides smooth, customizable modal components with 60fps animations running on the UI thread. The library is built on top of `react-native-reanimated` and `react-native-gesture-handler` for optimal performance.

### Key Technologies

- **React Native**: Cross-platform mobile development framework
- **react-native-reanimated**: High-performance animations on UI thread
- **react-native-gesture-handler**: Native gesture recognition
- **TypeScript**: Full type safety and enhanced DX
- **Expo**: Development toolchain for example app
- **Jest**: Unit testing framework

## Project Structure

```
├── src/                          # Main library source
│   ├── component.tsx            # Main Modal component
│   ├── types.ts                 # TypeScript type definitions
│   ├── config.ts                # Configuration constants and utilities
│   ├── styles.ts                # Styling definitions
│   ├── index.ts                 # Public API exports
│   └── __tests__/               # Unit tests
├── example/                     # Expo example application
│   ├── src/
│   │   ├── App.tsx              # Main app component
│   │   ├── Content.tsx          # Example showcase component
│   │   ├── use-cases/           # Usage examples
│   │   └── primitives/          # UI components
│   └── package.json             # Example app dependencies
└── package.json                 # Library dependencies
```

## Core Features

### Modal Component Capabilities

- **Animation Types**: `fade`, `slide`, `scale`, `custom`
- **Gesture Support**: Swipe-to-dismiss in 4 directions (up, down, left, right)
- **Performance**: 60fps animations on UI thread via react-native-reanimated
- **Platform Integration**: Uses React Native's Modal component as foundation
- **Multi-Modal Support**: Supports multiple overlays and React Navigation integration

### Animation States

- `opening`: Modal is appearing
- `sliding`: User is swiping to dismiss
- `bouncing`: Modal bouncing back after insufficient swipe
- `closing`: Modal is disappearing

## Development Guidelines

### Code Quality Standards

#### TypeScript

- **Strict Mode**: Enabled with comprehensive checks
- **Type Safety**: All components must be fully typed
- **No `any` Types**: Use proper type definitions or generics
- **Interface Definitions**: Prefer interfaces over types for object shapes

#### Component Architecture

- **Functional Components**: Use React hooks, avoid class components
- **Performance Optimization**: Leverage `useCallback`, `useMemo`, `useAnimatedStyle`
- **Reanimated Best Practices**: Use `useSharedValue`, `withTiming`, `withSpring`
- **Gesture Handling**: Implement via `react-native-gesture-handler` API

#### Testing Requirements

- **Unit Tests**: All public APIs must have tests
- **Animation Testing**: Use `react-native-reanimated` testing utilities
- **Platform Testing**: Consider iOS/Android differences
- **Edge Cases**: Test gesture interactions and state transitions

### File Modification Guidelines

#### Core Library (`/src`)

- **component.tsx**: Main modal implementation, handle with care
- **types.ts**: Type definitions, ensure backward compatibility
- **config.ts**: Default configurations and utilities
- **styles.ts**: Styling constants and helper functions

#### Example App (`/example`)

- **Use Cases**: Add new examples in `use-cases/` directory
- **Primitives**: Reusable UI components in `primitives/`
- **Showcase**: Update `Content.tsx` for new examples

#### Testing (`/src/__tests__`)

- **Test Files**: Follow naming convention `*.test.tsx`
- **Coverage**: Aim for >90% code coverage
- **Mock Strategy**: Mock native modules appropriately

## Animation Development Patterns

### Reanimated Guidelines

```typescript
// ✅ Correct: Use useSharedValue for animated values
const progress = useSharedValue(0);
const animatedStyle = useAnimatedStyle(() => ({
  opacity: progress.value,
}));

// ❌ Avoid: Direct state mutations in animations
// Don't use useState for animated values
```

### Gesture Implementation

```typescript
// ✅ Correct: Proper gesture handling
const gesture = Gesture.Pan()
  .onBegin(() => {
    // Handle gesture start
  })
  .onChange((event) => {
    // Update shared values
  })
  .onEnd(() => {
    // Complete animation
  });
```

### Performance Considerations

- Use `runOnJS` sparingly for UI thread operations
- Prefer `useAnimatedReaction` for value watching
- Implement proper gesture cancellation
- Optimize re-renders with proper memoization

## Testing Strategies

### Unit Testing Approach

- **Component Rendering**: Test component mounting and props
- **Animation Logic**: Verify animation configurations
- **Gesture Interactions**: Mock and test gesture callbacks
- **Platform Behavior**: Test iOS/Android specific code paths

### Integration Testing

- **Modal States**: Test state transitions (open ↔ closed)
- **Animation Sequences**: Verify animation timing and curves
- **Gesture Recognition**: Test swipe thresholds and directions
- **Multi-Modal**: Test overlapping modal scenarios

## AI Assistant Specializations

### Code Generation Agent

**Focus**: Component creation, hook implementation, animation logic
**Strengths**: TypeScript patterns, React Native best practices, Reanimated APIs
**Use Cases**: New features, animation improvements, performance optimizations

### Testing Agent

**Focus**: Test creation, coverage analysis, edge case identification
**Strengths**: Jest configuration, React Native Testing Library, animation testing
**Use Cases**: Test suite expansion, regression testing, platform-specific tests

### Documentation Agent

**Focus**: API documentation, usage examples, migration guides
**Strengths**: TypeDoc integration, example creation, architectural documentation
**Use Cases**: README updates, API references, tutorial creation

### Performance Agent

**Focus**: Bundle size optimization, animation performance, profiling
**Strengths**: Reanimated profiling, Metro bundler optimization, platform performance
**Use Cases**: Performance audits, bundle analysis, optimization strategies

## Common Patterns and Anti-Patterns

### ✅ Recommended Patterns

#### Animation Implementation

```typescript
// Smooth, cancellable animations
const showModal = useCallback(() => {
  progress.value = withTiming(1, {
    duration: 300,
    easing: Easing.out(Easing.cubic),
  });
}, []);
```

#### Gesture Handling

```typescript
// Proper gesture state management
const panGesture = useMemo(
  () =>
    Gesture.Pan()
      .activeOffsetY([-10, 10])
      .failOffsetX([-50, 50])
      .onUpdate(/* ... */)
      .onEnd(/* ... */),
  []
);
```

### ❌ Anti-Patterns to Avoid

```typescript
// ❌ Don't use setState for animations
const [opacity, setOpacity] = useState(0);

// ❌ Don't interpolate without bounds
interpolate(value, [0, 1], [0, 100]); // Missing extrapolate

// ❌ Don't create gestures in render
return (
  <GestureDetector gesture={Gesture.Pan().onUpdate(...)}>
    {/* ... */}
  </GestureDetector>
);
```

## Platform Considerations

### iOS Specific

- **Status Bar**: Handle status bar styling during modal presentation
- **Safe Areas**: Respect notch and home indicator areas
- **Haptics**: Consider iOS haptic feedback integration

### Android Specific

- **Hardware Back**: Implement Android back button handling
- **Status Bar**: Handle translucent status bar properly
- **Edge-to-Edge**: Support Android edge-to-edge display

### Cross-Platform

- **Dimensions**: Handle screen size and orientation changes
- **Performance**: Optimize for different hardware capabilities
- **Accessibility**: Implement proper accessibility features

## Dependency Management

### Key Dependencies

For current versions, always check `package.json` and `example/package.json`:

- **react-native-reanimated**: Core animation library (check for breaking changes between major versions)
- **react-native-gesture-handler**: Gesture recognition (ensure compatibility with Reanimated version)
- **react-native-worklets**: Required for Reanimated 4+ worklets support

### Compatibility Notes

- Project uses React Native New Architecture compatible versions
- Reanimated 4+ requires worklets for optimal performance
- iOS minimum version considerations for new animation APIs
- Android edge-to-edge display support requirements

---

_This configuration is optimized for the react-native-reanimated-modal project. Agents should prioritize performance, type safety, and cross-platform compatibility when working with this codebase._
