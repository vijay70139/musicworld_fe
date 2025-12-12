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

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#0b0f15' },
          headerTintColor: 'white',
          headerTitleStyle: { fontSize: 20 },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Music World' }}
        />

        <Stack.Screen
          name="CreateRoom"
          component={CreateRoomScreen}
          options={{ title: 'Create Room' }}
        />
        <Stack.Screen
          name="CreatedRoomList"
          component={CreatedRoomListScreen}
          options={{ title: 'Create Room List' }}
        />

        <Stack.Screen
          name="JoinRoom"
          component={JoinRoomScreen}
          options={{ title: 'Join Room' }}
        />

        <Stack.Screen
          name="Room"
          component={RoomScreen}
          options={{ title: 'Music Room' }}
        />

        <Stack.Screen
          name="AddSong"
          component={AddSongScreen}
          options={{ title: 'Add Song' }}
        />
        <Stack.Screen
          name="MusicPlayer"
          component={MusicPlayerScreen}
          options={{ title: 'Music Player' }}
        />

        <Stack.Screen name="PublicRooms" component={PublicRoomListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
