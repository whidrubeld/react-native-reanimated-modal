import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

export default function Button({
  title,
  variant,
  onPress,
  disabled = false,
  style,
}: {
  title: string;
  variant?: 'primary' | 'secondary';
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { opacity: pressed ? 0.75 : 1 },
        disabled && styles.disabledButton,
        variant === 'secondary' && styles.secondaryButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[styles.text, variant === 'secondary' && styles.secondaryText]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#000000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  secondaryButton: {
    backgroundColor: '#00000020',
  },
  disabledButton: {
    opacity: 0.75,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  secondaryText: {
    color: '#000000',
  },
});
