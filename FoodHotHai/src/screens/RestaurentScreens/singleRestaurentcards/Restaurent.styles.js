import { View,Image } from "react-native";
import { Card } from "react-native-paper";
import styled from "styled-components";

export const RestaurentCard = styled(Card)`
background-color:${(props)=>props.theme.colors.bg.primary};
margin-top:25px;
`

export const RestaurentCardCover = styled(Card.Cover)`
padding:14px;
margin-bottom:4px;
`
export const CardSection = styled(View)`
padding:3px;
padding-bottom:10px;
padding-left:10px;
padding-right:10px;
`
export const CardInnerSection = styled(View)`
display:flex;
flex-direction:row;
justify-content:space-between;
`
export const RatingContainer = styled(View)`
display:flex;
flex-direction:row;
margin-top:5px;
`
export const CardIconContainer = styled(View)`
display:flex;
flex-direction:row;
justify-content:space-between;
padding-right:10px;
`

export const CustomImage = styled(Image)`
width:15px;
height:15px;
maegin-left:20px;
maegin-right:10px;
`