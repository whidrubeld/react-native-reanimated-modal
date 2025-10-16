import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Content } from './Content';
import { StatusBar } from 'expo-status-bar';

const App = () => {
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Content />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
