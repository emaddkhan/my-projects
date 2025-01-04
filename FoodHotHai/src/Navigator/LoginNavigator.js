import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react'
import AccountsScreens from '../screens/AccountsScreens/AccountsScreens';
import LoginScreens from '../screens/LoginScreen/LoginScreens';
import RegisterScreen from '../screens/RegisterScreen/RegisterScreen';

function LoginNavigator() {
    const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator 
    screenOptions={{
      headerShown:false,
    }}
    >
      <Stack.Screen name="Home" component={AccountsScreens}  />
      <Stack.Screen name="Login" component={LoginScreens}  />
      <Stack.Screen name="Register" component={RegisterScreen}/>
    </Stack.Navigator>
  )
}

export default LoginNavigator
