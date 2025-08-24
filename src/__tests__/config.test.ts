import {
  normalizeAnimationConfig,
  getSwipeDirections,
  normalizeBackdropConfig,
} from '../config';
import type { SwipeDirection } from '../types';

describe('Animation Config Utils', () => {
  describe('normalizeAnimationConfig', () => {
    it('should handle string animation types', () => {
      const config = normalizeAnimationConfig('fade');
      expect(config).toEqual({
        type: 'fade',
        duration: 300,
      });
    });

    it('should handle config objects', () => {
      const customConfig = {
        type: 'scale' as const,
        duration: 500,
        scaleFactor: 0.9,
      };
      const config = normalizeAnimationConfig(customConfig);
      expect(config).toEqual(customConfig);
    });

    it('should return default fade config when undefined', () => {
      const config = normalizeAnimationConfig();
      expect(config).toEqual({
        type: 'fade',
        duration: 300,
      });
    });
  });

  describe('getSwipeDirections', () => {
    it('should use directions from ModalSwipeConfig when provided', () => {
      const swipeConfig = {
        directions: ['up', 'left'] as SwipeDirection[],
      };
      const animationConfig = {
        type: 'fade' as const,
        duration: 300,
      };
      const directions = getSwipeDirections(swipeConfig, animationConfig);
      expect(directions).toEqual(['up', 'left']);
    });

    it('should extract directions from slide config with simple direction when ModalSwipeConfig has no directions', () => {
      const swipeConfig = {};
      const animationConfig = {
        type: 'slide' as const,
        direction: 'up' as const,
        duration: 300,
      };
      const directions = getSwipeDirections(swipeConfig, animationConfig);
      expect(directions).toEqual(['up']);
    });

    it('should extract directions from slide config with complex direction when ModalSwipeConfig has no directions', () => {
      const swipeConfig = {};
      const animationConfig = {
        type: 'slide' as const,
        direction: {
          start: 'down' as const,
          end: ['down', 'left'] as ('down' | 'left')[],
        },
        duration: 300,
      };
      const directions = getSwipeDirections(swipeConfig, animationConfig);
      expect(directions).toEqual(['down', 'left']);
    });

    it('should use fallback for non-slide animations when ModalSwipeConfig has no directions', () => {
      const swipeConfig = {};
      const animationConfig = {
        type: 'fade' as const,
        duration: 300,
      };
      const directions = getSwipeDirections(swipeConfig, animationConfig, [
        'up',
        'down',
      ]);
      expect(directions).toEqual(['up', 'down']);
    });

    it('should use default fallback when no directions specified', () => {
      const swipeConfig = {};
      const animationConfig = {
        type: 'fade' as const,
        duration: 300,
      };
      const directions = getSwipeDirections(swipeConfig, animationConfig);
      expect(directions).toEqual(['down']);
    });
  });

  describe('normalizeBackdropConfig', () => {
    it('should handle false value (no backdrop)', () => {
      const result = normalizeBackdropConfig(false);
      expect(result).toEqual({
        enabled: false,
        isCustom: false,
        config: { enabled: false, color: 'black', opacity: 0.7 },
      });
    });

    it('should handle config object', () => {
      const config = { enabled: true, color: 'red', opacity: 0.5 };
      const result = normalizeBackdropConfig(config);
      expect(result).toEqual({
        enabled: true,
        isCustom: false,
        config,
      });
    });

    it('should use defaults when undefined', () => {
      const result = normalizeBackdropConfig();
      expect(result).toEqual({
        enabled: true,
        isCustom: false,
        config: { enabled: true, color: 'black', opacity: 0.7 },
      });
    });
  });
});
