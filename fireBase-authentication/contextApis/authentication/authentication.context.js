import React, { createContext, useState } from 'react'
import { loginFirebaseRequest, registerFirebaseRequest } from './authentication.service'
import { useNavigation } from '@react-navigation/native'
import Toast from 'react-native-toast-message'

// Create the AuthenticationContext
export const AuthenticationContext = createContext()

const AuthenticationContextProvider = ({ children }) => {
    const navigation = useNavigation()

    const [user, setUser] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const onRegister = async (param) => {
        const {email, password, confirmPassword} = param;
        if (password !== confirmPassword) {
            setError("Error: Passwords do not match")
            return
        }

        setLoading(true)
        setError(null)  // Clear any existing errors

        try {
            const userInformation = await registerFirebaseRequest(email, password)
            setIsAuthenticated(true)
            setUser(userInformation)
            Toast.show({
              type: 'success',
              text1: 'Registration Successful',
              
            });
            navigation.navigate('AccountScreen')
            console.log("user is registered ", userInformation);
        } catch (err) {
            setError(err?.message?.toString())
        } finally {
            setLoading(false)  // Ensure loading is false regardless of success/failure
        }
    }


    const onLogin = async (param) => {
        const {email, password} = param;
        

        setLoading(true)
        setError(null)  // Clear any existing errors

        try {
            const userInformation = await loginFirebaseRequest(email, password)
            setIsAuthenticated(true)
            setUser(userInformation)
            Toast.show({
              type: 'success',
              text1: 'User Is Logged In Successfully',
              
            });
            navigation.navigate('Home')
            console.log("user is  logged in", userInformation);
        } catch (err) {
            setError(err?.message?.toString())
        } finally {
            setLoading(false)  // Ensure loading is false regardless of success/failure
        }
    }
    const onLogout = ()=>{
        setIsAuthenticated(false)
        setUser(null)
        Toast.show({
            type: 'success',
            text1: 'User Logged Out Successfully',
        });
        navigation.navigate('AccountScreen');
        console.log("User is logout")
    }

    return (
        <AuthenticationContext.Provider value={{ 
            user,
            error,
            loading,
            isAuthenticated,   
            onRegister,
            onLogin,
            onLogout
        }}>
            {children}
            <Toast />
        </AuthenticationContext.Provider>
    )
}

export default AuthenticationContextProvider
