import React, { useState, useEffect } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import styled, { ThemeProvider } from "styled-components/native";
import AuthenticationContextProvider from "./contextApis/authentication/authentication.context";
import Toast from "react-native-toast-message";
import NavigationHandler from "./navigation/NavigationHandler/NavigationHandler";
import SplashScreen from "./Screens/SplashScreen";
import "./config/firebaseConfig";

const theme = {
  colors: {
    primary: '#0782F9',
    background: '#fff',
    text: '#000',
  },
};

const CustomSafeAreaView = styled(SafeAreaView)`
  flex: 1;
  margin-top: ${(StatusBar.currentHeight || 20)}px;
`;

export default function App() {
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); 
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <AuthenticationContextProvider>
          <CustomSafeAreaView>
            {isLoading ? <SplashScreen /> : <NavigationHandler />}
          </CustomSafeAreaView>
        </AuthenticationContextProvider>
      </NavigationContainer>
      <Toast />
    </ThemeProvider>
  );
}
