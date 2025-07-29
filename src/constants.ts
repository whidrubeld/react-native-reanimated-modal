import type { SpringConfig } from 'react-native-reanimated/lib/typescript/animation/springUtils';

export const DEFAULT_ANIMATION_DURATION = 3e2;
export const DEFAULT_SWIPE_THRESHOLD = 1e2;
export const DEFAULT_BOUNCE_SPRING_CONFIG: SpringConfig = {
  stiffness: 200,
  dampingRatio: 0.5,
  duration: 7e2,
};
export const DEFAULT_BOUNCE_OPACITY_THRESHOLD = 0.05;
