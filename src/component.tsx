import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FC,
  type JSX,
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
import { styles } from './styles';
import {
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_BOUNCE_OPACITY_THRESHOLD,
  DEFAULT_BOUNCE_SPRING_CONFIG,
  DEFAULT_SWIPE_THRESHOLD,
} from './constants';

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
 * @component
 * @param {object} props - Modal props
 * @param {boolean} [props.visible=false] - Controls the visibility of the modal.
 * @param {boolean} [props.closable=true] - Whether the modal can be closed by user actions (backdrop press, swipe, hardware back).
 * @param {React.ReactNode} props.children - Content to render inside the modal.
 * @param {StyleProp<ViewStyle>} [props.style] - Style for the modal container.
 * @param {StyleProp<ViewStyle>} [props.contentContainerStyle] - Style for the content wrapper.
 * @param {'fade'|'slide'} [props.animation='slide'] - Animation type for modal appearance.
 * @param {number} [props.animationDuration=300] - Duration of the open/close animation in milliseconds.
 * @param {boolean} [props.hasBackdrop=true] - Whether to show a backdrop behind the modal.
 * @param {string} [props.backdropColor='black'] - Color of the backdrop.
 * @param {number} [props.backdropOpacity=0.7] - Opacity of the backdrop (0-1).
 * @param {() => void} [props.onBackdropPress] - Callback when the backdrop is pressed.
 * @param {SwipeDirection|SwipeDirection[]} [props.swipeDirection='down'] - Direction(s) to enable swipe-to-dismiss. If array, the first element determines the initial slide-in direction.
 * @param {number} [props.swipeThreshold=100] - Distance in pixels to trigger dismiss by swipe.
 * @param {boolean} [props.swipeEnabled=true] - Whether swipe gestures are enabled.
 * @param {SpringConfig} [props.bounceSpringConfig] - Spring config for bounce-back animation after failed swipe. Accepts the same shape as Reanimated's spring config.
 * @param {number} [props.bounceOpacityThreshold=0.05] - Threshold for backdrop opacity correction during bounce. If the difference between target and current opacity is less than this value, opacity is snapped to target.
 * @param {boolean} [props.coverScreen=false] - If true, covers the entire screen without using native Modal.
 * @param {() => void} [props.onShow] - Called when the modal appears.
 * @param {() => void} [props.onHide] - Called when the modal disappears.
 * @param {boolean} [props.hardwareAccelerated] - See React Native Modal docs.
 * @param {boolean} [props.navigationBarTranslucent] - See React Native Modal docs.
 * @param {() => void} [props.onOrientationChange] - See React Native Modal docs.
 * @param {boolean} [props.statusBarTranslucent] - See React Native Modal docs.
 * @param {string[]} [props.supportedOrientations] - See React Native Modal docs.
 * @param {string} [props.backdropTestID='modal-backdrop'] - testID for the backdrop Pressable.
 * @param {string} [props.contentTestID='modal-content'] - testID for the modal content (Animated.View).
 * @param {string} [props.containerTestID='modal-container'] - testID for the root container View.
 * @returns {JSX.Element}
 */
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
  bounceSpringConfig = DEFAULT_BOUNCE_SPRING_CONFIG,
  bounceOpacityThreshold = DEFAULT_BOUNCE_OPACITY_THRESHOLD,
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
    () => (Array.isArray(swipeDirection) ? swipeDirection : [swipeDirection]),
    [swipeDirection]
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
      backdropOpacity - baseOpacity <= bounceOpacityThreshold
    ) {
      baseOpacity = backdropOpacity;
    }
    return {
      opacity: interpolate(progress.value, [0, 1], [0, baseOpacity]),
    };
  });

  /**
   * Animated style for the modal content (slide/fade/gesture transforms).
   */
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

    switch (animation) {
      case 'fade': {
        return {
          opacity: progress.value,
          transform: [{ translateX: 0 }, { translateY: 0 }],
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
    }
  });

  /**
   * Renders the modal content, optionally wrapped with gesture detector.
   * @returns {JSX.Element}
   */
  const renderContent = (): JSX.Element | null => {
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
   * Renders the backdrop component if enabled.
   * @returns {JSX.Element|null}
   */
  const renderBackdrop = (): JSX.Element | null => {
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
