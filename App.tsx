// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */

import { SafeAreaProvider } from 'react-native-safe-area-context';

import React from 'react';
import RootNavigator from './src/navigation/RootNavigator';
import { RoomProvider } from './src/context/RoomContext';

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <RoomProvider>
        <RootNavigator />
      </RoomProvider>
    </SafeAreaProvider>
  );
};

export default App;
