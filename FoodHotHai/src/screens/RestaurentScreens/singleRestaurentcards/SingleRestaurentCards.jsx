import React from 'react'
import { CardIconContainer, CardInnerSection, CardSection, CustomImage, RatingContainer, RestaurentCard, RestaurentCardCover} from './Restaurent.styles'
import TextComponents from '../../../components/TextComponent/TextComponents';
import { SvgXml } from "react-native-svg";
import star from '../../../../assets/star';
import open from '../../../../assets/open';

function SingleRestaurentCards(props) {
  const{singleRestaurant={}} = props;
  const {photos = "https://www.foodiesfeed.com/wp-content/uploads/2019/06/top-view-for-box-of-2-burgers-home-made-600x899.jpg",
    name= "foodpanda" ,
    rating=5,
    isOpenNow=true,
    icon = "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/lodging-71.png",
  } =singleRestaurant;
  const ratingArray = Array.from(new Array(Math.round(rating)));
    return (
    <RestaurentCard>
        <RestaurentCardCover source={{uri:photos}}/>
        <CardSection>
          <TextComponents varient="body">{name}</TextComponents>
          <CardInnerSection>
            <RatingContainer>
              {ratingArray?.map(() => (
                <SvgXml xml={star} width={20} height={20} />
              ))}
            </RatingContainer>
            <CardIconContainer>
              {isOpenNow&&<SvgXml xml={open} width={30} height={30} />}
              {Boolean(icon)&& !isOpenNow && <CustomImage source={{uri:icon}} height={30} width={30}/>}
            </CardIconContainer>
          </CardInnerSection>
        </CardSection>
    </RestaurentCard>
  )
}

export default SingleRestaurentCards
