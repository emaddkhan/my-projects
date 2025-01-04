import React, { createContext, useContext, useEffect, useState } from 'react';
import { LoginFirebaseRequest, RegisterFirebaseRequest } from './authentication.service';
import { StorageService } from '../../utils/StorageService/StorageService';

export const AuthenticationContext = createContext();
const STORAGE_KEYS={
    isAuthenticated:"isAuthenticated",
    user:"user"
}

function AuthenticationContextcomponent({ children }) {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {
        const load = async () => {
          const auth = await StorageService.getItem(STORAGE_KEYS.isAuthenticated);
          const usr = await StorageService.getItem(STORAGE_KEYS.user);
    
          if (auth && usr) {
            setIsAuthenticated(auth);
            setUser(usr);
          }
        };
    
        load();
      }, []);
    const onRegister = async ({ email, password, confirmPassword }) => {
        setError(null);
        console.log('Registering user:', email);  
        console.log('Password:', password, 'Confirm Password:', confirmPassword);      
        if (password !== confirmPassword) {
            setError("ERROR: Passwords do not match!");
            console.log('Passwords do not match!');  
            return;
        }
        setLoading(true);
        try {
            const userInformation = await RegisterFirebaseRequest(email, password);
            setIsAuthenticated(true);
            setUser(userInformation);
            console.log("User is logged in:", userInformation);  
        } catch (error) {
            setError(error?.message?.toString());
            console.log('Error during registration:', error?.message?.toString());  
        } finally {
            setLoading(false);
        }
    };
    const onLogin = async (param) => {
        const { email, password } = param;
        setError(null);
        setLoading(true);
        await LoginFirebaseRequest(email, password)
          .then(async(userInformation) => {
            setIsAuthenticated(true);
            setUser(userInformation);
            await StorageService.setItem(STORAGE_KEYS.isAuthenticated, true);
            await StorageService.setItem(STORAGE_KEYS.user, userInformation);
            console.log("user is logged in", userInformation);
          })
          .catch((error) => {
            setError(error?.message?.toString());
          });
        setLoading(false);
      };
      const onLogout =async ()=>{
        setIsAuthenticated(false)
        setUser(null)
        await StorageService.removeItem(STORAGE_KEYS.isAuthenticated);
        await StorageService.removeItem(STORAGE_KEYS.user);
      }

    return (
        <AuthenticationContext.Provider
            value={{
                user,
                error,
                isAuthenticated,
                onRegister,
                loading,
                onLogin,
                onLogout,
            }}
        >
            {children}
        </AuthenticationContext.Provider>
    );
}

export default AuthenticationContextcomponent;

export const useAuthenticationContext = () => {
    return useContext(AuthenticationContext);
};
