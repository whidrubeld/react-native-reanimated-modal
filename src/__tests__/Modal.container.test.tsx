import { render } from '@testing-library/react-native';
import { Modal } from '../index';

describe('Modal container', () => {
  it('applies containerTestID to root View', () => {
    const { getByTestId } = render(
      <Modal visible={true} containerTestID="custom-container-test-id">
        <TestContent />
      </Modal>
    );
    expect(getByTestId('custom-container-test-id')).toBeTruthy();
  });
});

function TestContent() {
  return <>{'Test Modal Content'}</>;
}
