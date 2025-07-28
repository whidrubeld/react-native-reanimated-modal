import { render, within } from '@testing-library/react-native';
import { Modal } from '../index';

describe('Modal basic', () => {
  it('does not render content when visible is false', () => {
    const { queryByTestId } = render(
      <Modal visible={false}>
        <TestContent />
      </Modal>
    );
    expect(queryByTestId('modal-content')).toBeNull();
  });

  it('renders children when visible is true', () => {
    const { getByTestId } = render(
      <Modal visible={true}>
        <TestContent />
      </Modal>
    );

    expect(
      within(getByTestId('modal-content')).getByText('Test Modal Content')
    ).toBeTruthy();
  });
});

function TestContent() {
  return <>{'Test Modal Content'}</>;
}
