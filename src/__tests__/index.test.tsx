import { render, fireEvent } from '@testing-library/react-native';
import { Modal } from '../index';

describe('Modal', () => {
  it('does not render content when visible is false', () => {
    const { queryByText } = render(
      <Modal visible={false}>
        <TestContent />
      </Modal>
    );
    expect(queryByText('Test Modal Content')).toBeNull();
  });

  it('renders children when visible is true', () => {
    const { getByText } = render(
      <Modal visible={true}>
        <TestContent />
      </Modal>
    );
    expect(getByText('Test Modal Content')).toBeTruthy();
  });

  it('calls onBackdropPress when backdrop is pressed', () => {
    const onBackdropPress = jest.fn();
    const { getByTestId } = render(
      <Modal visible={true} onBackdropPress={onBackdropPress}>
        <TestContent />
      </Modal>
    );
    // backdrop is a Pressable with style absolute
    fireEvent.press(getByTestId('modal-backdrop'));
    expect(onBackdropPress).toHaveBeenCalled();
  });

  it('does not render backdrop if hasBackdrop is false', () => {
    const { queryByTestId } = render(
      <Modal visible={true} hasBackdrop={false}>
        <TestContent />
      </Modal>
    );
    expect(queryByTestId('modal-backdrop')).toBeNull();
  });
});

function TestContent() {
  return <>{'Test Modal Content'}</>;
}
