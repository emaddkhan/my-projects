import {
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  Image,
} from "react-native";
import React, { useState, useContext, useRef, useEffect } from "react";
import { AuthenticationContext } from "../contextApis/authentication/authentication.context";

const RegisterScreen = ({ navigation }) => {
  const [registerInfo, setRegisterInfo] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // Correctly using AuthenticationContext
  const { loading, error, onRegister } = useContext(AuthenticationContext);

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
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View>
        <Image
          source={require("../assets/blue-logo.png")} // Path to the image file
          style={styles.image}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          value={registerInfo.email}
          onChangeText={(text) =>
            setRegisterInfo({ ...registerInfo, email: text })
          }
          style={styles.input}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            autoCapitalize="none"
            value={registerInfo.password}
            onChangeText={(text) =>
              setRegisterInfo({ ...registerInfo, password: text })
            }
            style={styles.input}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.showPasswordButton}
          >
            <Text style={styles.showText}>
              {showPassword ? "Hide" : "Show"}
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Confirm password"
          value={registerInfo.confirmPassword}
          autoCapitalize="none"
          onChangeText={(text) =>
            setRegisterInfo({ ...registerInfo, confirmPassword: text })
          }
          style={styles.input}
          secureTextEntry={!showPassword}
        />
      </View>

      {/* Display error message from context */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.BtnContainer}>
        {/* Apply the shake animation to the Register button */}
        <Animated.View style={{ transform: [{ translateX: shakeAnimation }] }}>
          <TouchableOpacity
            onPress={() => onRegister(registerInfo)}
            style={styles.button}
            disabled={loading} // Disable button while loading
          >
            <Text style={styles.buttonText}>
              {loading ? "Registering..." : "Register"}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity
          onPress={() => navigation.navigate("AccountScreen")}
          style={[styles.button, styles.buttonOutlined]}
        >
          <Text style={styles.buttonOutlinedText}>Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    width: "100%",
  },
  BtnContainer: {
    width: "60%",
    justifyContent: "center",
    alignContent: "center",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#0782F9",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutlined: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "#0782F9",
    borderWidth: 2,
  },
  buttonOutlinedText: {
    color: "#0782F9",
    fontWeight: "700",
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  showPasswordButton: {
    position: "absolute",
    right: 10,
    padding: 10,
  },
  showText: {
    color: "#0782F9",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 20,
  },
});
