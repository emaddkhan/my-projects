import React, { useEffect, useState } from "react";
import Background from "./Components/Background";
import Forground from "./Components/Forground";
import Form from "./Components/Form";

function App() {
  const [backgroundMainColor, setBackgroundMainColor] = useState(() => {
    return localStorage.getItem("backgroundMainColor") || "#27272A";
  });
  const [backgroundMainFontColor, setBackgroundMainFontColor] = useState(() => {
    return localStorage.getItem("backgroundMainFontColor") || "#18181B";
  });
  const [bgFontValue, setBgFontValue] = useState(() => {
    return parseFloat(localStorage.getItem("bgFontValue")) || 13;
  });
  const [navBtnBgColor, setNavBtnBgColor] = useState(() => {
    return localStorage.getItem("navBtnBgColor") || "#000000";
  });
  const [showForm, setShowForm] = useState(false);
  useEffect(() => {
    localStorage.setItem("bgFontValue", bgFontValue);
  }, [bgFontValue]);
  useEffect(()=>{
    localStorage.setItem("navBtnBgColor", navBtnBgColor);

  },[navBtnBgColor])

  return (
    <div
      className="relative  h-screen w-full bg-zinc-800 "
      style={{ backgroundColor: backgroundMainColor }}
    >
      <Background
        bgFontValue={bgFontValue}
        backgroundMainFontColor={backgroundMainFontColor}
      />
      <Forground
        navBtnBgColor={navBtnBgColor}
        setNavBtnBgColor={setNavBtnBgColor}
        setBgFontValue={setBgFontValue}
        bgFontValue={bgFontValue}
        backgroundMainColor={backgroundMainColor}
        backgroundMainFontColor={backgroundMainFontColor}
        setBackgroundMainFontColor={setBackgroundMainFontColor}
        setBackgroundMainColor={setBackgroundMainColor}
      />
      {showForm && (
        <Form
          navBtnBgColor={navBtnBgColor}
          formCloseBtnHandeler={formCloseBtnHandeler}
        />
      )}
    </div>
  );
}

export default App;
