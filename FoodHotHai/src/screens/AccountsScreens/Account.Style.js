import { ImageBackground, Text, View } from "react-native";
import { Button } from "react-native-paper";
import styled from "styled-components";
import { colors } from "../../utils/themes/colors";

export const AccountBackground = styled(ImageBackground).attrs({
    source:require("../../../assets/foodBackground.png")
})`
flex:1;
aligi-item:center;


`
export const AccountCover = styled(View)`
position:absolute;
width:90%;
height:80%;

background-color:rgba(255,255,255,0.15);
margin-top:18%;
margin-bottom:5%;
margin-left:5%;
margin-right:5%;
border-radius: 20px;

`
export const AccountCoverInsideContaine = styled(View)`
padding:${(props)=>props.theme.space[4]};
justify-content:center;
height:64%;
gap:15px;
margin-left:5%;
margin-right:5%;

`

export const AuthButton = styled(Button)`

`
export const OrText = styled(Text)`
font-size:20px;
color:${colors.brand.white};
align-items:center;
padding-left:23%;
`
export const errorContainer =styled(View)`
max-width:300px;
align-items:center;
align-self:center;
margin-top:${(props)=>props.theme.space[3]};
margin-bottom:${(props)=>props.theme.space[3]};
`