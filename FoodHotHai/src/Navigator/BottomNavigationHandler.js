import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react'
import RestaurentListingScreens from '../screens/RestaurentScreens/restaurentListing/RestaurentListingScreens';
import { Text } from 'react-native-paper';
import CustomIcon from '../components/CustomIcon/CustomIcon';
import Map from '../screens/RestaurentScreens/map/Map';
import Restaurent from '../screens/RestaurentScreens/restaurentListing/RestaurentListingScreens';
import RestaurentNavigater from './RestaurentNavigator';
import SettingsScreen from '../screens/RestaurentScreens/SettingsScreen/SettingsScreen';




const Tab = createBottomTabNavigator();

const createScreenOptions = ({route})=>{
  const iconNames = TAB_ICONS[route.name]
  return {
    tabBarActiveTintColor: "tomato",
    tabBarInactiveTintColor: "grey",
    headerShown: false,
    tabBarIcon:({size,color})=><CustomIcon name={iconNames} size={size} color={color}/>
  }
}

function BottomNavigationHandler() {
  return (
    <Tab.Navigator
    screenOptions={createScreenOptions}

    >
      <Tab.Screen name="Restaurant" component={RestaurentNavigater} />
      <Tab.Screen name="Map" component={Map} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  )
}

export default BottomNavigationHandler


const TAB_ICONS = {
  Restaurant:"restaurant",
  Map:"map",
  Settings:"settings-sharp",
}