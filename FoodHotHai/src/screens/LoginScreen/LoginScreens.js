import { StatusBar } from 'expo-status-bar';
import React, { useContext, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components';
import { colors } from '../../utils/themes/colors';
import { Button, TextInput } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import {
  AccountBackground,
  AccountCover,
  AccountCoverInsideContaine,
  OrText,
} from '../AccountsScreens/Account.Style';
import TextComponents from '../../components/TextComponent/TextComponents';
import { AuthenticationContext } from '../../ContextApis/Authentication/Authentication.context';

const Title = styled(Text)`
  font-size: ${(props) => props.theme.sizes[3]};
  font-weight: ${(props) => props.theme.fontWeights.regular};
  font-family: ${(props) => props.theme.fonts.body};
  color: ${colors.brand.white};
  padding-top: 65px;
  padding-left: 24%;
`;

const CustomSafeAreaView = styled(SafeAreaView)`
  flex: 1;
  padding-top: ${StatusBar.currentHeight ? `${StatusBar.currentHeight}px` : '0px'};
`;

const ErrorContainer = styled(View)`
  padding: 10px;
  margin-bottom: 15px;
  background-color: ${colors.text.error};
  border-radius: 5px;
`;

const LoginScreens = ({ navigation }) => {
  const { loading, onLogin, error } = useContext(AuthenticationContext);
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
  });

  const buttonColor = '#6200ee';

  return (
    <AccountBackground>
      <AccountCover />
      <Title>Login Screen</Title>
      <AccountCoverInsideContaine>
        <TextInput
          label="Email"
          underlineColor={buttonColor}
          activeUnderlineColor={buttonColor}
          keyboardType="email-address"
          textContentType="emailAddress"
          autoCapitalize="none"
          value={loginInfo.email}
          onChangeText={(text) => setLoginInfo({ ...loginInfo, email: text })}
        />

        <TextInput
          label="Password"
          underlineColor={buttonColor}
          activeUnderlineColor={buttonColor}
          secureTextEntry
          textContentType="password"
          autoCapitalize="none"
          value={loginInfo.password}
          onChangeText={(text) => setLoginInfo({ ...loginInfo, password: text })}
        />

        {error && (
          <TextComponents variant="error">{error}</TextComponents>
        )}

        <Button
          icon={() => <MaterialIcons name="login" size={20} color="#fff" />}
          mode="contained"
          onPress={() => onLogin(loginInfo)
          }
          loading={loading}

        >
          Login
        </Button>

        <Button
          icon={() => <MaterialIcons name="arrow-back" size={20} color="#fff" />}
          mode="contained"
          onPress={() => navigation.navigate('Home')}
        >
          Back
        </Button>
      </AccountCoverInsideContaine>
    </AccountBackground>
  );
};

export default LoginScreens;
