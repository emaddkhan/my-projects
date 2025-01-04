import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import styled from 'styled-components/native';

const ImageBackgroundBox = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: #fff;
`;

const TextDiv = styled(View)`
  border-left-width: 1px;
  border-left-color: #808080;
  border-right-width: 1px;
  border-right-color: #808080;
  margin: 0 auto;
`;

const PoweredDiv = styled(View)`
  margin: 0 auto;
  padding: 0 5px;
`;

const PoweredText = styled(Text)`
  font-size: 20px;
`;

const NameDiv = styled(View)`
  margin: 0 auto;
  padding-right: 4px;
`;

function IntroScreen() {
  return (
    <>
      <ImageBackgroundBox>
        <Image style={styles.image} source={require('../../../assets/Logo.jpg')} />
      </ImageBackgroundBox>
      <TextDiv>
        <PoweredDiv>
          <PoweredText>Powered By:</PoweredText>
        </PoweredDiv>
        <NameDiv>
          <Text>Emad Khan</Text>
        </NameDiv>
      </TextDiv>
    </>
  );
}

export default IntroScreen;

const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
  },
});
