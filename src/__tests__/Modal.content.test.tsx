import { render } from '@testing-library/react-native';
import { Modal } from '../index';

describe('Modal content', () => {
  it('applies contentTestID to Animated.View', () => {
    const { getByTestId } = render(
      <Modal visible={true} contentTestID="custom-content-test-id">
        <TestContent />
      </Modal>
    );
    expect(getByTestId('custom-content-test-id')).toBeTruthy();
  });
});

function TestContent() {
  return <>{'Test Modal Content'}</>;
}
