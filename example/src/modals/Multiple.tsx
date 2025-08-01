import { useState } from 'react';
import { Button, Text, View } from 'react-native';
import { Modal } from 'react-native-reanimated-modal';
import { baseStyles } from './styles';
import { StatusBar } from 'expo-status-bar';

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
        coverScreen // need for multiple modals. RUN multiple modals not working correctly
        swipeConfig={{ directions: ['up', 'down', 'left', 'right'] }}
        onHide={() => setVisible(false)}
      >
        <StatusBar style="light" animated />
        <View style={baseStyles.container}>
          <Text style={baseStyles.title}>🔄 Primary Modal</Text>
          <Text style={baseStyles.description}>
            This is the primary modal in a multi-modal setup. You can open a
            secondary modal on top of this one.
          </Text>
          <View style={baseStyles.buttonGroup}>
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
        coverScreen // need for multiple modals. RUN multiple modals not working correctly
        swipeConfig={{ directions: ['left', 'down', 'right', 'up'] }}
        onHide={() => setSecondaryVisible(false)}
      >
        <View
          style={[
            baseStyles.container,
            // eslint-disable-next-line react-native/no-inline-styles
            { margin: 50 },
          ]}
        >
          <Text style={baseStyles.title}>🔄 Secondary Modal</Text>
          <Text style={baseStyles.description}>
            This is the secondary modal that appears on top of the primary
            modal. It demonstrates multi-modal functionality.
          </Text>
          <View style={baseStyles.buttonGroup}>
            <Button title="Close" onPress={() => setSecondaryVisible(false)} />
          </View>
        </View>
      </Modal>
    </>
  );
}
