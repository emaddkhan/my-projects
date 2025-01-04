import themes from './src/utils/themes';
import 'react-native-gesture-handler';
import styled, { ThemeProvider } from 'styled-components';
import { useFonts, Oswald_400Regular } from "@expo-google-fonts/oswald";
import {
  useFonts as useLatoFont,
  Lato_400Regular,
} from "@expo-google-fonts/lato";
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import "./src/config/fireBaseConfig"
import AuthenticationContextcomponent from './src/ContextApis/Authentication/Authentication.context';
import NavigationHandlerComponent from './src/Navigator/NavigationHandlerComponent';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LocationContextComponent from './src/services/location/location.context';
import IntroScreen from './src/screens/IntroScreen/IntroScreen';
import { useEffect, useState } from 'react';

export default function App() {
  const [introScreen,setIsIntroScreen] = useState(true)
  useEffect(()=>{
    setTimeout(()=>{
      setIsIntroScreen(false)
    },3000)
  })
  
  const [loaded] = useFonts({
    Oswald_400Regular,
  });
  const [latoFontloaded] = useLatoFont({
    Lato_400Regular,
  });
  if(!loaded || !latoFontloaded){
    return null;
  }
  const CustomSafeAreaView = styled(SafeAreaView)`
flex:1;
padding-top: ${StatusBar.currentHeight ? `${StatusBar.currentHeight}px` : '0px'};

`

  return (
    <ThemeProvider theme={themes}>
      <AuthenticationContextcomponent>
        <LocationContextComponent>
          <CustomSafeAreaView>
            <GestureHandlerRootView style={{flex:1}}>
              {introScreen?(<IntroScreen/>):(<NavigationHandlerComponent/>)}
            </GestureHandlerRootView>
          </CustomSafeAreaView>
        </LocationContextComponent>
      </AuthenticationContextcomponent>
    </ThemeProvider>
  );
}

