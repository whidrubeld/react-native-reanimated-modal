import { render, waitFor } from './test-utils';
import { Text, BackHandler, Platform } from 'react-native';
import { Modal } from '../index';

describe('Modal hardware back button (Android)', () => {
  let backPressHandler: (() => boolean | null | undefined) | undefined;
  const originalOS = Platform.OS;

  beforeEach(() => {
    Platform.OS = 'android';
    backPressHandler = undefined;
    jest
      .spyOn(BackHandler, 'addEventListener')
      .mockImplementation((event, handler) => {
        if (event === 'hardwareBackPress')
          backPressHandler = handler as () => boolean | null | undefined;
        return { remove: jest.fn() };
      });
  });

  afterEach(() => {
    Platform.OS = originalOS;
    jest.restoreAllMocks();
  });

  it('calls onBackButtonPress instead of the default close when provided', async () => {
    const onBackButtonPress = jest.fn();
    const onHide = jest.fn();
    await render(
      <Modal visible onBackButtonPress={onBackButtonPress} onHide={onHide}>
        <TestContent />
      </Modal>
    );

    expect(backPressHandler).toBeDefined();
    // Back presses are only intercepted once the opening animation has
    // finished; until then the handler returns false without side effects.
    await waitFor(() => expect(backPressHandler!()).toBe(true));

    expect(onBackButtonPress).toHaveBeenCalledTimes(1);
    expect(onHide).not.toHaveBeenCalled();
  });

  it('registers a back handler and intercepts even when closable is false', async () => {
    const onBackButtonPress = jest.fn();
    await render(
      <Modal visible closable={false} onBackButtonPress={onBackButtonPress}>
        <TestContent />
      </Modal>
    );

    expect(backPressHandler).toBeDefined();
    await waitFor(() => expect(backPressHandler!()).toBe(true));

    expect(onBackButtonPress).toHaveBeenCalledTimes(1);
  });

  it('does not register a back handler on non-Android platforms', async () => {
    Platform.OS = 'ios';
    await render(
      <Modal visible onBackButtonPress={jest.fn()} onHide={jest.fn()}>
        <TestContent />
      </Modal>
    );

    expect(backPressHandler).toBeUndefined();
  });
});

function TestContent() {
  return <Text>Test Modal Content</Text>;
}
