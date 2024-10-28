import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/blue-logo.png')} style={styles.logo} />
      <Text style={styles.text}>Welcome to Emilog!</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', 
  },
  logo: {
    width: 100, 
    height: 100, 
    resizeMode: 'contain',
  },
  text: {
    fontSize: 20,
    fontStyle:"serif",
    marginTop: 20,
  },
});

export default SplashScreen;

