import camelize from "camelize";
import { locations } from "./Location.mocks";

export const locationRequest = (search = "toronto") => {
  return new Promise((resolve, reject) => {
    const locationMockData = locations[search.toLowerCase()];
    
    if (!locationMockData) {
      reject(new Error(`Location "${search}" not found`));
      return;
    }
    
    const transformedLocationData = locationTransformData(locationMockData);
    resolve(transformedLocationData);
  });
};

const locationTransformData = (locationData) => {
  const { results } = locationData;
  const formattedResponse = camelize(results);
  const { geometry } = formattedResponse[0];
  
  return {
    lat: geometry.location.lat,
    lng: geometry.location.lng,
    viewport: geometry.viewport,
  };
};
