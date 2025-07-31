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

export interface ModalProps
  extends Pick<ModalPropsIOS, 'onOrientationChange' | 'supportedOrientations'>,
    Pick<
      ModalPropsAndroid,
      | 'hardwareAccelerated'
      | 'navigationBarTranslucent'
      | 'statusBarTranslucent'
    > {
  visible: boolean;
  closable?: boolean;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;

  // Test IDs
  backdropTestID?: string;
  contentTestID?: string;
  containerTestID?: string;

  // Animation type
  animation?: ModalAnimation;
  animationDuration?: number;

  // Backdrop related
  hasBackdrop?: boolean;
  backdropColor?: string;
  backdropOpacity?: number;
  renderBackdrop?: () => ReactNode;
  onBackdropPress?: () => void;

  // Swipe
  swipeDirection?: SwipeDirection | SwipeDirection[];
  swipeThreshold?: number; // in pixels
  swipeEnabled?: boolean;

  // Bounce
  bounceSpringConfig?: SpringConfig;
  bounceOpacityThreshold?: number; // Opacity threshold for bounce effect

  // Others
  coverScreen?: boolean; // If true, covers the entire screen

  // Events
  onShow?: () => void;
  onHide?: () => void;
}
