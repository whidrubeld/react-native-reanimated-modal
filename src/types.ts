import type { ReactNode } from 'react';
import type {
  ModalPropsAndroid,
  ModalPropsIOS,
  StyleProp,
  ViewStyle,
} from 'react-native';
import type { SpringConfig } from 'react-native-reanimated/lib/typescript/animation/springUtils';

export type ModalAnimation = 'fade' | 'slide';
export type SwipeDirection = 'up' | 'down' | 'left' | 'right';

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

  // Animation type
  /**
   * Animation type for modal appearance.
   * @default 'slide'
   */
  animation?: ModalAnimation;
  /**
   * Duration of the open/close animation in milliseconds.
   * @default 300
   */
  animationDuration?: number;

  // Backdrop related
  /**
   * Whether to show a backdrop behind the modal.
   * @default true
   */
  hasBackdrop?: boolean;
  /**
   * Color of the backdrop.
   * @default 'black'
   */
  backdropColor?: string;
  /**
   * Opacity of the backdrop (0-1).
   * @default 0.7
   */
  backdropOpacity?: number;
  /**
   * Custom backdrop renderer. Если задан, используется вместо стандартного backdrop.
   * Полезно для BlurView, градиентов и других кастомных фонов.
   *
   * @returns ReactNode — кастомный backdrop-элемент
   */
  renderBackdrop?: () => ReactNode;
  /**
   * Callback when the backdrop is pressed.
   */
  onBackdropPress?: () => void;

  // Swipe
  /**
   * Direction(s) to enable swipe-to-dismiss. When array is provided, the first element determines the initial slide-in direction.
   * @default 'down'
   */
  swipeDirection?: SwipeDirection | SwipeDirection[];
  /**
   * Distance in pixels to trigger dismiss by swipe.
   * @default 100
   */
  swipeThreshold?: number;
  /**
   * Whether swipe gestures are enabled.
   * @default true
   */
  swipeEnabled?: boolean;

  // Bounce
  /**
   * Spring config for bounce-back animation after failed swipe. Accepts the same shape as Reanimated's spring config.
   * @default { stiffness: 200, dampingRatio: 0.5, duration: 700 }
   */
  bounceSpringConfig?: SpringConfig;
  /**
   * Threshold for backdrop opacity correction during bounce. If the difference between target and current opacity is less than this value, opacity is snapped to target.
   * @default 0.05
   */
  bounceOpacityThreshold?: number;

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
