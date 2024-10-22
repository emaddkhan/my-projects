import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AccountScreen from '../Screens/AccountScreen';
import RegisterScreen from '../Screens/RegisterScreen';

const Stack = createNativeStackNavigator();
const LoginNavigater = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen  options={{ headerShown: false }}  name='AccountScreen' component={AccountScreen}/>
      <Stack.Screen  options={{ headerShown: false }}  name='RegisterScreen' component={RegisterScreen}/>
    </Stack.Navigator>
  )
}

export default LoginNavigater