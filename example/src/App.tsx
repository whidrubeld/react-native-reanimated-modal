import { View, StyleSheet, Button, Text } from 'react-native';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { useState } from 'react';

import BasicModal from './modals/Basic';
import MultipleModal from './modals/Multiple';
import FullscreenModal from './modals/Fullscreen';
import BottomHalfModal from './modals/BottomHalf';

const App = () => {
  const [isBasicVisible, setBasicVisible] = useState(false);
  const [isMultipleVisible, setMultipleVisible] = useState(false);
  const [isFullscreenVisible, setFullscreenVisible] = useState(false);
  const [isBottomHalfVisible, setBottomHalfVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>React Native Reanimated Modal Examples</Text>
      <Button title="📋 Basic example" onPress={() => setBasicVisible(true)} />
      <Button
        title="🔄 Multiple example"
        onPress={() => setMultipleVisible(true)}
      />
      <Button
        title="📱 Fullscreen example"
        onPress={() => setFullscreenVisible(true)}
      />
      <Button
        title="⬆️ Bottom Half example"
        onPress={() => setBottomHalfVisible(true)}
      />
      <BasicModal isVisible={isBasicVisible} setVisible={setBasicVisible} />
      <MultipleModal
        isVisible={isMultipleVisible}
        setVisible={setMultipleVisible}
      />
      <FullscreenModal
        isVisible={isFullscreenVisible}
        setVisible={setFullscreenVisible}
      />
      <BottomHalfModal
        isVisible={isBottomHalfVisible}
        setVisible={setBottomHalfVisible}
      />
    </View>
  );
};

export default gestureHandlerRootHOC(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    maxWidth: '80%',
  },
});
