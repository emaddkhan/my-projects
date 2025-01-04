import { createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import RestaurentListingScreens from '../screens/RestaurentScreens/restaurentListing/RestaurentListingScreens';
import RestaurantDetailScreen from '../screens/RestaurentScreens/RestaurantDetailScreen/RestaurantDetailScreen';

function RestaurentNavigater() {
    const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator 
    screenOptions={{
      animation:"slide_from_bottom",
      headerShown:false,
      gestureEnabled:true,
    }}
    >
      <Stack.Screen name="RestaurentListinig" component={RestaurentListingScreens}  />
      <Stack.Screen name="RestaurantDetailScreens" component={RestaurantDetailScreen}  />
    </Stack.Navigator>
  )
}

export default RestaurentNavigater
