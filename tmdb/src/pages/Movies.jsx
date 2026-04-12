import React from 'react'
import { useLocation } from 'react-router-dom'

function Movies() {
  const location =useLocation();
  const type=location.state?.type;
  return (
    <div>{type||"Movies"}</div>
  )
}

export default Movies