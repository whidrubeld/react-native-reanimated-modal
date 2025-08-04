import { StyleSheet } from 'react-native';

export const baseStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    margin: 30,
    borderRadius: 15,
    gap: 10,
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    textAlign: 'center',
  },
  description: { textAlign: 'center', fontWeight: 400, lineHeight: 20 },
  buttonGroup: {
    gap: 10,
    marginTop: 5,
  },
});
