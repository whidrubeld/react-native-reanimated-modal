/* eslint-disable react-native/no-inline-styles */
import { Button, Text, View } from 'react-native';
import { Modal } from 'react-native-reanimated-modal';
import styles from './styles';

export default function FullscreenModal({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}) {
  return (
    <Modal
      visible={visible}
      onHide={() => setVisible(false)}
      contentContainerStyle={{ flex: 1 }}
    >
      <View
        style={[
          styles.container,
          {
            margin: 0,
            padding: 30,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <Text style={styles.title}>Fullscreen Modal</Text>
        <Text style={styles.description}>
          This is a fullscreen modal that covers the entire screen. It uses
          contentContainerStyle with flex: 1 to expand to full height and width,
          creating an immersive experience.
        </Text>
        <View style={styles.buttonGroup}>
          <Button title="Close" onPress={() => setVisible(false)} />
        </View>
      </View>
    </Modal>
  );
}
