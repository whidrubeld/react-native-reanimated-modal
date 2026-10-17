import { render, fireEvent, within } from './test-utils';
import { Text } from 'react-native';
import { Modal } from '../index';

describe('Modal', () => {
  it('does not render content when visible is false', async () => {
    const { queryByTestId } = await render(
      <Modal visible={false}>
        <TestContent />
      </Modal>
    );
    // Content should not be in the tree
    expect(queryByTestId('modal-content')).toBeNull();
  });

  it('renders children when visible is true', async () => {
    const { getByTestId } = await render(
      <Modal visible={true}>
        <TestContent />
      </Modal>
    );
    // Check that text is inside modal-content
    expect(
      within(getByTestId('modal-content')).getByText('Test Modal Content')
    ).toBeTruthy();
  });

  it('calls onBackdropPress when backdrop is pressed', async () => {
    const onBackdropPress = jest.fn();
    const { getByTestId } = await render(
      <Modal visible={true} onBackdropPress={onBackdropPress}>
        <TestContent />
      </Modal>
    );
    // backdrop is a Pressable with style absolute
    await fireEvent.press(getByTestId('modal-backdrop'));
    expect(onBackdropPress).toHaveBeenCalled();
  });

  it('does not render backdrop if backdrop is false', async () => {
    const { queryByTestId } = await render(
      <Modal visible={true} backdrop={false}>
        <TestContent />
      </Modal>
    );
    expect(queryByTestId('modal-backdrop')).toBeNull();
  });
});

function TestContent() {
  return <Text>Test Modal Content</Text>;
}
