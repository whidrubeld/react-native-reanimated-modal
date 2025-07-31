import {
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type ViewStyle,
} from 'react-native';
import { Modal } from 'react-native-reanimated-modal';
import { baseStyles } from './styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLayoutEffect, useMemo } from 'react';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const TIMER_MS = 5 * 1e3;

export default function AlertModal({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}) {
  const inests = useSafeAreaInsets();

  const { width: windowWidth } = useWindowDimensions();
  const maxWidth = useMemo(() => windowWidth - 30 * 2, [windowWidth]);

  const progressVisible = useSharedValue(1);
  const progress = useSharedValue(0);

  const wrapperStyles = useMemo<ViewStyle>(
    () => ({
      marginBottom: inests.bottom > 30 ? inests.bottom : 30,
      marginHorizontal: 'auto',
      width: maxWidth,
    }),
    [inests, maxWidth]
  );
  const progressLineStyles = useAnimatedStyle(() => ({
    opacity: interpolate(progressVisible.value, [1, 0], [1, 0]),
    width: interpolate(progress.value, [1, 0], [maxWidth, 0]),
  }));

  useAnimatedReaction(
    () => progress.value,
    (value) => {
      if (progressVisible.value < 1 || !visible || value < 1) return;
      runOnJS(setVisible)(false);
    }
  );
  useLayoutEffect(() => {
    if (!visible) {
      progress.value = 0;
      progressVisible.value = 1;
      return;
    }
    progress.value = withTiming(1, { duration: TIMER_MS });
  }, [visible, progress, progressVisible]);

  return (
    <Modal
      visible={visible}
      style={styles.root}
      swipeDirection={['down', 'left', 'right']}
      hasBackdrop={false}
      coverScreen // NOTE: need for pointer events
      onHide={() => setVisible(false)}
    >
      <View
        style={wrapperStyles}
        onTouchMove={() =>
          (progressVisible.value = withTiming(0, { duration: 5e2 }))
        }
      >
        <View style={styles.wrapper}>
          <View style={styles.alert}>
            <Text style={[baseStyles.title, styles.title]}>
              ⚠️ Notification alert
            </Text>
            <Text style={[baseStyles.description, styles.description]}>
              This modal is designed to display alerts or important messages. It
              can be used to inform users about critical actions or
              confirmations.
            </Text>
            <View style={styles.progressWrapper}>
              <Animated.View style={[styles.progress, progressLineStyles]} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { justifyContent: 'flex-end' },
  wrapper: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    borderRadius: 10,
  },
  alert: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    gap: 5,
    overflow: 'hidden',
  },
  title: { textAlign: 'left', fontSize: 16, fontWeight: '700' },
  description: { textAlign: 'left' },
  progressWrapper: {
    ...StyleSheet.absoluteFillObject,
    top: undefined,
  },
  progress: {
    height: 4,
    backgroundColor: '#f6ad55',
  },
});
