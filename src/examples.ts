import type { ModalAnimationConfig, SwipeConfig } from './types';
import {
  DEFAULT_MODAL_SCALE_FACTOR,
  DEFAULT_MODAL_SWIPE_THRESHOLD,
  DEFAULT_MODAL_BOUNCE_SPRING_CONFIG,
} from './config';

/**
 * Examples of animation configurations
 */

// Fade animation configuration
export const fadeAnimation: ModalAnimationConfig<'fade'> = {
  animation: 'fade',
  duration: 400,
};

export const slideAnimation: ModalAnimationConfig<'slide'> = {
  animation: 'slide',
  duration: 500,
  direction: 'up', // Simple direction
};

export const slideAnimationAdvanced: ModalAnimationConfig<'slide'> = {
  animation: 'slide',
  duration: 600,
  direction: {
    start: 'down', // Slides in from bottom
    end: ['down', 'right'], // Can be dismissed by swiping down or right
  },
};

export const scaleAnimation: ModalAnimationConfig<'scale'> = {
  animation: 'scale',
  duration: 350,
  scaleFactor: 0.7, // Starts from 70% size
};

export const customScaleAnimation: ModalAnimationConfig<'scale'> = {
  animation: 'scale',
  duration: 700,
  scaleFactor: DEFAULT_MODAL_SCALE_FACTOR, // Use default scale factor
};

/**
 * Examples of swipe configurations
 */

export const basicSwipeConfig: SwipeConfig = {
  enabled: true,
  threshold: DEFAULT_MODAL_SWIPE_THRESHOLD,
};

export const advancedSwipeConfig: SwipeConfig = {
  enabled: true,
  threshold: 80,
  bounceSpringConfig: DEFAULT_MODAL_BOUNCE_SPRING_CONFIG,
  bounceOpacityThreshold: 0.1,
};

export const disabledSwipeConfig: SwipeConfig = {
  enabled: false,
};
