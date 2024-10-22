import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../Screens/HomeScreen';

const Stack = createNativeStackNavigator();

const ScreensNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
     <Stack.Screen  options={{ headerShown: false }}  name='Home' component={HomeScreen}/>
    </Stack.Navigator>
  )
}

export default ScreensNavigation