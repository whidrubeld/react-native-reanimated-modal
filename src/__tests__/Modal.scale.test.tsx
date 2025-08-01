import { render } from '@testing-library/react-native';
import { Modal } from '../component';

describe('Modal Scale Animation', () => {
  it('should render modal with scale animation', () => {
    const { getByTestId } = render(
      <Modal visible={true} animation="scale">
        <></>
      </Modal>
    );

    expect(getByTestId('modal-container')).toBeTruthy();
    expect(getByTestId('modal-content')).toBeTruthy();
  });

  it('should apply scale animation properties', () => {
    const { getByTestId } = render(
      <Modal visible={true} animation="scale" animationDuration={500}>
        <></>
      </Modal>
    );

    const content = getByTestId('modal-content');
    expect(content).toBeTruthy();
  });

  it('should support scale animation with custom duration', () => {
    const { getByTestId } = render(
      <Modal
        visible={true}
        animation="scale"
        animationDuration={600}
        swipeDirection="down"
      >
        <></>
      </Modal>
    );

    expect(getByTestId('modal-content')).toBeTruthy();
  });
});
