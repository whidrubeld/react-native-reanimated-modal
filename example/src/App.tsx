import { View, StyleSheet, Text } from 'react-native';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useState } from 'react';

import BasicModal from './modals/Basic';
import MultipleModal from './modals/Multiple';
import FullscreenModal from './modals/Fullscreen';
import BottomHalfModal from './modals/BottomHalf';
import InputModal from './modals/Input';
import AlertModal from './modals/Alert';
import BlurModal from './modals/Blur';
import ScrollModal from './modals/Scroll';
import Button from './modals/Button';

const App = () => {
  const [isBasicVisible, setBasicVisible] = useState(false);
  const [isMultipleVisible, setMultipleVisible] = useState(false);
  const [isInputVisible, setInputVisible] = useState(false);
  const [isScrollVisible, setScrollVisible] = useState(false);
  const [isBlurVisible, setBlurVisible] = useState(false);
  const [isFullVisible, setFullVisible] = useState(false);
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [isHalfVisible, setHalfVisible] = useState(false);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Text style={styles.title}>React Native Reanimated Modal Examples</Text>
        <View style={styles.buttonGroup}>
          <Button title="📋 Basic" onPress={() => setBasicVisible(true)} />
          <Button
            title="🔄 Multiple"
            onPress={() => setMultipleVisible(true)}
          />
          <Button title="📝 Input" onPress={() => setInputVisible(true)} />
          <Button title="📜 Scroll" onPress={() => setScrollVisible(true)} />
          <Button title="🔍 Blur" onPress={() => setBlurVisible(true)} />
          <Button title="📱 Fullscreen" onPress={() => setFullVisible(true)} />
          <Button title="⚠️ Alert" onPress={() => setAlertVisible(true)} />
          <Button title="⬆️ Bottom Half" onPress={() => setHalfVisible(true)} />
        </View>

        <BasicModal visible={isBasicVisible} setVisible={setBasicVisible} />
        <MultipleModal
          visible={isMultipleVisible}
          setVisible={setMultipleVisible}
        />
        <InputModal visible={isInputVisible} setVisible={setInputVisible} />
        <ScrollModal visible={isScrollVisible} setVisible={setScrollVisible} />
        <BlurModal visible={isBlurVisible} setVisible={setBlurVisible} />
        <FullscreenModal visible={isFullVisible} setVisible={setFullVisible} />
        <AlertModal visible={isAlertVisible} setVisible={setAlertVisible} />
        <BottomHalfModal visible={isHalfVisible} setVisible={setHalfVisible} />
      </View>
    </SafeAreaProvider>
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
    textAlign: 'center',
    maxWidth: '80%',
  },
  buttonGroup: {
    padding: 20,
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});
