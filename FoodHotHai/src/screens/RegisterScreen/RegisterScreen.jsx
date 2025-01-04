import React, { useContext, useState } from 'react';
import { Text } from 'react-native';
import styled from 'styled-components';
import { colors } from '../../utils/themes/colors';
import { Button, TextInput } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { AccountBackground, AccountCover, AccountCoverInsideContaine } from '../AccountsScreens/Account.Style';
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

const RegisterScreen = ({ navigation }) => {
  const buttonColor = '#6200ee';
  const { loading, onRegister, error } = useContext(AuthenticationContext);
  const [registerInfo, setRegisterInfo] = useState({
    email: "",
    password: "",
    confirmPassword: "", // Fix the typo here
  });

  const handleRegister = () => {
    if (registerInfo.password !== registerInfo.confirmPassword) { // Match with state key
      console.log("Passwords do not match");
      return;
    }
    onRegister(registerInfo);
  };

  return (
    <AccountBackground>
      <AccountCover />
      <Title>Register Screen</Title>
      <AccountCoverInsideContaine>
        <TextInput
          label="Email"
          underlineColor={buttonColor}
          activeUnderlineColor={buttonColor}
          keyboardType="email-address"
          textContentType="emailAddress"
          autoCapitalize="none"
          value={registerInfo.email}
          onChangeText={(text) => setRegisterInfo({ ...registerInfo, email: text })}
        />

        <TextInput
          label="Password"
          underlineColor={buttonColor}
          activeUnderlineColor={buttonColor}
          secureTextEntry
          textContentType="password"
          autoCapitalize="none"
          value={registerInfo.password}
          onChangeText={(text) => setRegisterInfo({ ...registerInfo, password: text })}
        />

        <TextInput
          label="Confirm Password"
          underlineColor={buttonColor}
          activeUnderlineColor={buttonColor}
          secureTextEntry
          textContentType="password"
          value={registerInfo.confirmPassword} // Fix the typo here
          onChangeText={(text) => setRegisterInfo({ ...registerInfo, confirmPassword: text })} // Match with state key
          autoCapitalize="none"
        />

        {error && (
          <TextComponents variant="error">{error}</TextComponents>
        )}

        <Button
          icon={() => <MaterialIcons name="person-add" size={20} color="#fff" />}
          mode="contained"
          onPress={handleRegister}
          loading={loading}
          disabled={loading}
        >
          Register
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

export default RegisterScreen;