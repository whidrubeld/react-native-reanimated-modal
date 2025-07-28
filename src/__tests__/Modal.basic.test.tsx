import { render } from '@testing-library/react-native';
import { Modal } from '../index';

describe('Modal basic', () => {
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
});

function TestContent() {
  return <>{'Test Modal Content'}</>;
}
