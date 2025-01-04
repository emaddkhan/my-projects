import React, { memo } from 'react'
import { Text } from 'react-native-paper'
import styled from 'styled-components/native'

const defaultTextStyle = (theme) => `
  font-family: ${theme.fonts.body};
  font-weight: ${theme.fontWeights.regular};
  color: ${theme.colors.primary};
  flex-wrap: wrap;
  margin-top: 0px;
  margin-bottom: 0px;
  margin-left:5px;
  font-size:15px;
`;

const body = (theme) => `
  font-size: ${theme.fontSizes.body};
`;

const error = (theme) => `
  color: ${theme.colors.text.error};
`;

const caption = (theme) => `
  font-size: ${theme.fontSizes.caption};
  font-weight: ${theme.fontWeights.bold};
`;

const label = (theme) => `
  font-size: ${theme.fontSizes.body};
  font-weight: ${theme.fontWeights.medium};
  font-family: ${theme.fonts.heading};
`;

const variants = {
  body,
  error,
  caption,
  label,
};

const TextStyle = styled(Text)`
  ${(props) => defaultTextStyle(props.theme)}
  ${(props) => variants[props.customVariant](props.theme)}
`;

function TextComponents(props) {
  const { variant = "body", children, style } = props;
  return (
    <TextStyle customVariant={variant} style={style}>
      {children}
    </TextStyle>
  );
}

export default memo(TextComponents);
