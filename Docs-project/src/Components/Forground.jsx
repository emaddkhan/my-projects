import React, { useRef } from "react";
import Card from "./Card";

function Forground() {
  const ref =useRef(null)
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
  return (
    <div ref={ref} className="w-full h-screen z-[3] flex p-5 gap-10 flex-wrap fixed top-0 left-0">
        {
          data.map((item,index)=>{
            return(<Card key={index} reference={ref} data={item}/>)
          })
        }
    </div>
  );
}

export default Forground;
