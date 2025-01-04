import React, { memo } from "react";
import { View, Image } from "react-native";
import styled from "styled-components/native";
// import WebView from "react-native-webview";
import { Platform } from "react-native";
import TextComponents from "../../../components/TextComponent/TextComponents";

const Item = styled(View)`
  padding: 10px;
  max-width: 200px;
  align-items: center;
`;

const CustomImage = styled(Image)`
  border-radius: 10px;
  width: 120px;
  height: 100px;
`;

// const CustomWebViewImage = styled(WebView)`
//   border-radius: 10px;
//   width: 120px;
//   height: 100px;
// `;

const isAndroid = Platform.OS === "android";

function MapCalloutComponent(props) {
  const { singleRestaurant } = props;
  //   const CustomizeImageComponent = isAndroid ? CustomWebViewImage : CustomImage;
  const CustomizeImageComponent = CustomImage;
  return (
    <Item>
      <CustomizeImageComponent source={{ uri: singleRestaurant.photos }} />
      <TextComponents center variant="caption" numberOfLines={3}>
        {singleRestaurant.name}
      </TextComponents>
    </Item>
  );
}

export default memo(MapCalloutComponent);