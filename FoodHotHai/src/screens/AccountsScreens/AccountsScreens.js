import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components';
import { AccountBackground, AccountCover, AccountCoverInsideContaine, AuthButton, OrText } from './Account.Style';
import { colors } from '../../utils/themes/colors';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Import the useNavigation hook

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
  padding-top: ${StatusBar.currentHeight ? `${StatusBar.currentHeight}px` : '-24px'};
`;

const AccountsScreens = ({navigation}) => {
  return (
    <AccountBackground>
      <AccountCover />
      <Title>Account Screen</Title>
      <AccountCoverInsideContaine>
        <Button
          icon={() => <MaterialIcons name="login" size={20} color="#fff" />}
          mode="contained"
          onPress={() => navigation.navigate('Login')}
        >
          Login
        </Button>
        <OrText>---------- OR----------</OrText>
        <Button
          icon={() => <Icon name="person-add" size={20} color="#fff" />}
          mode="contained"
          onPress={() => navigation.navigate('Register')}
        >
          Register
        </Button>
      </AccountCoverInsideContaine>
    </AccountBackground>
  );
};

export default AccountsScreens;
