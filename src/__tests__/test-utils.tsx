import type { ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export * from '@testing-library/react-native';

/**
 * Renders `ui` inside `GestureHandlerRootView`, as apps do.
 * Gesture Handler 3 throws when a `GestureDetector` has no root view above it.
 */
function renderWithRootView<T>(ui: ReactElement<T>, options?: RenderOptions) {
  return render(ui, { wrapper: GestureHandlerRootView, ...options });
}

export { renderWithRootView as render };
