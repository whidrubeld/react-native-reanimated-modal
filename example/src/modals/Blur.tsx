import { Button, StyleSheet, Text, View } from 'react-native';
import { Modal } from 'react-native-reanimated-modal';
import { baseStyles } from './styles';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';

export default function BlurModal({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}) {
  return (
    <Modal
      visible={visible}
      renderBackdrop={() => (
        <BlurView
          tint="systemThickMaterialDark"
          experimentalBlurMethod="dimezisBlurView"
          intensity={30}
          style={StyleSheet.absoluteFillObject}
        />
      )}
      onHide={() => setVisible(false)}
    >
      <StatusBar style="dark" animated />
      <View style={[baseStyles.container, styles.container]}>
        <Text style={baseStyles.title}>🔍 Blurred Modal</Text>
        <Text style={baseStyles.description}>
          This is blurred modal. You can override the backdrop render to make a
          custom background
        </Text>
        <View style={baseStyles.buttonGroup}>
          <Button title="Close" onPress={() => setVisible(false)} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
});
