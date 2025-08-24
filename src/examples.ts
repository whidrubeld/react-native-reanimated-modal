import type { ModalAnimationConfig, ModalSwipeConfig } from './types';
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
  type: 'fade',
  duration: 400,
};

export const slideAnimation: ModalAnimationConfig<'slide'> = {
  type: 'slide',
  duration: 500,
  direction: 'up', // Simple direction
};

export const slideAnimationAdvanced: ModalAnimationConfig<'slide'> = {
  type: 'slide',
  duration: 600,
  direction: {
    start: 'down', // Slides in from bottom
    end: ['down', 'right'], // Can be dismissed by swiping down or right
  },
};

export const scaleAnimation: ModalAnimationConfig<'scale'> = {
  type: 'scale',
  duration: 350,
  scaleFactor: 0.7, // Starts from 70% size
};

export const customScaleAnimation: ModalAnimationConfig<'scale'> = {
  type: 'scale',
  duration: 700,
  scaleFactor: DEFAULT_MODAL_SCALE_FACTOR, // Use default scale factor
};

/**
 * Examples of swipe configurations
 */

export const basicSwipeConfig: ModalSwipeConfig = {
  enabled: true,
  threshold: DEFAULT_MODAL_SWIPE_THRESHOLD,
};

export const advancedSwipeConfig: ModalSwipeConfig = {
  enabled: true,
  threshold: 80,
  directions: ['up', 'down'], // Can be dismissed by swiping up or down
  bounceSpringConfig: DEFAULT_MODAL_BOUNCE_SPRING_CONFIG,
  bounceOpacityThreshold: 0.1,
};

export const disabledSwipeConfig: ModalSwipeConfig = {
  enabled: false,
};
