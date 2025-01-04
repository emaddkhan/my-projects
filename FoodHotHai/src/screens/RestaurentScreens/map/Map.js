import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapSearch from './MapSearch';
import { useLocationContext } from '../../../services/location/location.context';
import MapView, { Callout, Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import MapCalloutComponent from './MapCalloutComponent';

function Map() {
  const { loading, location = {} ,restaurants } = useLocationContext();
  console.log(location, "location");
  const { lat, lng, viewport } = location;
  const latitude = lat ?? 37.78825;
  const longitude = lng ?? -122.4324;
  const latDelta = viewport?.northeast?.lat - viewport?.southwest?.lat || 0.0922;
  const mapRef = useRef();
  const navigation = useNavigation();
  useEffect(()=>{
    if(location && location?.lng && latDelta && mapRef.current){
      mapRef.current.animateToRegion({
        latitude:latitude,
        longitude:longitude,
        latitudeDelta:latDelta ?? 0.092,
        longitudeDelta:0.02,
      });
    };
  },[location,latDelta]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MapSearch />
      {loading && (
        <ActivityIndicator size={50} animating={true} color="#0000ff" />
      )}
      {!loading && location?.lat && location?.lng && latDelta && (
        <MapView
          ref={mapRef}
          style={{
            height: "100%",
            width: "100%",
          }}
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: latDelta,
            longitudeDelta: 0.02,
          }}
        >
         {restaurants?.map((singleRestaurant,index)=>{
          return <Marker title={singleRestaurant?.name} key={index} coordinate={{
            latitude:singleRestaurant?.geometry?.location?.lat,
            longitude:singleRestaurant?.geometry?.location?.lng,
          }}>
            <Callout
            onPress={()=>{
              navigation.navigate("RestaurantDetailScreens",{
                singleRestaurant:singleRestaurant,
              })
            }}
            >
              <MapCalloutComponent singleRestaurant={singleRestaurant}/>
            </Callout>
          </Marker>
         })}
        </MapView>
      )}
    </SafeAreaView>
  );
}

export default Map;
