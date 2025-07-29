import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
} from 'react';
import {
  BackHandler,
  Modal as RNModal,
  Pressable,
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
  useAnimatedReaction,
} from 'react-native-reanimated';

import type { ModalProps, SwipeDirection } from './types';

enum AnimationMode {
  None = 'None',
  Open = 'Open',
  Slide = 'Slide',
  Bounce = 'Bounce',
  Close = 'Close',
}
import { styles } from './styles';
import {
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_SPRING_CONFIG,
  DEFAULT_SWIPE_THRESHOLD,
} from './constants';

export const Modal: FC<ModalProps> = ({
  visible = false,
  closable = true,
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
  springConfig = DEFAULT_SPRING_CONFIG,
  coverScreen = false,
  //
  onShow,
  onHide,
  //
  hardwareAccelerated,
  navigationBarTranslucent,
  onOrientationChange,
  statusBarTranslucent,
  supportedOrientations,
  // testIDs
  backdropTestID = 'modal-backdrop',
  contentTestID = 'modal-content',
  containerTestID = 'modal-container',
}) => {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();

  // Track the modal's actual visibility state
  const [modalVisible, setModalVisible] = useState(false);

  // If the animation prop changes while the modal is open, we’ll need to reset
  const prevAnimationRef = useRef(animation);
  const prevAnimation = prevAnimationRef.current;

  // Shared values
  const progress = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const activeSwipeDirection = useSharedValue<SwipeDirection | null>(null);

  const animationMode = useSharedValue(AnimationMode.None);

  // Directions
  const swipeDirections = useMemo(
    () => (Array.isArray(swipeDirection) ? swipeDirection : [swipeDirection]),
    [swipeDirection]
  );

  // Reset all animation flags
  const resetAnimationState = useCallback(() => {
    progress.value = 0;
    offsetX.value = 0;
    offsetY.value = 0;
    activeSwipeDirection.value = null;
    animationMode.value = AnimationMode.None;
  }, [progress, offsetX, offsetY, activeSwipeDirection, animationMode]);

  // Complete swipe-close
  // Корректно закрываем только через анимацию

  // Open with animation
  const handleOpen = useCallback(() => {
    if (animationMode.value !== AnimationMode.None) return;
    setModalVisible(true);
    animationMode.value = AnimationMode.Open;

    offsetX.value = 0;
    offsetY.value = 0;
    activeSwipeDirection.value = null;

    progress.value = withTiming(
      1,
      { duration: animationDuration, easing: Easing.out(Easing.ease) },
      () => {
        animationMode.value = AnimationMode.None;
        if (onShow) runOnJS(onShow)();
      }
    );
  }, [
    animationDuration,
    progress,
    onShow,
    offsetX,
    offsetY,
    activeSwipeDirection,
    animationMode,
  ]);

  const swipeAnimDone = useRef(0);
  const handleReset = useCallback(() => {
    animationMode.value = AnimationMode.None;
    setModalVisible(false);
    resetAnimationState();
    swipeAnimDone.current = 0;
    if (onHide) runOnJS(onHide)();
  }, [onHide, resetAnimationState, animationMode]);

  // Close with animation
  const handleClose = useCallback(() => {
    if (animationMode.value !== AnimationMode.None) return;
    animationMode.value = AnimationMode.Close;

    progress.value = withTiming(
      0,
      { duration: animationDuration, easing: Easing.in(Easing.ease) },
      () => {
        runOnJS(handleReset)();
      }
    );
  }, [animationDuration, progress, animationMode, handleReset]);

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
    .enabled(swipeEnabled && closable)
    .onBegin(() => {
      if (animationMode.value !== AnimationMode.None) return;
    })
    .onUpdate((event) => {
      activeSwipeDirection.value = null;
      if (activeSwipeDirection.value == null) {
        if (Math.abs(event.translationX) > Math.abs(event.translationY)) {
          const dir = event.translationX > 0 ? 'right' : 'left';
          if (isDirectionAllowed(dir)) {
            activeSwipeDirection.value = dir;
            animationMode.value = AnimationMode.Slide;
          }
        } else {
          const dir = event.translationY > 0 ? 'down' : 'up';
          if (isDirectionAllowed(dir)) {
            activeSwipeDirection.value = dir;
            animationMode.value = AnimationMode.Slide;
          }
        }
      }

      switch (activeSwipeDirection.value) {
        case 'left':
          offsetX.value = Math.min(0, event.translationX);
          offsetY.value = 0;
          break;
        case 'right':
          offsetX.value = Math.max(0, event.translationX);
          offsetY.value = 0;
          break;
        case 'up':
          offsetY.value = Math.min(0, event.translationY);
          offsetX.value = 0;
          break;
        case 'down':
          offsetY.value = Math.max(0, event.translationY);
          offsetX.value = 0;
          break;
      }
    })
    .onEnd(() => {
      if (
        animationMode.value !== AnimationMode.Slide ||
        !activeSwipeDirection.value
      ) {
        animationMode.value = AnimationMode.None;
        return;
      }

      const swipeProg = calculateSwipeProgress(offsetX.value, offsetY.value);
      if (swipeProg >= 1) {
        // Close via swipe
        animationMode.value = AnimationMode.Close;
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

        swipeAnimDone.current = 0;
        offsetX.value = withTiming(
          finalX,
          {
            duration: animationDuration,
            easing: Easing.out(Easing.ease),
          },
          () => {
            swipeAnimDone.current += 1;
            if (swipeAnimDone.current === 2) {
              runOnJS(handleReset)();
            }
          }
        );
        offsetY.value = withTiming(
          finalY,
          {
            duration: animationDuration,
            easing: Easing.out(Easing.ease),
          },
          () => {
            swipeAnimDone.current += 1;
            if (swipeAnimDone.current === 2) {
              runOnJS(handleReset)();
            }
          }
        );
      } else {
        // Bounce back
        animationMode.value = AnimationMode.Bounce;
        switch (activeSwipeDirection.value) {
          case 'left':
          case 'right':
            offsetX.value = withSpring(0, springConfig, () => {
              animationMode.value = AnimationMode.None;
              activeSwipeDirection.value = null;
            });
            break;
          case 'up':
          case 'down':
            offsetY.value = withSpring(0, springConfig, () => {
              animationMode.value = AnimationMode.None;
              activeSwipeDirection.value = null;
            });
            break;
        }
      }
    });

  const handleToggle = useCallback(
    (mode: AnimationMode, isVisible: boolean, isModalVisible: boolean) => {
      if (mode !== AnimationMode.None) return;
      if (isVisible && !isModalVisible) handleOpen();
      else if (!isVisible && isModalVisible) handleClose();
    },
    [handleClose, handleOpen]
  );

  // Open/close on visible changes
  useEffect(() => {
    handleToggle(animationMode.value, visible, modalVisible);
  }, [visible, modalVisible, handleToggle, animationMode]);

  // Реакция на изменение isAnimating.value из анимаций (shared value)
  useAnimatedReaction(
    () => animationMode.value,
    (anim, prev) => {
      if (anim !== prev) {
        runOnJS(handleToggle)(anim, visible, modalVisible);
      }
    },
    [visible, modalVisible, handleToggle]
  );

  // Detect changes in the animation prop while modal is open
  useEffect(() => {
    if (modalVisible && prevAnimation !== animation) {
      // If the modal is already open and we switch from slide <-> fade
      // we reset and re-open with the new animation
      resetAnimationState();
      handleOpen();
    }
    prevAnimationRef.current = animation;
  }, [animation, modalVisible, prevAnimation, resetAnimationState, handleOpen]);

  // Hardware back
  useEffect(() => {
    if (!closable) return;
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (visible) {
          handleClose();
          return true;
        }
        return false;
      }
    );
    return () => backHandler.remove();
  }, [visible, handleClose, closable]);

  // Backdrop animation
  const backdropAnimatedStyle = useAnimatedStyle(() => {
    let swipeFade = 0;
    if (activeSwipeDirection.value) {
      let fullSwipeDistance = 1;
      let offset = 0;
      switch (activeSwipeDirection.value) {
        case 'left':
        case 'right':
          fullSwipeDistance = SCREEN_WIDTH;
          offset = Math.abs(offsetX.value);
          break;
        case 'up':
        case 'down':
          fullSwipeDistance = SCREEN_HEIGHT;
          offset = Math.abs(offsetY.value);
          break;
      }
      swipeFade = Math.min(1, Math.max(0, offset / fullSwipeDistance));
    }
    let baseOpacity = backdropOpacity * (1 - swipeFade);
    if (
      animationMode.value === AnimationMode.Bounce &&
      backdropOpacity - baseOpacity <= 0.05
    ) {
      baseOpacity = backdropOpacity;
    }
    return {
      opacity: interpolate(progress.value, [0, 1], [0, baseOpacity]),
    };
  });

  // Content animation
  const contentAnimatedStyle = useAnimatedStyle(() => {
    if (activeSwipeDirection.value) {
      const baseOpacity = animation === 'fade' ? progress.value : 1;
      return {
        opacity: baseOpacity,
        transform: [
          { translateX: offsetX.value },
          { translateY: offsetY.value },
        ],
      };
    }

    // Иначе — обычная анимация
    if (animation === 'fade') {
      return {
        opacity: progress.value,
        transform: [{ translateX: 0 }, { translateY: 0 }],
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
        testID={contentTestID}
        style={[contentContainerStyle, contentAnimatedStyle]}
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
        testID={backdropTestID}
        style={styles.absolute}
        onPress={
          closable
            ? onBackdropPress
              ? onBackdropPress
              : handleClose
            : undefined
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
      <View
        testID={containerTestID}
        style={[styles.absolute, styles.root, style]}
      >
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
      <View testID={containerTestID} style={[styles.root, style]}>
        {renderBackdrop()}
        {renderContent()}
      </View>
    </RNModal>
  );
};
