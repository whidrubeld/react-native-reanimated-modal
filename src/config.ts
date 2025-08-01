import type {
  ModalAnimation,
  ModalAnimationConfigUnion,
  SwipeConfig,
  SwipeDirection,
  FadeAnimationConfig,
  SlideAnimationConfig,
  ScaleAnimationConfig,
} from './types';

/**
 * Default values and configurations.
 */
export const DEFAULT_MODAL_ANIMATION_DURATION = 300;
export const DEFAULT_MODAL_SCALE_FACTOR = 0.8;
export const DEFAULT_MODAL_BACKDROP_OPACITY = 0.7;
export const DEFAULT_MODAL_BACKDROP_COLOR = 'black';
export const DEFAULT_MODAL_SWIPE_THRESHOLD = 100;
export const DEFAULT_MODAL_BOUNCE_OPACITY_THRESHOLD = 0.05;

export const DEFAULT_MODAL_BOUNCE_SPRING_CONFIG = {
  stiffness: 200,
  dampingRatio: 0.5,
  duration: 700,
} as const;

/**
 * Default animation configurations.
 */
export const DEFAULT_MODAL_ANIMATION_CONFIGS = {
  fade: {
    animation: 'fade',
    duration: DEFAULT_MODAL_ANIMATION_DURATION,
  } as FadeAnimationConfig,
  slide: {
    animation: 'slide',
    duration: DEFAULT_MODAL_ANIMATION_DURATION,
    direction: 'down',
  } as SlideAnimationConfig,
  scale: {
    animation: 'scale',
    duration: DEFAULT_MODAL_ANIMATION_DURATION,
    scaleFactor: DEFAULT_MODAL_SCALE_FACTOR,
  } as ScaleAnimationConfig,
} as const;

/**
 * Default swipe configuration.
 */
export const DEFAULT_MODAL_SWIPE_CONFIG: SwipeConfig = {
  enabled: true,
  directions: [],
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
 * Normalizes swipe configuration by providing defaults for missing properties.
 * @param config - Partial swipe configuration.
 * @returns Complete swipe configuration with defaults applied.
 */
export function normalizeSwipeConfig(
  config: Partial<SwipeConfig> = {}
): SwipeConfig {
  return {
    ...DEFAULT_MODAL_SWIPE_CONFIG,
    ...config,
  };
}

/**
 * Extracts swipe directions from swipe config or animation config fallback.
 */
export function getSwipeDirections(
  swipeConfig: SwipeConfig,
  animationConfig?: ModalAnimationConfigUnion,
  fallback: SwipeDirection | SwipeDirection[] = 'down'
): SwipeDirection[] {
  // If swipe config has directions, use them
  if (swipeConfig.directions && swipeConfig.directions.length > 0) {
    return swipeConfig.directions;
  }

  // Fallback to animation config for slide animations
  if (
    animationConfig &&
    animationConfig.animation === 'slide' &&
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
  fallback: SwipeDirection = 'down'
): SwipeDirection {
  if (animationConfig.animation === 'slide' && animationConfig.direction) {
    if (typeof animationConfig.direction === 'string') {
      return animationConfig.direction;
    }

    return animationConfig.direction.start;
  }

  return fallback;
}
