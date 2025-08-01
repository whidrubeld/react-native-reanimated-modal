import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FC,
  type ReactNode,
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

import type { ModalProps, SwipeDirection, ModalAnimationConfig } from './types';
import { styles } from './styles';
import {
  normalizeAnimationConfig,
  normalizeSwipeConfig,
  getSwipeDirections,
  getSlideInDirection,
  DEFAULT_MODAL_ANIMATION_DURATION,
  DEFAULT_MODAL_SCALE_FACTOR,
  DEFAULT_MODAL_BACKDROP_OPACITY,
  DEFAULT_MODAL_BACKDROP_COLOR,
  DEFAULT_MODAL_SWIPE_THRESHOLD,
  DEFAULT_MODAL_BOUNCE_SPRING_CONFIG,
  DEFAULT_MODAL_BOUNCE_OPACITY_THRESHOLD,
} from './config';

/**
 * Animation state for the modal.
 * @enum {string}
 */
enum AnimationMode {
  None = 'None',
  Open = 'Open',
  Slide = 'Slide',
  Bounce = 'Bounce',
  Close = 'Close',
}

/**
 * Modal component with smooth, customizable animations and gesture support.
 * Built on top of React Native's Modal, Reanimated, and Gesture Handler.
 *
 * @param {ModalProps} props - Props for the modal component.
 * @returns {JSX.Element}
 */
