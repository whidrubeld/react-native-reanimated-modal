import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Content } from './Content';

const App = () => {
  return (
    <SafeAreaProvider>
      <Content />
    </SafeAreaProvider>
  );
};

export default gestureHandlerRootHOC(App);
