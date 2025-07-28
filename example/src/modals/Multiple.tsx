/* eslint-disable react-native/no-inline-styles */
import { useState } from 'react';
import { Button, Text, View } from 'react-native';
import { Modal } from 'react-native-reanimated-modal';
import styles from './styles';

export default function MultipleModal({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}) {
  const [secondaryVisible, setSecondaryVisible] = useState(false);

  return (
    <>
      <Modal
        visible={visible}
        coverScreen
        swipeDirection={['up', 'down', 'left', 'right']}
        onHide={() => setVisible(false)}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Primary Modal</Text>
          <Text style={styles.description}>
            This is the primary modal in a multi-modal setup. You can open a
            secondary modal on top of this one.
          </Text>
          <View style={styles.buttonGroup}>
            <Button
              title="Open secondary modal"
              onPress={() => setSecondaryVisible(true)}
            />
            <Button title="Close" onPress={() => setVisible(false)} />
          </View>
        </View>
      </Modal>
      <Modal
        visible={secondaryVisible}
        coverScreen
        swipeDirection={['left', 'down', 'right', 'up']}
        onHide={() => setSecondaryVisible(false)}
      >
        <View style={[styles.container, { margin: 50 }]}>
          <Text style={styles.title}>Secondary Modal</Text>
          <Text style={styles.description}>
            This is the secondary modal that appears on top of the primary
            modal. It demonstrates multi-modal functionality.
          </Text>
          <View style={styles.buttonGroup}>
            <Button title="Close" onPress={() => setSecondaryVisible(false)} />
          </View>
        </View>
      </Modal>
    </>
  );
}
