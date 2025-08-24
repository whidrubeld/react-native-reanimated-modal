import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Modal } from '../index';

describe('Modal backdrop', () => {
  it('calls onBackdropPress when backdrop is pressed', () => {
    const onBackdropPress = jest.fn();
    const { getByTestId } = render(
      <Modal
        visible={true}
        onBackdropPress={onBackdropPress}
        backdropTestID="custom-backdrop-test-id"
      >
        <TestContent />
      </Modal>
    );
    fireEvent.press(getByTestId('custom-backdrop-test-id'));
    expect(onBackdropPress).toHaveBeenCalled();
  });

  it('does not render backdrop if backdrop is false', () => {
    const { queryByTestId } = render(
      <Modal
        visible={true}
        backdrop={false}
        backdropTestID="custom-backdrop-test-id"
      >
        <TestContent />
      </Modal>
    );
    expect(queryByTestId('custom-backdrop-test-id')).toBeNull();
  });

  it('renders backdrop with custom configuration', () => {
    const { getByTestId } = render(
      <Modal
        visible={true}
        backdrop={{ enabled: true, color: 'red', opacity: 0.5 }}
        backdropTestID="custom-backdrop-test-id"
      >
        <TestContent />
      </Modal>
    );
    expect(getByTestId('custom-backdrop-test-id')).toBeTruthy();
  });

  it('renders custom backdrop renderer', () => {
    const customBackdrop = (
      <Text testID="custom-backdrop-content">Custom Backdrop</Text>
    );
    const { getByTestId } = render(
      <Modal
        visible={true}
        backdrop={customBackdrop}
        backdropTestID="custom-backdrop-test-id"
      >
        <TestContent />
      </Modal>
    );
    expect(getByTestId('custom-backdrop-test-id')).toBeTruthy();
    expect(getByTestId('custom-backdrop-content')).toBeTruthy();
  });
});

function TestContent() {
  return <Text>Test Modal Content</Text>;
}
