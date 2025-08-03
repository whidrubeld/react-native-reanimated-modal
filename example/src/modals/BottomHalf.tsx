import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { Modal } from 'react-native-reanimated-modal';
import { baseStyles } from './styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import Button from './Button';

export default function BottomHalfModal({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}) {
  const insets = useSafeAreaInsets();

  const containerStyles = useMemo<ViewStyle[]>(
    () => [
      baseStyles.container,
      styles.container,
      {
        paddingBottom: insets.bottom > 30 ? insets.bottom : 30,
      },
    ],
    [insets.bottom]
  );

  return (
    <Modal
      visible={visible}
      swipeConfig={{ directions: ['down'], threshold: 150 }}
      style={styles.root}
      animationConfig={{ animation: 'slide', duration: 500 }}
      onHide={() => setVisible(false)}
    >
      <StatusBar style="light" animated />
      <View style={styles.grabWrapper}>
        <View style={styles.grap} />
      </View>
      <View style={containerStyles}>
        <View style={styles.content}>
          <Text style={styles.emoji}>👋</Text>
          <Text style={baseStyles.title}>Bottom Half Modal</Text>
          <Text style={baseStyles.description}>
            This modal appears at the bottom half of the screen. It is designed
            to be used for quick actions or additional information without
            taking up the entire screen.
          </Text>
        </View>
        <Button title="Close" onPress={() => setVisible(false)} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { justifyContent: 'flex-end' },
  grabWrapper: {
    paddingTop: 50,
    paddingBottom: 8,
    alignItems: 'center',
    opacity: 0.5,
  },
  grap: {
    backgroundColor: 'white',
    height: 6,
    width: 40,
    borderRadius: 3,
  },
  container: {
    justifyContent: 'center',
    padding: 30,
    margin: 0,
    borderRadius: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  content: { marginVertical: 20, gap: 10 },
  emoji: { textAlign: 'center', fontSize: 48, marginBottom: 10 },
});
