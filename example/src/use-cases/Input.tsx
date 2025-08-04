import { StyleSheet, Text, View } from 'react-native';
import { Modal } from 'react-native-reanimated-modal';
import { baseStyles } from './styles';
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { TextInput } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Button from '../primitives/Button';

export default function InputModal({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}) {
  const { height: keyboardHeight } = useAnimatedKeyboard();
  const inests = useSafeAreaInsets();

  const containerStyles = useAnimatedStyle(() => ({
    marginTop: inests.top,
    marginBottom:
      keyboardHeight.value > inests.bottom + inests.top
        ? keyboardHeight.value - inests.top
        : inests.bottom,
  }));

  return (
    <Modal
      visible={visible}
      animationConfig="slide"
      coverScreen
      contentContainerStyle={styles.root}
      onHide={() => setVisible(false)}
    >
      <StatusBar style="light" animated />
      <Animated.View style={containerStyles}>
        <View style={[baseStyles.container]}>
          <Text style={baseStyles.title}>Input Example</Text>
          <Text style={baseStyles.description}>
            This modal allows you to input text. It will adjust its position
            when the keyboard appears.
          </Text>
          <TextInput
            autoFocus
            spellCheck
            autoCapitalize="words"
            placeholder="Type something..."
            style={styles.input}
            selectionColor="#000000"
          />
          <View style={baseStyles.buttonGroup}>
            <Button title="Close" onPress={() => setVisible(false)} />
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { pointerEvents: 'box-none' },
  input: {
    textAlign: 'center',
    fontSize: 16,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'white',
  },
});
