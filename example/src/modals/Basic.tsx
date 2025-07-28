import { Button, Text, View } from 'react-native';
import { Modal } from 'react-native-reanimated-modal';
import styles from './styles';

export default function BasicModal({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}) {
  return (
    <Modal
      visible={visible}
      animation="fade"
      swipeDirection={['down', 'left', 'right', 'up']}
      onHide={() => setVisible(false)}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Basic Modal</Text>
        <Text style={styles.description}>
          This is a basic modal example using react-native-reanimated-modal. You
          can customize it further as per your requirements.
        </Text>
        <View style={styles.buttonGroup}>
          <Button title="Close" onPress={() => setVisible(false)} />
        </View>
      </View>
    </Modal>
  );
}
