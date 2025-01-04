import React, { useEffect, useState } from "react";
import { Searchbar } from 'react-native-paper';
import { useLocationContext } from '../../services/location/location.context';

const SearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const {search} = useLocationContext();
  return (
    <Searchbar
      placeholder="Search"
      onChangeText={setSearchQuery}
      value={searchQuery}
      onSubmitEditing={()=>{
        search(searchQuery)
      }}
    />
  ); 
};

export default SearchComponent;
