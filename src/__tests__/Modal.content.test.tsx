import { render, within } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Modal } from '../index';

describe('Modal content', () => {
  it('applies contentTestID to Animated.View', () => {
    const { getByTestId } = render(
      <Modal visible={true} contentTestID="custom-content-test-id">
        <TestContent />
      </Modal>
    );
    // Check that text is inside the custom contentTestID
    expect(
      within(getByTestId('custom-content-test-id')).getByText(
        'Test Modal Content'
      )
    ).toBeTruthy();
  });
});

function TestContent() {
  return <Text>Test Modal Content</Text>;
}
