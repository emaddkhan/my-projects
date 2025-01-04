import React from 'react';
import { View, SafeAreaView, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import TextComponents from '../../../components/TextComponent/TextComponents';
import { useAuthenticationContext } from '../../../ContextApis/Authentication/Authentication.context';

const SettingContainer = styled(SafeAreaView)`
  margin-top: 20px;
`;

const ListContainer = styled(View)`
  border-bottom-color: grey;
  border-bottom-width: 1px;
  background-color: white;
  padding: 15px 20px;
`;

function SettingsScreen() {
    const {user,onLogout} = useAuthenticationContext()
  return (
    <SettingContainer>
      <ListContainer>
        <TextComponents>User Profile</TextComponents>
      </ListContainer>
      <ListContainer>
        <TextComponents>Email: {user?.user?.email}</TextComponents>
      </ListContainer>
      <ListContainer>
        <TouchableOpacity onPress={()=>{
            onLogout();
        }}><TextComponents>Logout</TextComponents></TouchableOpacity>
      </ListContainer>
    </SettingContainer>
  );
}

export default SettingsScreen;
