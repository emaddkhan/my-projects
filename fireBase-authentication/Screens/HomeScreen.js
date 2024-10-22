import { View, Text,StyleSheet, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { AuthenticationContext } from '../contextApis/authentication/authentication.context';

const HomeScreen = () => {
  const {onLogout } = useContext(AuthenticationContext);
  return (
    <View style={styles.container} >
      <Text style={styles.welcomeText}>Welcome to Emilog!</Text>
      <TouchableOpacity style={styles.BtnContainer}
      onPress={()=>onLogout()}>
        <View style={styles.button}>
          <Text style={styles.buttonText} >Logout</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputContainer: {
    width: '80%'
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    width: '100%'
  },
  BtnContainer: {
    width: '60%',
    justifyContent: "center",
    alignContent: "center",
    marginTop: 20,
  },
  button: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  welcomeText:{
    fontWeight: "700",
    fontSize: 25,
  }  
});
