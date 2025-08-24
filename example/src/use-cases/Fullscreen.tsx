import { StyleSheet, Text, View } from 'react-native';
import { Modal } from 'react-native-reanimated-modal';
import { baseStyles } from './styles';
import { StatusBar } from 'expo-status-bar';
import Button from '../primitives/Button';

export default function FullscreenModal({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}) {
  return (
    <Modal
      contentContainerStyle={styles.root}
      visible={visible}
      animation="slide"
      onHide={() => setVisible(false)}
    >
      <StatusBar style="dark" animated />
      <View style={[baseStyles.container, styles.container]}>
        <Text style={baseStyles.title}>Fullscreen Example</Text>
        <Text style={baseStyles.description}>
          This is a fullscreen modal that covers the entire screen. It uses
          contentContainerStyle with flex: 1 to expand to full height and width,
          creating an immersive experience.
        </Text>
        <View style={baseStyles.buttonGroup}>
          <Button title="Close" onPress={() => setVisible(false)} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: {
    margin: 0,
    padding: 30,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
