import { Text, View } from 'react-native';
import { Modal } from 'react-native-reanimated-modal';
import { baseStyles } from './styles';
import { StatusBar } from 'expo-status-bar';
import Button from '../primitives/Button';

export default function BasicModal({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}) {
  return (
    <Modal visible={visible} onHide={() => setVisible(false)}>
      <StatusBar style="light" animated />
      <View style={baseStyles.container}>
        <Text style={baseStyles.title}>📋 Basic Modal</Text>
        <Text style={baseStyles.description}>
          This is a basic modal example using react-native-reanimated-modal. You
          can customize it further as per your requirements.
        </Text>
        <View style={baseStyles.buttonGroup}>
          <Button title="Close" onPress={() => setVisible(false)} />
        </View>
      </View>
    </Modal>
  );
}
