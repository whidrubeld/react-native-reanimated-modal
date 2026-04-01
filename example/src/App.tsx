import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Content } from './Content';
import { StatusBar } from 'expo-status-bar';
import { KeyboardProvider } from 'react-native-keyboard-controller';

const App = () => {
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <KeyboardProvider>
          <StatusBar style="dark" />
          <Content />
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
