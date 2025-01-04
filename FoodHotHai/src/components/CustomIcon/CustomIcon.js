import { Ionicons } from '@expo/vector-icons';
import React from 'react'

function CustomIcon(props) {
    const {name="",size=20,color="Black"} =props;
  return (
    <Ionicons name={name} size={size} color={color} />
  )
}

export default CustomIcon
