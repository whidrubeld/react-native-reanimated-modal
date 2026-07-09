import { render } from '@testing-library/react-native';
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
        if (event === 'hardwareBackPress') backPressHandler = handler;
        return { remove: jest.fn() };
      });
  });

  afterEach(() => {
    Platform.OS = originalOS;
    jest.restoreAllMocks();
  });

  it('calls onBackButtonPress instead of the default close when provided', () => {
    const onBackButtonPress = jest.fn();
    const onHide = jest.fn();
    render(
      <Modal visible onBackButtonPress={onBackButtonPress} onHide={onHide}>
        <TestContent />
      </Modal>
    );

    expect(backPressHandler).toBeDefined();
    const handled = backPressHandler!();

    expect(handled).toBe(true);
    expect(onBackButtonPress).toHaveBeenCalledTimes(1);
    expect(onHide).not.toHaveBeenCalled();
  });

  it('registers a back handler and intercepts even when closable is false', () => {
    const onBackButtonPress = jest.fn();
    render(
      <Modal visible closable={false} onBackButtonPress={onBackButtonPress}>
        <TestContent />
      </Modal>
    );

    expect(backPressHandler).toBeDefined();
    const handled = backPressHandler!();

    expect(handled).toBe(true);
    expect(onBackButtonPress).toHaveBeenCalledTimes(1);
  });

  it('does not register a back handler on non-Android platforms', () => {
    Platform.OS = 'ios';
    render(
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
