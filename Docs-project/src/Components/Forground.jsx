import React, { useEffect, useRef, useState } from "react";
import Card from "./Card";
import Navbar from "./Navbar";
import axios from "axios";
import Form from "./Form"; // <-- import Form

function Forground({ addBtnHandler }) {
  const ref = useRef(null);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);

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

  // ✅ Add new user handler (called from Form)
  const handleAddUser = (newUser) => {
    const updated = [...users, newUser];
    setUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));
  };

  return (
    <div className="w-full h-screen z-[3] flex-wrap fixed top-0 left-0">
      <Navbar addBtnHandler={() => setShowForm(true)} />
      <div ref={ref} className="flex h-[91%] p-5 gap-10">
        {users.map((item, index) => (
          <Card key={index} reference={ref} data={item} />
        ))}
      </div>

      {/* ✅ Show Form only when add button clicked */}
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
