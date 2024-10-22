import { NavigationContainer, ThemeProvider } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeScreen from "./Screens/HomeScreen";
import AccountScreen from "./Screens/AccountScreen";
import styled from "styled-components";
import RegisterScreen from "./Screens/RegisterScreen";
import "./config/firebaseConfig";
import AuthenticationContextProvider from "./contextApis/authentication/authentication.context";
import Toast from "react-native-toast-message";
import NavigationHandler from "./navigation/NavigationHandler/NavigationHandler";

const Stack = createNativeStackNavigator();

const CustomSafeAreaView = styled(SafeAreaView)`
  flex: 1;
  margin-top: ${StatusBar.currentHeight}px;
`;

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <AuthenticationContextProvider>
          <CustomSafeAreaView>
            <NavigationHandler />
          </CustomSafeAreaView>
        </AuthenticationContextProvider>
      </NavigationContainer>
      <Toast />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
