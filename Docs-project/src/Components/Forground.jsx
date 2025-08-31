import React, { useEffect, useRef, useState } from "react";
import Card from "./Card";
import Navbar from "./Navbar";
import axios from "axios";
import Form from "./Form";
import { RiDeleteBinLine } from "react-icons/ri";
import SettingPanel from "./SettingPanel";

function Forground({backgroundMainColor,setBackgroundMainColor }) {
  const [isOverDelete, setIsOverDelete] = useState(false);
  const [deletTop, setDeleteTop] = useState(false);
  const [deletLeft, setDeleteLeft] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(null);

  // Load saved nav colors from localStorage
  const [navColor, setNavColor] = useState(() => {
    return localStorage.getItem("navColor") || "#ffffff";
  });
  const [navFontColor, setNavFontColor] = useState(() => {
    return localStorage.getItem("navFontColor") || "#000000";
  });
  const [navBtnBgColor, setNavBtnBgColor] = useState(() => {
    return localStorage.getItem("navBtnBgColor") || "#000000";
  });
  const [navBtnFontColor, setNavBtnFontColor] = useState(() => {
    return localStorage.getItem("navBtnFontColor") || "#000000";
  });
  

  const [showSettings, setShowSettings] = useState(false);

  const settingBtnHandler = () => {
    setShowSettings(!showSettings);
  };

  const ref = useRef(null);
  const deleteRef = useRef(null);

  useEffect(() => {
    const savedUsers = localStorage.getItem("users");
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      axios
        .get("https://randomuser.me/api/?results=5")
        .then((res) => {
          setUsers(res.data.results);
          localStorage.setItem("users", JSON.stringify(res.data.results));
        })
        .catch((err) => {
          console.error("error", err);
        });
    }
  }, []);

  // Save navColor + navFontColor to localStorage whenever they change
 useEffect(() => {
  localStorage.setItem("navColor", navColor);
  localStorage.setItem("navFontColor", navFontColor);
  localStorage.setItem("navBtnBgColor", navBtnBgColor);
  localStorage.setItem("navBtnFontColor", navBtnFontColor);
  localStorage.setItem("backgroundMainColor", backgroundMainColor);
}, [navColor, navFontColor, navBtnBgColor, navBtnFontColor, backgroundMainColor]);


  const handleAddUser = (newUser) => {
    const updated = [...users, newUser];
    setUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));
  };

  const handleDeleteUser = (indexToDelete) => {
    const updatedUsers = users.filter((_, i) => i !== indexToDelete);
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  return (
    <div className="w-full h-screen z-[3] flex-wrap fixed top-0 left-0">
      <Navbar
        showSettings={showSettings}
        navColor={navColor}
        settingBtnHandler={settingBtnHandler}
        addBtnHandler={() => setShowForm(true)}
        navFontColor={navFontColor}
        navBtnBgColor={navBtnBgColor}
        navBtnFontColor={navBtnFontColor}
        backgroundMainColor={backgroundMainColor}
      />
      {/* setting panel */}
      <SettingPanel
        setNavColor={setNavColor}
        navColor={navColor}
        showSettings={showSettings}
        navFontColor={navFontColor}
        setNavFontColor={setNavFontColor}
        navBtnBgColor={navBtnBgColor}
        setNavBtnBgColor={setNavBtnBgColor}
        navBtnFontColor={navBtnFontColor}
        setNavBtnFontColor={setNavBtnFontColor}
        setBackgroundMainColor={setBackgroundMainColor}
      />

      {/* delete zone */}
      <div
        ref={deleteRef}
        className={`h-80 w-80 transition-all duration-300 flex items-center justify-center
        absolute rounded-full
        ${deletLeft ? "left-[88%]" : "left-[100%]"}
        ${deletTop ? "top-[75%]" : "top-[100%]"}
        ${isOverDelete ? "bg-red-700 shadow-[0_0_30px_red]" : "bg-red-900/80"}`}
      >
        <RiDeleteBinLine className="text-white text-6xl" />
      </div>

      {/* cards */}
      <div ref={ref} className="flex h-[91%] p-5 gap-10">
        {users.map((item, index) => (
          <Card
            key={index}
            reference={ref}
            data={item}
            deleteRef={deleteRef}
            isActive={activeCardIndex === index}
            setIsOverDelete={setIsOverDelete}
            onDragStart={() => {
              setActiveCardIndex(index);
              setDeleteTop(true);
              setDeleteLeft(true);
            }}
            onDragEnd={() => {
              if (isOverDelete) {
                handleDeleteUser(index);
              }
              setActiveCardIndex(null);
              setDeleteTop(false);
              setDeleteLeft(false);
              setIsOverDelete(false);
            }}
          />
        ))}
      </div>

      {showForm && (
        <Form
          formCloseBtnHandeler={() => setShowForm(false)}
          onUserAdd={handleAddUser}
        />
      )}
    </div>
  );
}

export default Forground;
