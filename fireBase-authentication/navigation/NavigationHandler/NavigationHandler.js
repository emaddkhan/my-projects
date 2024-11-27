import React, { useContext } from 'react';
import ScreensNavigation from '../ScreensNavigation';
import LoginNavigater from '../LoginNavigater';
import { AuthenticationContext } from '../../contextApis/authentication/authentication.context';

const NavigationHandler = () => {
    // const { isAuthenticated } = useContext(AuthenticationContext);
    const isAuthenticated = true;
    return (
        <>
            {isAuthenticated ? <ScreensNavigation /> : <LoginNavigater />}
        </>
    );
}

export default NavigationHandler;
