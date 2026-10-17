import { render, within } from './test-utils';
import { Text } from 'react-native';
import { Modal } from '../index';

describe('Modal container', () => {
  it('applies containerTestID to root View', async () => {
    const { getByTestId } = await render(
      <Modal visible={true} containerTestID="custom-container-test-id">
        <TestContent />
      </Modal>
    );
    // Check that text is inside the custom containerTestID
    expect(
      within(getByTestId('custom-container-test-id')).getByText(
        'Test Modal Content'
      )
    ).toBeTruthy();
  });
});

function TestContent() {
  return <Text>Test Modal Content</Text>;
}
