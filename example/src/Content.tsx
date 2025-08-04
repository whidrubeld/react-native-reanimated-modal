/* eslint-disable react/no-unstable-nested-components */
import { View, StyleSheet, Text } from 'react-native';
import { useState } from 'react';

import BasicModal from './use-cases/Basic';
import MultipleModal from './use-cases/Multiple';
import FullscreenModal from './use-cases/Fullscreen';
import BottomHalfModal from './use-cases/BottomHalf';
import InputModal from './use-cases/Input';
import AlertModal from './use-cases/Alert';
import BlurModal from './use-cases/Blur';
import ScrollModal from './use-cases/Scroll';
import { MaterialIcons } from '@expo/vector-icons';
import { Card } from './primitives/Card';

export const Content = () => {
  const [isBasicVisible, setBasicVisible] = useState(false);
  const [isMultipleVisible, setMultipleVisible] = useState(false);
  const [isInputVisible, setInputVisible] = useState(false);
  const [isScrollVisible, setScrollVisible] = useState(false);
  const [isBlurVisible, setBlurVisible] = useState(false);
  const [isFullVisible, setFullVisible] = useState(false);
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [isHalfVisible, setHalfVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>React Native</Text>
      <Text style={styles.subtitle}>Reanimated Modal</Text>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>Examples</Text>
      </View>
      <View style={styles.cardGroup}>
        <Card
          text="Basic"
          icon="tablet-landscape-outline"
          onPress={() => setBasicVisible(true)}
        />
        <Card
          text="Multiple"
          icon="albums-outline"
          onPress={() => setMultipleVisible(true)}
        />
        <Card
          text="Input"
          icon="create-outline"
          onPress={() => setInputVisible(true)}
        />
        <Card
          text="Scroll"
          icon="reader-outline"
          onPress={() => setScrollVisible(true)}
        />
        <Card
          text="Blur"
          icon={(props) => <MaterialIcons name="blur-on" {...props} />}
          onPress={() => setBlurVisible(true)}
        />
        <Card
          text="Fullscreen"
          icon="resize-outline"
          onPress={() => setFullVisible(true)}
        />
        <Card
          text="Alert"
          icon="warning-outline"
          onPress={() => setAlertVisible(true)}
        />
        <Card
          text="Bottom Half"
          icon="arrow-up-outline"
          onPress={() => setHalfVisible(true)}
        />
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 27,
    fontWeight: '700',
    textAlign: 'center',
    width: '100%',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '300',
    textAlign: 'center',
  },
  labelContainer: {
    marginTop: 5,
    backgroundColor: '#000000',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  label: {
    color: '#ffffff',
    fontWeight: '500',
    fontSize: 12,
  },
  cardGroup: {
    marginTop: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});
