import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Content } from './Content';

const App = () => {
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <Content />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
