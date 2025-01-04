import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import BottomNavigationHandler from './BottomNavigationHandler';
import LoginNavigator from './LoginNavigator';
import { useAuthenticationContext } from '../ContextApis/Authentication/Authentication.context';

function NavigationHandlerComponent() {
    const {isAuthenticated} = useAuthenticationContext();
    // const isAuthenticated =true
  return (
    <NavigationContainer>
     {/* {!isAuthenticated ? <LoginNavigator/>:<RestaurentNavigater/>} */}
     {isAuthenticated ? <BottomNavigationHandler/>:<LoginNavigator/>}

    </NavigationContainer>
  )
}

export default NavigationHandlerComponent
