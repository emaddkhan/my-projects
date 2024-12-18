import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../Screens/HomeScreen';
import ResumeBuilder from '../Screens/ResumeBuilder';

const Stack = createNativeStackNavigator();

const ScreensNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
     <Stack.Screen  options={{ headerShown: false }}  name='Home' component={HomeScreen}/>
     <Stack.Screen 
        name="Resume" 
        component={ResumeBuilder} 
        options={{ title: 'Resume Builder' }}
      />

    </Stack.Navigator>
  )
}

export default ScreensNavigation