import { render, within } from './test-utils';
import { Text } from 'react-native';
import { Modal } from '../index';

describe('Modal basic', () => {
  it('does not render content when visible is false', async () => {
    const { queryByTestId } = await render(
      <Modal visible={false}>
        <TestContent />
      </Modal>
    );
    expect(queryByTestId('modal-content')).toBeNull();
  });

  it('renders children when visible is true', async () => {
    const { getByTestId } = await render(
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
  return <Text>Test Modal Content</Text>;
}
