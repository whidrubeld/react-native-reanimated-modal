/* eslint-disable react-native/no-inline-styles */
import { Button, Text, useWindowDimensions, View } from 'react-native';
import { Modal } from 'react-native-reanimated-modal';
import styles from './styles';

export default function BottomHalfModal({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}) {
  const { height } = useWindowDimensions();

  return (
    <Modal
      visible={visible}
      swipeDirection="down"
      style={{ justifyContent: 'flex-end' }}
      swipeThreshold={150}
      animationDuration={5e2}
      onHide={() => setVisible(false)}
    >
      <View
        style={{
          paddingTop: 50,
          paddingBottom: 8,
          alignItems: 'center',
          opacity: 0.5,
        }}
      >
        <View
          style={{
            backgroundColor: 'white',
            height: 6,
            width: 40,
            borderRadius: 3,
          }}
        />
      </View>
      <View
        style={[
          styles.container,
          {
            justifyContent: 'center',
            padding: 30,
            height: height * 0.5,
            margin: 0,
            borderRadius: 27,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          },
        ]}
      >
        <Text style={{ textAlign: 'center', fontSize: 48, marginTop: 'auto' }}>
          👋
        </Text>
        <Text style={styles.title}>Bottom Half Modal</Text>
        <Text style={styles.description}>
          This modal appears at the bottom half of the screen. It is designed to
          be used for quick actions or additional information without taking up
          the entire screen.
        </Text>
        <View
          style={[styles.buttonGroup, { marginTop: 'auto', marginBottom: 15 }]}
        >
          <Button title="Close" onPress={() => setVisible(false)} />
        </View>
      </View>
    </Modal>
  );
}
