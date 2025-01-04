import React, { useContext, useEffect, useState } from "react";
import {locationRequest} from "./Location.service"
import {restaurantRequest} from "../Restaurant/Restaurent.service"

const LocationContext = React.createContext();

const LocationContextComponent = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [error, setError] = useState(null);
  const [location, setLocation] = useState({});
  const [restaurants, setRestaurants] = useState(null);

  const onSearchHandler = (searchKeyword) => {
    if (searchKeyword) {
      setLoading(true);
      setError(null);

      setTimeout(() => {
        setKeyword(searchKeyword);
      }, 500);
    }
  };

  useEffect(() => {
    console.log(keyword,"keyword")
    if (!keyword.length) {
      return;
    }

    locationRequest(keyword)
      
      .then((results) => {
        
        // setLoading(false);
        setError(null);
        setLocation(results);
        const { lat, lng } = results;
        const payload = `${lat},${lng}`;
        restaurantRequest(payload)
          .then((results) => {
            setRestaurants(results);
            setLoading(false);
          })
          .catch((error) => {
            setError(error);
            setLoading(false);
            setRestaurants([]);
          });
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
        setRestaurants([]);
      });
  }, [keyword]);
  return (
    <LocationContext.Provider
      value={{
        search: onSearchHandler,
        loading,
        keyword,
        error,
        location,
        restaurants,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export default LocationContextComponent;

export const useLocationContext = () => {
  return useContext(LocationContext);
};