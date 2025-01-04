import React from 'react'
import { ActivityIndicator, FlatList, View } from 'react-native'
import SearchComponent from '../../../components/SearchComponent/SearchComponent'
import SingleRestaurentCards from '../singleRestaurentcards/SingleRestaurentCards'
import styled from 'styled-components'
import { useLocationContext } from '../../../services/location/location.context'
import TextComponents from '../../../components/TextComponent/TextComponents'
import { TouchableOpacity } from 'react-native-gesture-handler'

function Restaurent(props) {
  const RestaurantList = styled(FlatList).attrs({
    contentContainerStyle: {
      padding: 16,
    },
    
  })``;
  
  const NoRestaurantWrapper = styled(View)`
  margin: 0 auto;
  margin-top: 40px;
  
`;

    const {search,loading,location,error,restaurants=[],keyword} = useLocationContext();
    console.log(loading,location,error,restaurants,keyword)
  return (
    <>
    <View>
        <SearchComponent/>
        {loading && (<ActivityIndicator size={50} animating={true} color="#0000ff"/>)}
        {restaurants?.length > 0?(<RestaurantList
        data={restaurants}
        renderItem={(singleRestaurant)=>(
          <TouchableOpacity
          onPress={()=>{
            props.navigation.navigate("RestaurantDetailScreens",{
              singleRestaurant: singleRestaurant?.item,
            });
          }}
          >
            <SingleRestaurentCards singleRestaurant={singleRestaurant.item} />            
          </TouchableOpacity>
        )}
        />):(<View>
          <NoRestaurantWrapper>
          {keyword.length> 0 && !loading ? 
          (<View>
            <TextComponents  varient="body">{keyword} restaurants do not found</TextComponents>
          </View>)
          :(<TextComponents  varient="body">Search for restaurant</TextComponents>)}
        </NoRestaurantWrapper>
        </View>)}
    </View>
    </>
  )
}

export default Restaurent
