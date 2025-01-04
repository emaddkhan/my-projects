// import React, { useState } from 'react'
// import { View } from 'react-native'
// import styled from 'styled-components'
// import SearchComponent from '../../../components/SearchComponent/SearchComponent'
// import { Searchbar } from 'react-native-paper'
// import { useLocationContext } from '../../../services/location/location.context'

// const MapSearch= ()=> {
//     const SearchContainer = styled(View)`
//   padding: ${(props) => props.theme.space[3]};
//   background-color: ${(props) => props.theme.colors.bg.primary};
// `;
//     const [searchQuery,setSearchQuery] = useState("");
//     const onchangeSearch = (query)=>setSearchQuery(query);
//     const {search,restaurants} = useLocationContext();


//   return (
//     <SearchContainer>
//         <Searchbar 
//         placeholder='Search for location'
//         icon="map"
//         onChangeText={onchangeSearch}
//         value={searchQuery}
//         onSubmitEditing={()=>{
//             search(searchQuery)
//           }}
//         />
//     </SearchContainer>
//   )
// }

// export default MapSearch
import React, { useState } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native'; // Use styled-components/native for React Native
import { Searchbar } from 'react-native-paper';
import { useLocationContext } from '../../../services/location/location.context';

// Styled Component
const SearchContainer = styled(View)`
  padding: ${(props) => props.theme.space[3]};
  background-color: ${(props) => props.theme.colors.bg.primary};
`;

const MapSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { search, restaurants } = useLocationContext();

  const handleSearchChange = (query) => setSearchQuery(query);

  return (
    <SearchContainer>
      <Searchbar 
        placeholder='Search for location'
        icon="map"
        onChangeText={handleSearchChange}
        value={searchQuery}
        onSubmitEditing={() => {
          search(searchQuery);
        }}
      />
    </SearchContainer>
  );
};

export default MapSearch;
