import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  BackHandler,
  Modal as RNModal,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import type { ModalProps, SwipeDirection } from './types';

const DEFAULT_ANIMATION_DURATION = 300;
const DEFAULT_SWIPE_THRESHOLD = 100;

export const Modal: React.FC<ModalProps> = ({
  isVisible = false,
  children,
  style,
  contentContainerStyle,
  //
  animation = 'slide',
  animationDuration = DEFAULT_ANIMATION_DURATION,
  //
  hasBackdrop = true,
  backdropColor = 'black',
  backdropOpacity = 0.7,
  onBackdropPress,
  //
  swipeDirection = 'down',
  swipeThreshold = DEFAULT_SWIPE_THRESHOLD,
  swipeEnabled = true,
  //
  coverScreen = false,
  //
  onShow,
  onHide,
  onRequestClose,
  //
  hardwareAccelerated,
  navigationBarTranslucent,
  onOrientationChange,
  statusBarTranslucent,
  supportedOrientations,
}) => {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();

  // Track the modal's actual visibility state
  const [modalVisible, setModalVisible] = useState(false);

  // If the animation prop changes while the modal is open, we’ll need to reset
  const prevAnimationRef = useRef(animation);
  const prevAnimation = prevAnimationRef.current;

  // Directions
  const swipeDirections = Array.isArray(swipeDirection)
    ? swipeDirection
    : [swipeDirection];

  // Shared values
  const progress = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const activeSwipeDirection = useSharedValue<SwipeDirection | null>(null);

  const isAnimating = useSharedValue(false);
  const isSwipeActive = useSharedValue(false);
  const isClosingViaSwipe = useSharedValue(false);

  // Reset all animation flags
  const resetAnimationState = useCallback(() => {
    progress.value = 0;
    offsetX.value = 0;
    offsetY.value = 0;
    activeSwipeDirection.value = null;
    isSwipeActive.value = false;
    isAnimating.value = false;
    isClosingViaSwipe.value = false;
  }, [
    progress,
    offsetX,
    offsetY,
    activeSwipeDirection,
    isSwipeActive,
    isAnimating,
    isClosingViaSwipe,
  ]);

  // Complete swipe-close
  const completeSwipeClose = useCallback(() => {
    setModalVisible(false);
    onHide?.();
    resetAnimationState();
  }, [onHide, resetAnimationState]);

  // Close action
  const handleClose = useCallback(() => {
    if (onRequestClose) onRequestClose();
    else completeSwipeClose();
  }, [onRequestClose, completeSwipeClose]);

  // Open with animation
  const openModal = useCallback(() => {
    if (isAnimating.value) return;
    setModalVisible(true);
    isAnimating.value = true;

    offsetX.value = 0;
    offsetY.value = 0;
    activeSwipeDirection.value = null;
    isSwipeActive.value = false;
    isClosingViaSwipe.value = false;

    progress.value = withTiming(
      1,
      { duration: animationDuration, easing: Easing.out(Easing.ease) },
      () => {
        isAnimating.value = false;
        if (onShow) runOnJS(onShow)();
      }
    );
  }, [
    animationDuration,
    progress,
    onShow,
    isAnimating,
    offsetX,
    offsetY,
    activeSwipeDirection,
    isSwipeActive,
    isClosingViaSwipe,
  ]);

  // Close with animation
  const closeModal = useCallback(() => {
    if (isAnimating.value || isClosingViaSwipe.value) return;
    isAnimating.value = true;

    progress.value = withTiming(
      0,
      { duration: animationDuration, easing: Easing.in(Easing.ease) },
      () => {
        isAnimating.value = false;
        runOnJS(setModalVisible)(false);
        if (onHide) runOnJS(onHide)();
      }
    );
  }, [animationDuration, progress, onHide, isAnimating, isClosingViaSwipe]);

  // Check if direction is allowed
  const isDirectionAllowed = (direction: SwipeDirection) => {
    'worklet';
    return swipeDirections.includes(direction);
  };

  // Calculate swipe progress
  const calculateSwipeProgress = (dx: number, dy: number): number => {
    'worklet';
    if (!activeSwipeDirection.value) return 0;

    let dist = 0;
    switch (activeSwipeDirection.value) {
      case 'left':
        dist = Math.abs(dx);
        break;
      case 'right':
        dist = dx;
        break;
      case 'up':
        dist = Math.abs(dy);
        break;
      case 'down':
        dist = dy;
        break;
    }
    return Math.min(1, Math.max(0, dist / swipeThreshold));
  };

  // Pan gesture
  const panGesture = Gesture.Pan()
    .enabled(swipeEnabled)
    .onBegin(() => {
      if (isAnimating.value || isClosingViaSwipe.value) return;
      isSwipeActive.value = true;
      activeSwipeDirection.value = null;
    })
    .onUpdate((event) => {
      if (!isSwipeActive.value || isAnimating.value || isClosingViaSwipe.value)
        return;

      if (activeSwipeDirection.value == null) {
        if (Math.abs(event.translationX) > Math.abs(event.translationY)) {
          const dir = event.translationX > 0 ? 'right' : 'left';
          if (isDirectionAllowed(dir)) {
            activeSwipeDirection.value = dir;
          }
        } else {
          const dir = event.translationY > 0 ? 'down' : 'up';
          if (isDirectionAllowed(dir)) {
            activeSwipeDirection.value = dir;
          }
        }
      }

      // Animate only one axis
      if (activeSwipeDirection.value === 'left') {
        offsetX.value = Math.min(0, event.translationX);
        offsetY.value = 0;
      } else if (activeSwipeDirection.value === 'right') {
        offsetX.value = Math.max(0, event.translationX);
        offsetY.value = 0;
      } else if (activeSwipeDirection.value === 'up') {
        offsetY.value = Math.min(0, event.translationY);
        offsetX.value = 0;
      } else if (activeSwipeDirection.value === 'down') {
        offsetY.value = Math.max(0, event.translationY);
        offsetX.value = 0;
      }
    })
    .onEnd(() => {
      if (!isSwipeActive.value || !activeSwipeDirection.value) {
        isSwipeActive.value = false;
        return;
      }

      const swipeProg = calculateSwipeProgress(offsetX.value, offsetY.value);
      if (swipeProg >= 1) {
        // Close via swipe
        isSwipeActive.value = false;
        isClosingViaSwipe.value = true;

        const finalX =
          activeSwipeDirection.value === 'left'
            ? -SCREEN_WIDTH
            : activeSwipeDirection.value === 'right'
              ? SCREEN_WIDTH
              : 0;
        const finalY =
          activeSwipeDirection.value === 'up'
            ? -SCREEN_HEIGHT
            : activeSwipeDirection.value === 'down'
              ? SCREEN_HEIGHT
              : 0;

        offsetX.value = withTiming(finalX, {
          duration: animationDuration,
          easing: Easing.out(Easing.ease),
        });
        offsetY.value = withTiming(
          finalY,
          { duration: animationDuration, easing: Easing.out(Easing.ease) },
          () => {
            runOnJS(handleClose)();
          }
        );
      } else {
        // Bounce back
        const springConfig = {
          damping: 11,
          stiffness: 100,
          mass: 0.7,
          restSpeedThreshold: 0.01,
        };

        if (
          activeSwipeDirection.value === 'left' ||
          activeSwipeDirection.value === 'right'
        ) {
          offsetX.value = withSpring(0, springConfig, () => {
            isSwipeActive.value = false;
          });
        } else {
          offsetY.value = withSpring(0, springConfig, () => {
            isSwipeActive.value = false;
          });
        }
      }
    });

  // Open/close on isVisible changes
  useEffect(() => {
    if (isClosingViaSwipe.value) return;
    if (isVisible && !modalVisible) {
      openModal();
    } else if (!isVisible && modalVisible) {
      closeModal();
    }
  }, [isVisible, modalVisible, openModal, closeModal, isClosingViaSwipe]);

  // Detect changes in the animation prop while modal is open
  useEffect(() => {
    if (modalVisible && prevAnimation !== animation) {
      // If the modal is already open and we switch from slide <-> fade
      // we reset and re-open with the new animation
      resetAnimationState();
      openModal();
    }
    prevAnimationRef.current = animation;
  }, [animation, modalVisible, prevAnimation, resetAnimationState, openModal]);

  // Hardware back
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (isVisible) {
          handleClose();
          return true;
        }
        return false;
      }
    );
    return () => backHandler.remove();
  }, [isVisible, handleClose]);

  // Backdrop animation
  const backdropAnimatedStyle = useAnimatedStyle(() => {
    let localProgress = 0;
    if (isSwipeActive.value || isClosingViaSwipe.value) {
      localProgress = calculateSwipeProgress(offsetX.value, offsetY.value);
    }
    const baseOpacity = backdropOpacity * (1 - localProgress);
    return {
      opacity: interpolate(progress.value, [0, 1], [0, baseOpacity]),
    };
  });

  // Content animation
  const contentAnimatedStyle = useAnimatedStyle(() => {
    // If swiping, always use offsets (slide)
    if (
      (isSwipeActive.value || isClosingViaSwipe.value) &&
      activeSwipeDirection.value
    ) {
      const baseOpacity = animation === 'fade' ? progress.value : 1;
      return {
        opacity: baseOpacity,
        transform: [
          { translateX: offsetX.value },
          { translateY: offsetY.value },
        ],
      };
    }

    // Otherwise respect the chosen animation
    if (animation === 'fade') {
      return {
        opacity: progress.value,
      };
    } else {
      // slide
      const slideIn = (direction: SwipeDirection) => {
        switch (direction) {
          case 'up':
            return { x: 0, y: -SCREEN_HEIGHT };
          case 'down':
            return { x: 0, y: SCREEN_HEIGHT };
          case 'left':
            return { x: -SCREEN_WIDTH, y: 0 };
          case 'right':
            return { x: SCREEN_WIDTH, y: 0 };
        }
      };
      const entryPos = slideIn(swipeDirections[0] || 'down');
      return {
        opacity: 1,
        transform: [
          {
            translateX: interpolate(progress.value, [0, 1], [entryPos.x, 0]),
          },
          {
            translateY: interpolate(progress.value, [0, 1], [entryPos.y, 0]),
          },
        ],
      };
    }
  });

  const renderContent = () => {
    const content = (
      <Animated.View
        style={[contentContainerStyle, contentAnimatedStyle, style]}
      >
        {children}
      </Animated.View>
    );
    if (swipeEnabled && swipeDirections.length > 0) {
      return <GestureDetector gesture={panGesture}>{content}</GestureDetector>;
    }
    return content;
  };

  const renderBackdrop = () => {
    if (!hasBackdrop) return null;
    return (
      <Pressable
        style={styles.absolute}
        onPress={
          onBackdropPress
            ? onBackdropPress
            : onRequestClose
              ? onRequestClose
              : closeModal
        }
      >
        <Animated.View
          style={[
            styles.absolute,
            { backgroundColor: backdropColor },
            backdropAnimatedStyle,
          ]}
        />
      </Pressable>
    );
  };

  if (coverScreen && modalVisible) {
    return (
      <View style={[styles.absolute, style]}>
        {renderBackdrop()}
        {renderContent()}
      </View>
    );
  }

  return (
    <RNModal
      hardwareAccelerated={hardwareAccelerated}
      navigationBarTranslucent={navigationBarTranslucent}
      statusBarTranslucent={statusBarTranslucent}
      onOrientationChange={onOrientationChange}
      supportedOrientations={supportedOrientations}
      // presentationStyle="overFullScreen"
      transparent
      visible={modalVisible}
      onRequestClose={handleClose}
    >
      <View style={[styles.root, style]}>
        {renderBackdrop()}
        {renderContent()}
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  absolute: StyleSheet.absoluteFillObject,
  root: {
    flex: 1,
    justifyContent: 'center',
  },
});
