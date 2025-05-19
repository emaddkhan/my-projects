import React, { useState } from 'react'
import Navbar from './Components/Navbar'
import Card from './Components/Card'

function App() {
  const raw =[
    {img:"https://images.unsplash.com/photo-1746950862509-959ed92c42b8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw5fHx8ZW58MHx8fHx8",song:"Challenger",artist:"Emakers",added:false,},
    {img:"https://plus.unsplash.com/premium_photo-1746194532343-a88b76a9f76e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyOHx8fGVufDB8fHx8fA%3D%3D",song:"King of life",artist:"Emakers",added:false,},
    {img:"https://images.unsplash.com/photo-1728044849221-851cf8587fac?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzMXx8fGVufDB8fHx8fA%3D%3D",song:"Only Death",artist:"Emakers",added:false,},
    {img:"https://images.unsplash.com/photo-1746802401350-b99c6e692a05?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0NHx8fGVufDB8fHx8fA%3D%3D",song:"Nikolus",artist:"Emakers",added:false,},
  ]
  const color = [
    {cname:"blue",colorCode:"bg-blue-500",show:false},
    {cname:"red",colorCode:"bg-red-500",show:false},
    {cname:"orange",colorCode:"bg-orange-500",show:false},
    {cname:"green",colorCode:"bg-green-500",show:false},
  ]
  const [data,setData] =useState(raw)
  
  const favBtnHandler =(cardIndex)=>{
    return setData((prev)=>{
      return prev.map((item,index)=>{
        if(index===cardIndex){
          return {...item,added:!item.added}
        }
        return item;
      })
    })
  }
  const [clr,setClr]=useState(color)
  const [activeColor,setActiveColor]=useState("")
  const showColor=(clrIndex)=>{
   return setClr((prev)=>{
    return prev.map((item,index)=>{
      if(index===clrIndex){
        setActiveColor(item.colorCode)
        return {...item,show:!item.show}
      }
      return item;
    })
   })
  }

  return (
    <div>
      <Navbar clr={clr} data={data} activeColor={activeColor} clrHandler={showColor}/>
      <div className='px-20 mt-10 flex gap-4 flex-wrap'>
        {data.map((item,index)=>{
          return <Card values={item} activeColor={activeColor} data={raw} index={index} key={index} favHandler={favBtnHandler}/> 
        })}
      </div>
    </div>
  )
}

export default App
//aik warning ati hai k each child should have its unique number toh ye islia hota hai k react apna aik virtual dom bnata hai to jb bhi map
//se elem ate hai toh usko sb same lgte toh ise resolve krne ka trika ye hai k hum child ko aik key de de yani map k andr jo function hota
//use do param pass krayenge aik toh value hogi or dosra index kiu k index hr bar change hota hai or key k andr bhi index de dein gai

//Fragment
//fragment basically ye hai k ap bina extra div bnye ap cheezon ko wrap kr skte ho kuch yoo <></>

//useState stete ko turant complete nhi krta woh usko complete krta hai apne hisab se function completion ke baad to fix perfomence issuse
//=====PROPS======***

//props use hote hain apke component ko reusebal bnane k liye ,consider kro apke pass aik button hai or apko us utton ko alag alag jagah
//dalna hai app me ,toh aap aik aik button component bnayein uska data hard coded krne ki jagah parent se send krdein and child componet pr 
//use krlein
//stae jahan bnti hai whin modify ki ja skiti hai