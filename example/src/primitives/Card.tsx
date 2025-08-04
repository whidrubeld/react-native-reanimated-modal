import { StyleSheet, Text, Pressable, useWindowDimensions } from 'react-native';
import { type ReactNode } from 'react';

import Ionicons from '@expo/vector-icons/Ionicons';

export const Card = ({
  text,
  icon,
  onPress,
}: {
  text: string;
  icon: string | ((props: any) => ReactNode);
  onPress: () => void;
}) => {
  const { width } = useWindowDimensions();
  const cardWidth = (width - 20 * 3) / 2;

  const iconProps = {
    size: 36,
    color: '#000000',
    style: styles.cardIcon,
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        {
          opacity: pressed ? 0.5 : 1,
          transform: [{ scale: pressed ? 0.975 : 1 }],
          width: cardWidth,
        },
      ]}
      onPress={onPress}
    >
      {typeof icon === 'function' ? (
        icon(iconProps)
      ) : (
        <Ionicons name={icon as any} {...iconProps} />
      )}
      <Text style={styles.cardText}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#dddddd',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.075,
    shadowRadius: 10,
    elevation: 3,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    gap: 10,
  },
  cardText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  cardIcon: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 2,
  },
});
