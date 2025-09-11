import type { ReactNode } from 'react';
import type {
  ModalPropsAndroid,
  ModalPropsIOS,
  StyleProp,
  ViewStyle,
} from 'react-native';
import type { SpringConfig } from 'react-native-reanimated/lib/typescript/animation/spring';

export type ModalAnimation = 'fade' | 'slide' | 'scale';
export type SwipeDirection = 'up' | 'down' | 'left' | 'right';

/**
 * Base configuration for all animation types.
 */
interface BaseAnimationConfig {
  /**
   * Duration of the animation in milliseconds.
   * @default 300
   */
  duration?: number;
}

/**
 * Configuration for fade animation.
 */
export interface FadeAnimationConfig extends BaseAnimationConfig {
  type: 'fade';
}

/**
 * Configuration for slide animation.
 */
export interface SlideAnimationConfig extends BaseAnimationConfig {
  type: 'slide';
  /**
   * Direction for slide animation.
   * Can be a single direction or an object with start/end directions.
   * @default 'down'
   */
  direction?:
    | SwipeDirection
    | {
        /**
         * Direction for slide-in animation.
         */
        start: SwipeDirection;
        /**
         * Allowed directions for swipe-to-dismiss.
         */
        end: SwipeDirection | SwipeDirection[];
      };
}

/**
 * Configuration for scale animation.
 */
export interface ScaleAnimationConfig extends BaseAnimationConfig {
  type: 'scale';
  /**
   * Initial scale factor for the modal (0-1).
   * @default 0.8
   */
  scaleFactor?: number;
}

/**
 * Union of all animation configuration types.
 */
export type ModalAnimationConfigUnion =
  | FadeAnimationConfig
  | SlideAnimationConfig
  | ScaleAnimationConfig;

/**
 * Generic type for animation config based on animation type.
 */
export type ModalAnimationConfig<T extends ModalAnimation> = T extends 'fade'
  ? FadeAnimationConfig
  : T extends 'slide'
    ? SlideAnimationConfig
    : T extends 'scale'
      ? ScaleAnimationConfig
      : never;

/**
 * Configuration for modal backdrop.
 */
export interface ModalBackdropConfig {
  /**
   * Whether to show backdrop behind the modal.
   * @default true
   */
  enabled?: boolean;
  /**
   * Color of the backdrop.
   * @default 'black'
   */
  color?: string;
  /**
   * Opacity of the backdrop (0-1).
   * @default 0.7
   */
  opacity?: number;
}
/**
 * Configuration for modal swipe.
 */
export interface ModalSwipeConfig {
  /**
   * Whether swipe gestures are enabled.
   * @default true
   */
  enabled?: boolean;
  /**
   * Array of swipe directions that should close the modal.
   * @default []
   */
  directions?: SwipeDirection[];
  /**
   * Distance in pixels to trigger dismiss by swipe.
   * @default 100
   */
  threshold?: number;
  /**
   * Spring config for bounce-back animation after failed swipe.
   * @default { stiffness: 200, dampingRatio: 0.5, duration: 700 }
   */
  bounceSpringConfig?: SpringConfig;
  /**
   * Threshold for backdrop opacity correction during bounce.
   * @default 0.05
   */
  bounceOpacityThreshold?: number;
}

/**
 * Props for the Modal component.
 *
 * @remarks
 * Allows you to flexibly customize animation, gestures, backdrop and appearance of the modal window.
 */
export interface ModalProps
  extends Pick<ModalPropsIOS, 'onOrientationChange' | 'supportedOrientations'>,
    Pick<
      ModalPropsAndroid,
      | 'hardwareAccelerated'
      | 'navigationBarTranslucent'
      | 'statusBarTranslucent'
    > {
  /**
   * Controls the visibility of the modal.
   */
  visible: boolean;
  /**
   * Whether the modal can be closed by user actions (backdrop press, swipe, hardware back).
   * @default true
   */
  closable?: boolean;
  /**
   * Content to render inside the modal.
   */
  children: ReactNode;
  /**
   * Style for the modal container (outer View).
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Style for the content wrapper (Animated.View).
   */
  contentContainerStyle?: StyleProp<ViewStyle>;

  // Test IDs
  /**
   * testID for the backdrop Pressable.
   * @default 'modal-backdrop'
   */
  backdropTestID?: string;
  /**
   * testID for the modal content (Animated.View).
   * @default 'modal-content'
   */
  contentTestID?: string;
  /**
   * testID for the root container View.
   * @default 'modal-container'
   */
  containerTestID?: string;

  // Animation configuration
  /**
   * Animation configuration for modal appearance.
   * Can be a simple animation type string or a detailed config object.
   * @default { type: 'slide', duration: 300 }
   */
  animation?: ModalAnimationConfigUnion | ModalAnimation;

  // Backdrop configuration
  /**
   * Backdrop configuration for the modal.
   * Can be false (no backdrop), a custom renderer function, or a configuration object.
   * @default { enabled: true, color: 'black', opacity: 0.7 }
   */
  backdrop?: ModalBackdropConfig | ReactNode | false;
  /**
   * Callback when the backdrop is pressed.
   * Set to false to prevent backdrop press from closing the modal.
   */
  onBackdropPress?: (() => void) | false;

  // Swipe configuration
  /**
   * Swipe gesture configuration.
   * @default { enabled: true, threshold: 100 }
   */
  swipe?: ModalSwipeConfig | false;

  // Others
  /**
   * If true, covers the entire screen without using native Modal.
   * @default false
   */
  coverScreen?: boolean;

  // Events
  /**
   * Called when the modal appears.
   */
  onShow?: () => void;
  /**
   * Called when the modal disappears.
   */
  onHide?: () => void;
}
