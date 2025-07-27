import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    margin: 30,
    borderRadius: 15,
    gap: 10,
    textAlign: 'center',
  },
  title: { fontSize: 18, fontWeight: 600, textAlign: 'center' },
  description: { textAlign: 'center' },
  buttonGroup: {
    gap: 5,
    marginTop: 5,
    marginBottom: -5,
  },
});
