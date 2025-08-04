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
  variant?: 'primary' | 'secondary' | 'outline';
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        {
          opacity: pressed ? 0.5 : 1,
          transform: [{ scale: pressed ? 0.975 : 1 }],
        },
        disabled && styles.disabledButton,
        variant === 'secondary' && styles.secondaryButton,
        variant === 'outline' && styles.outlineButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          styles.text,
          variant === 'secondary' && styles.secondaryText,
          variant === 'outline' && styles.outlineText,
        ]}
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
  outlineButton: {
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: 'transparent',
  },
  disabledButton: {
    opacity: 0.75,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  secondaryText: {
    color: '#000000',
  },
  outlineText: {
    color: '#000000',
  },
});
