import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import CreateRoomScreen from '../screens/CreateRoomScreen';
import JoinRoomScreen from '../screens/JoinRoomScreen';
import RoomScreen from '../screens/RoomScreen';
import AddSongScreen from '../screens/AddSongScreen';
import CreatedRoomListScreen from '../screens/CreatedRoomListScreen';
import PublicRoomListScreen from '../screens/PublicRoomListScreen';
import MusicPlayerScreen from '../screens/MusicPlayerScreen';
import HomeButton from '../components/HomeButton';
import VerifyUserScreen from '../screens/VerifyUserScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="VerifyUser"
        screenOptions={{
          headerStyle: { backgroundColor: '#020214' },
          headerTintColor: '#fff',
          headerRight: () => <HomeButton />,
          title: 'Mini Tunes',
        }}
      >
        <Stack.Screen name="VerifyUser" component={VerifyUserScreen} />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Mini Tunes' }}
        />

        <Stack.Screen
          name="CreateRoom"
          component={CreateRoomScreen}
          options={{ title: 'Host a Lounge' }}
        />
        <Stack.Screen
          name="CreatedRoomList"
          component={CreatedRoomListScreen}
          options={{ title: 'Lounge List' }}
        />

        <Stack.Screen
          name="JoinRoom"
          component={JoinRoomScreen}
          options={{ title: 'Join Lounge' }}
        />

        <Stack.Screen
          name="Room"
          component={RoomScreen}
          options={{ title: 'The Lounge' }}
        />

        <Stack.Screen
          name="AddSong"
          component={AddSongScreen}
          options={{ title: 'Add Song' }}
        />
        <Stack.Screen
          name="MusicPlayer"
          component={MusicPlayerScreen}
          options={{
            title: 'Music Player',
            // headerShown: false,
            unmountOnBlur: false,
          }}
        />

        <Stack.Screen name="PublicRooms" component={PublicRoomListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
