import React, { useEffect, useRef, useState } from "react";
import Card from "./Card";
import Navbar from "./Navbar";
import axios from "axios";

function Forground({addBtnHandler}) {
  const ref =useRef(null)
  const [users,setUsers]=useState([])
  const data =[{
    description:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Illo, eligendi?",
    fileSize:".7mb",
    close:true,
    tag:{isOpen:false,tagTitle:"Download now",tagColor:"green"}
  },{
    description:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Illo, eligendi?",
    fileSize:".7mb",
    close:true,
    tag:{isOpen:true,tagTitle:"Download now",tagColor:"blue"}
  },
{
    description:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Illo, eligendi?",
    fileSize:".7mb",
    close:true,
    tag:{isOpen:true,tagTitle:"Download now",tagColor:"green"}
  },
]
useEffect(()=>{
  axios
  .get("https://randomuser.me/api/?results=5")
  .then((res)=>{
    setUsers(res.data.results)
    console.log(res.data.results)
  })
  .catch((err)=>{
    console.error("error",err)
  })
},[])
  return (
    <div  className="w-full h-screen z-[3] flex-wrap fixed top-0 left-0">
      <Navbar addBtnHandler={addBtnHandler}/>
        <div ref={ref} className=" flex h-[91%]  p-5 gap-10">{
          users.map((item,index)=>{
            return(<Card key={index} reference={ref} data={item}/>)
          })
        }</div>
    </div>
  );
}

export default Forground;
