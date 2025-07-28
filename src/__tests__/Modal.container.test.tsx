import { render, within } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Modal } from '../index';

describe('Modal container', () => {
  it('applies containerTestID to root View', () => {
    const { getByTestId } = render(
      <Modal visible={true} containerTestID="custom-container-test-id">
        <TestContent />
      </Modal>
    );
    // Проверяем, что текст есть внутри кастомного containerTestID
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
