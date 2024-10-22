// import { Button, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
// import React, { useContext, useState } from 'react'
// import { useNavigation } from '@react-navigation/native';
// import { AuthenticationContext } from '../contextApis/authentication/authentication.context';

// const AccountScreen = () => {
//     const navigation = useNavigation();
//     const [showPassword, setShowPassword] = useState(false);
//     const { loading, error, onLogin } = useContext(AuthenticationContext);
//     const [loginInfo,setLoginInfo] = useState({
//       email:"",
//       password:"",
//     })

    
    

//     return (
//         <KeyboardAvoidingView
//           style={styles.container}
//           behavior='padding'
//         >
//           <View style={styles.inputContainer}>
//             <TextInput
//               placeholder='Email'
//               value={loginInfo.email}
//           onChangeText={text => setLoginInfo({...loginInfo,email:text})}
//               style={styles.input}
//               autoCapitalize="none"
//               keyboardType="email-address"
//               textContentType="emailAddress"
//             />
//             <View style={styles.passwordContainer}>
//               <TextInput
//                 placeholder='Password'
//                 value={loginInfo.password}
//             onChangeText={text => setLoginInfo({...loginInfo,password:text})}
//                 style={styles.input}
//                 secureTextEntry={!showPassword}  // Toggle between showing and hiding password
//               />
//               <TouchableOpacity
//                 onPress={() => setShowPassword(!showPassword)} // Toggle show/hide password
//                 style={styles.showPasswordButton}
//               >
//                 <Text style={styles.ShowText}>{showPassword ? 'Hide' : 'Show'}</Text> 
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* Display error message if login fails */}
//           {error && <Text style={styles.errorText}>{error}</Text>} 

//           <View style={styles.BtnContainer}>
//             <TouchableOpacity
//               onPress={()=>onLogin(loginInfo)}  // Trigger the login handler
//               style={styles.button}
//               disabled={loading}  // Disable the button while loading
//             >
//               <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               onPress={() => navigation.navigate('RegisterScreen')} 
//               style={[styles.button, styles.buttonOutlined]}
//             >
//               <Text style={styles.buttonOutlinedText}>Register</Text>
//             </TouchableOpacity>
//           </View>
//         </KeyboardAvoidingView>
//     )
// }

// export default AccountScreen

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   inputContainer: {
//     width: '80%'
//   },
//   input: {
//     backgroundColor: "white",
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     borderRadius: 10,
//     marginTop: 5,
//     width: '100%'
//   },
//   BtnContainer: {
//     width: '60%',
//     justifyContent: "center",
//     alignContent: "center",
//     marginTop: 20,
//   },
//   button: {
//     backgroundColor: '#0782F9',
//     width: '100%',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: "white",
//     fontWeight: "700",
//     fontSize: 16,
//   },
//   buttonOutlined: {
//     backgroundColor: "white",
//     marginTop: 5,
//     borderColor: '#0782F9', 
//     borderWidth: 2,
//   },
//   buttonOutlinedText: {
//     color: "#0782F9",
//     fontWeight: "700",
//     fontSize: 16,
//   },
//   passwordContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     width: '100%'
//   },
//   showPasswordButton: {
//     position: 'absolute',
//     right: 10,  
//     padding: 10,
//   },
//   ShowText:{
//     color: '#0782F9',
//   },
//   // Style for the error text
//   errorText: {
//     color: 'red',
//     marginTop: 10,
//     fontSize: 14,
//     textAlign: 'center',
//   }
// });
import { 
  Button, 
  KeyboardAvoidingView, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  Animated 
} from 'react-native';
import React, { useContext, useState, useRef, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {Image} from 'react-native'
import { AuthenticationContext } from '../contextApis/authentication/authentication.context';

const AccountScreen = () => {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error, onLogin } = useContext(AuthenticationContext);
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  // Create Animated value for shake
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  // Trigger shake animation on error
  useEffect(() => {
    if (error) {
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [error]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior='padding'
    >
      <View>
      <Image
        source={require('../assets/blue-logo.png')}  // Path to the image file
        style={styles.image}
      />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder='Email'
          value={loginInfo.email}
          onChangeText={text => setLoginInfo({ ...loginInfo, email: text })}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder='Password'
            value={loginInfo.password}
            onChangeText={text => setLoginInfo({ ...loginInfo, password: text })}
            style={styles.input}
            autoCapitalize="none"
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.showPasswordButton}
          >
            <Text style={styles.ShowText}>{showPassword ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Display error message if login fails */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.BtnContainer}>
        <Animated.View style={{ transform: [{ translateX: shakeAnimation }] }}>
          <TouchableOpacity
            onPress={() => onLogin(loginInfo)}
            style={styles.button}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
          </TouchableOpacity>
        </Animated.View>
        <TouchableOpacity
          onPress={() => navigation.navigate('RegisterScreen')}
          style={[styles.button, styles.buttonOutlined]}
        >
          <Text style={styles.buttonOutlinedText}>Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

export default AccountScreen;

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
  buttonOutlined: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: '#0782F9',
    borderWidth: 2,
  },
  buttonOutlinedText: {
    color: "#0782F9",
    fontWeight: "700",
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },
  showPasswordButton: {
    position: 'absolute',
    right: 10,
    padding: 10,
  },
  ShowText: {
    color: '#0782F9',
  },
  // Style for the error text
  errorText: {
    color: 'red',
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
  },
  image: {
    width: 100,  
    height: 100, 
    resizeMode: 'contain',
    marginBottom: 20,  
  },
});