export const Modal: FC<ModalProps> = ({
  visible = false,
  closable = true,
  children,
  style,
  contentContainerStyle,
  //
  animationConfig,
  //
  hasBackdrop = true,
  backdropColor = DEFAULT_MODAL_BACKDROP_COLOR,
  backdropOpacity = DEFAULT_MODAL_BACKDROP_OPACITY,
  onBackdropPress,
  renderBackdrop,
  //
  swipeConfig,
  //
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

  // Normalize configs with defaults
  const normalizedAnimationConfig = useMemo(
    () => normalizeAnimationConfig(animationConfig),
    [animationConfig]
  );

  const normalizedSwipeConfig = useMemo(
    () => normalizeSwipeConfig(swipeConfig),
    [swipeConfig]
  );

  // Extract values from configs
  const animationDuration =
    normalizedAnimationConfig.duration || DEFAULT_MODAL_ANIMATION_DURATION;
  const swipeEnabled = normalizedSwipeConfig.enabled ?? true;
  const swipeThreshold =
    normalizedSwipeConfig.threshold || DEFAULT_MODAL_SWIPE_THRESHOLD;
  const bounceSpringConfig =
    normalizedSwipeConfig.bounceSpringConfig ||
    DEFAULT_MODAL_BOUNCE_SPRING_CONFIG;
  const bounceOpacityThreshold =
    normalizedSwipeConfig.bounceOpacityThreshold ||
    DEFAULT_MODAL_BOUNCE_OPACITY_THRESHOLD;

  /**
   * Tracks the modal's actual visibility state (native Modal open/close).
   * @type {[boolean, Function]}
   */
  const [modalVisible, setModalVisible] = useState(false);

  /**
   * Shared values for animation progress and gesture state.
   * @type {Animated.SharedValue<number>}
   */
  const progress = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const activeSwipeDirection = useSharedValue<SwipeDirection | null>(null);

  const animationMode = useSharedValue(AnimationMode.None);

  /**
   * Allowed swipe directions for dismissing the modal.
   * @type {SwipeDirection[]}
   */
  const swipeDirections = useMemo(
    () => getSwipeDirections(normalizedSwipeConfig, normalizedAnimationConfig),
    [normalizedSwipeConfig, normalizedAnimationConfig]
  );

  /**
   * Slide-in direction for the modal.
   * @type {SwipeDirection}
   */
  const slideInDirection = useMemo(
    () => getSlideInDirection(normalizedAnimationConfig),
    [normalizedAnimationConfig]
  );

  /**
   * Resets all animation and gesture state to initial values.
   * @function
   */
  const resetAnimationState = useCallback(() => {
    progress.value = 0;
    offsetX.value = 0;
    offsetY.value = 0;
    activeSwipeDirection.value = null;
    animationMode.value = AnimationMode.None;
  }, [progress, offsetX, offsetY, activeSwipeDirection, animationMode]);

  /**
   * Opens the modal with animation.
   * @function
   */
  const handleOpen = useCallback<() => void>(() => {
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

  /**
   * Resets modal state and calls onHide after close animation.
   * @function
   */
  const handleReset = useCallback(() => {
    animationMode.value = AnimationMode.None;
    setModalVisible(false);
    resetAnimationState();
    if (onHide) runOnJS(onHide)();
  }, [onHide, resetAnimationState, animationMode]);

  /**
   * Closes the modal with animation.
   * @function
   */
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

  /**
   * Checks if a swipe direction is allowed for dismiss.
   * @function
   * @param {SwipeDirection} direction
   * @returns {boolean}
   */
  const isDirectionAllowed = (direction: SwipeDirection): boolean => {
    'worklet';
    return swipeDirections.includes(direction);
  };

  /**
   * Calculates swipe progress for gesture-based dismiss.
   * @function
   * @param {number} dx
   * @param {number} dy
   * @returns {number}
   */
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

  /**
   * Pan gesture handler for swipe-to-dismiss.
   */
  const panGesture = Gesture.Pan()
    .enabled(swipeEnabled && closable)
    .onBegin(() => {
      if (animationMode.value !== AnimationMode.None) return;
      activeSwipeDirection.value = null; // Reset direction at the start of gesture
    })
    .onUpdate((event) => {
      // Only set direction once per gesture
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

      // Move only along the chosen direction
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

        let counter = 0;
        offsetX.value = withTiming(
          finalX,
          {
            duration: animationDuration,
            easing: Easing.out(Easing.ease),
          },
          () => {
            counter += 1;
            if (counter === 2) {
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
            counter += 1;
            if (counter === 2) {
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
            offsetX.value = withSpring(0, bounceSpringConfig, () => {
              animationMode.value = AnimationMode.None;
              activeSwipeDirection.value = null;
            });
            break;
          case 'up':
          case 'down':
            offsetY.value = withSpring(0, bounceSpringConfig, () => {
              animationMode.value = AnimationMode.None;
              activeSwipeDirection.value = null;
            });
            break;
        }
      }
    });

  /**
   * Handles modal open/close based on visibility and animation state.
   * @function
   */
  const handleToggle = useCallback(
    (mode: AnimationMode, isVisible: boolean, isModalVisible: boolean) => {
      if (mode !== AnimationMode.None) return;
      if (isVisible && !isModalVisible) handleOpen();
      else if (!isVisible && isModalVisible) handleClose();
    },
    [handleClose, handleOpen]
  );

  /**
   * Effect: open/close modal when visible prop changes.
   */
  useEffect(() => {
    handleToggle(animationMode.value, visible, modalVisible);
  }, [visible, modalVisible, handleToggle, animationMode]);

  /**
   * Animated reaction: syncs animationMode changes with React state.
   */
  useAnimatedReaction(
    () => animationMode.value,
    (anim, prev) => {
      if (anim !== prev) {
        runOnJS(handleToggle)(anim, visible, modalVisible);
      }
    },
    [visible, modalVisible, handleToggle]
  );

  /**
   * Effect: handles hardware back button for Android.
   */
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

  /**
   * Animated style for the backdrop (opacity, fade, bounce correction).
   */
  const backdropAnimatedStyle = useAnimatedStyle(() => {
    const computedOpacity = !renderBackdrop ? backdropOpacity : 1;
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
    let baseOpacity = computedOpacity * (1 - swipeFade);
    if (
      animationMode.value === AnimationMode.Bounce &&
      computedOpacity - baseOpacity <= bounceOpacityThreshold
    ) {
      baseOpacity = computedOpacity;
    }
    return {
      opacity: interpolate(progress.value, [0, 1], [0, baseOpacity]),
    };
  });

  /**
   * Animated style for the modal content (slide/fade/scale/gesture transforms).
   */
  const contentAnimatedStyle = useAnimatedStyle(() => {
    if (activeSwipeDirection.value) {
      const baseOpacity =
        normalizedAnimationConfig.animation === 'fade' ? progress.value : 1;
      return {
        opacity: baseOpacity,
        transform: [
          { translateX: offsetX.value },
          { translateY: offsetY.value },
        ],
      };
    }

    switch (normalizedAnimationConfig.animation) {
      case 'fade': {
        return {
          opacity: progress.value,
          transform: [{ translateX: 0 }, { translateY: 0 }],
        };
      }
      case 'scale': {
        const scaleConfig =
          normalizedAnimationConfig as ModalAnimationConfig<'scale'>;
        const scaleFactor =
          scaleConfig.scaleFactor || DEFAULT_MODAL_SCALE_FACTOR;
        const scale = interpolate(progress.value, [0, 1], [scaleFactor, 1]);
        return {
          opacity: progress.value,
          transform: [{ translateX: 0 }, { translateY: 0 }, { scale }],
        };
      }
      case 'slide':
      default: {
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
        const entryPos = slideIn(slideInDirection);
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
    }
  });

  /**
   * Renders the modal content, optionally wrapped with gesture detector.
   * @returns {ReactNode}
   */
  const renderContent = (): ReactNode => {
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

  /**
   * Renders the backdrop component if enabled or custom.
   * @returns {ReactNode|null}
   */
  const renderBackdropInternal = (): ReactNode | null => {
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
            !renderBackdrop && { backgroundColor: backdropColor },
            backdropAnimatedStyle,
          ]}
        >
          {renderBackdrop ? renderBackdrop() : null}
        </Animated.View>
      </Pressable>
    );
  };

  if (coverScreen && modalVisible) {
    return (
      <View
        testID={containerTestID}
        style={[styles.absolute, styles.root, style]}
        pointerEvents="box-none"
      >
        {renderBackdropInternal()}
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
      <View
        testID={containerTestID}
        style={[styles.root, style]}
        pointerEvents="box-none"
      >
        {renderBackdropInternal()}
        {renderContent()}
      </View>
    </RNModal>
  );
};
