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

  it('does not render backdrop if hasBackdrop is false', () => {
    const { queryByTestId } = render(
      <Modal
        visible={true}
        hasBackdrop={false}
        backdropTestID="custom-backdrop-test-id"
      >
        <TestContent />
      </Modal>
    );
    expect(queryByTestId('custom-backdrop-test-id')).toBeNull();
  });
});

function TestContent() {
  return <Text>Test Modal Content</Text>;
}
