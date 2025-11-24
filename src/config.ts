import type { ReactNode } from 'react';
import type {
  ModalAnimation,
  ModalAnimationConfigUnion,
  ModalSwipeConfig,
  ModalBackdropConfig,
  SwipeDirection,
  FadeAnimationConfig,
  SlideAnimationConfig,
  ScaleAnimationConfig,
  CustomAnimationConfig,
} from './types';
import type { SpringConfig } from 'react-native-reanimated/lib/typescript/animation/spring';

/**
 * Default values and configurations.
 */
export const DEFAULT_MODAL_ANIMATION_DURATION = 300;
export const DEFAULT_MODAL_SCALE_FACTOR = 0.8;
export const DEFAULT_MODAL_SWIPE_THRESHOLD = 100;
export const DEFAULT_MODAL_BOUNCE_OPACITY_THRESHOLD = 0.05;
export const DEFAULT_MODAL_SWIPE_DIRECTION: SwipeDirection = 'down';

/**
 * Default backdrop configuration.
 */
export const DEFAULT_MODAL_BACKDROP_CONFIG: ModalBackdropConfig = {
  enabled: true,
  color: 'black',
  opacity: 0.7,
} as const;

export const DEFAULT_MODAL_BOUNCE_SPRING_CONFIG: SpringConfig = {
  dampingRatio: 0.5,
  duration: 700,
} as const;

/**
 * Default animation configurations.
 */
export const DEFAULT_MODAL_ANIMATION_CONFIGS = {
  fade: {
    type: 'fade',
    duration: DEFAULT_MODAL_ANIMATION_DURATION,
  } as FadeAnimationConfig,
  slide: {
    type: 'slide',
    duration: DEFAULT_MODAL_ANIMATION_DURATION,
    direction: DEFAULT_MODAL_SWIPE_DIRECTION,
  } as SlideAnimationConfig,
  scale: {
    type: 'scale',
    duration: DEFAULT_MODAL_ANIMATION_DURATION,
    scaleFactor: DEFAULT_MODAL_SCALE_FACTOR,
  } as ScaleAnimationConfig,
} as const;

/**
 * Default swipe configuration.
 */
export const DEFAULT_MODAL_SWIPE_CONFIG: ModalSwipeConfig = {
  enabled: true,
  directions: [DEFAULT_MODAL_SWIPE_DIRECTION],
  threshold: DEFAULT_MODAL_SWIPE_THRESHOLD,
  bounceSpringConfig: DEFAULT_MODAL_BOUNCE_SPRING_CONFIG,
  bounceOpacityThreshold: DEFAULT_MODAL_BOUNCE_OPACITY_THRESHOLD,
};

/**
 * Normalizes animation configuration by providing defaults for missing properties.
 * @param config - Partial animation configuration or animation type string.
 * @returns Complete animation configuration with defaults applied.
 */
export function normalizeAnimationConfig(
  config: Partial<ModalAnimationConfigUnion> | ModalAnimation | undefined = {}
): ModalAnimationConfigUnion {
  // Handle string type (legacy support)
  if (typeof config === 'string') {
    return DEFAULT_MODAL_ANIMATION_CONFIGS[
      config as keyof typeof DEFAULT_MODAL_ANIMATION_CONFIGS
    ];
  }

  const type = (config as any)?.type || 'fade';

  // For custom animation, validate required fields
  if (type === 'custom') {
    const customConfig = config as Partial<CustomAnimationConfig>;
    return {
      type: 'custom',
      duration: DEFAULT_MODAL_ANIMATION_DURATION,
      ...customConfig,
    } as CustomAnimationConfig;
  }

  const defaultConfig =
    DEFAULT_MODAL_ANIMATION_CONFIGS[
      type as keyof typeof DEFAULT_MODAL_ANIMATION_CONFIGS
    ];
  return {
    ...defaultConfig,
    ...config,
  } as ModalAnimationConfigUnion;
}

/**
 * Normalizes backdrop configuration by providing defaults for missing properties.
 * @param backdrop - Backdrop configuration.
 * @returns Normalized backdrop information with enabled flag and config.
 */
export function normalizeBackdropConfig(
  backdrop:
    | ModalBackdropConfig
    | ReactNode
    | false = DEFAULT_MODAL_BACKDROP_CONFIG
): {
  enabled: boolean;
  isCustom: boolean;
  config: ModalBackdropConfig;
  customRenderer?: ReactNode;
} {
  // false - no backdrop
  if (backdrop === false) {
    return {
      enabled: false,
      isCustom: false,
      config: { ...DEFAULT_MODAL_BACKDROP_CONFIG, enabled: false },
    };
  }

  // ReactNode - custom renderer
  if (backdrop && typeof backdrop === 'object' && 'type' in backdrop) {
    return {
      enabled: true,
      isCustom: true,
      config: DEFAULT_MODAL_BACKDROP_CONFIG,
      customRenderer: backdrop,
    };
  }

  // object or undefined - use config with defaults
  const config = {
    ...DEFAULT_MODAL_BACKDROP_CONFIG,
    ...(backdrop as ModalBackdropConfig),
  };
  return {
    enabled: config.enabled !== false,
    isCustom: false,
    config,
  };
}

/**
 * Normalizes swipe configuration by providing defaults for missing properties.
 * @param config - Partial swipe configuration.
 * @returns Complete swipe configuration with defaults applied.
 */
export function normalizeSwipeConfig(
  config: ModalSwipeConfig | false = {}
): ModalSwipeConfig {
  if (config === false) return { enabled: false };
  return {
    ...DEFAULT_MODAL_SWIPE_CONFIG,
    ...config,
  };
}

/**
 * Extracts swipe directions from swipe config or animation config fallback.
 */
export function getSwipeDirections(
  swipeConfig: ModalSwipeConfig,
  animationConfig?: ModalAnimationConfigUnion,
  fallback: SwipeDirection | SwipeDirection[] = DEFAULT_MODAL_SWIPE_DIRECTION
): SwipeDirection[] {
  // If swipe config has directions, use them
  if (swipeConfig.directions && swipeConfig.directions.length > 0) {
    return swipeConfig.directions;
  }

  // Fallback to animation config for slide animations
  if (
    animationConfig &&
    animationConfig.type === 'slide' &&
    animationConfig.direction
  ) {
    if (typeof animationConfig.direction === 'string') {
      return [animationConfig.direction];
    }

    const endDirections = animationConfig.direction.end;
    return Array.isArray(endDirections) ? endDirections : [endDirections];
  }

  return Array.isArray(fallback) ? fallback : [fallback];
}

/**
 * Gets the slide-in direction from animation config.
 */
export function getSlideInDirection(
  animationConfig: ModalAnimationConfigUnion,
  fallback: SwipeDirection = DEFAULT_MODAL_SWIPE_DIRECTION
): SwipeDirection {
  if (animationConfig.type === 'slide' && animationConfig.direction) {
    if (typeof animationConfig.direction === 'string') {
      return animationConfig.direction;
    }

    return animationConfig.direction.start;
  }

  return fallback;
}
