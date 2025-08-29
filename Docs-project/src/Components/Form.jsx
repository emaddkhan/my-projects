import React, { useRef, useState } from "react";
import { GrClose } from "react-icons/gr";
import { motion } from "motion/react";

function Form({ formCloseBtnHandeler,onUserAdd }) {
  const ref = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    cell: "",
    phone: "",
    email: "",
    country: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result); 
    };
    reader.readAsDataURL(file);
  }
};


  const handleClear = () => {
    setFormData({
      name: "",
      cell: "",
      phone: "",
      email: "",
      country: "",
      image: null,
    });
    setPreview(null);
  };

 const handleSubmit = (e) => {
  e.preventDefault();

  const userObj = {
    gender: "custom",
    name: { title: "", first: formData.name, last: "" },
    cell: formData.cell,
    phone: formData.phone,
    email: formData.email,
    location: { country: formData.country },
    picture: { large: preview || "" }, 
  };

  const existing = JSON.parse(localStorage.getItem("users")) || [];
  existing.push(userObj);
  localStorage.setItem("users", JSON.stringify(existing));

  console.log("✅ User saved", userObj);

  
  if (onUserAdd) {
    onUserAdd(userObj);
  }

  handleClear();
  formCloseBtnHandeler();
};

  return (
    <div className="h-screen w-full fixed top-0 left-0 bg-zinc-900/80 z-[5]">
      <div className="w-full py-7 px-16 flex items-center justify-end">
        <GrClose
          onClick={formCloseBtnHandeler}
          className="cursor-pointer text-3xl text-white"
        />
      </div>
      <div
        ref={ref}
        className="h-[90%] w-full flex items-center justify-center "
      >
        <motion.div
          dragElastic={0.1}
          dragTransition={{ bounceStiffness: 100, bounceDamping: 30 }}
          drag
          dragConstraints={ref}
          className="h-[90%] shadow-md shadow-white w-[30%] rounded-2xl overflow-hidden bg-zinc-50"
        >
          <div className="py-5 w-full bg-green-300">
            <h1 className="text-center text-white text-xl font-semibold">
              Add User
            </h1>
          </div>
          <div className="w-full py-6 px-10 ">
            <form onSubmit={handleSubmit}>
              <div className="mb-4 flex flex-col items-center">
                <label className="block text-lg font-semibold mb-2">
                  Profile Image:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-sm"
                />
                {preview && (
                  <div className="mt-3 w-24 h-24 rounded-full overflow-hidden border-2 border-gray-400">
                    <img
                      src={preview}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-lg font-semibold">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="User name"
                  className="w-[98%] py-2 outline-none px-4 font-semibold rounded-lg border-2 mt-2"
                />
              </div>

              <div className="flex mt-2 w-full p-1 justify-between items-center">
                <div className="w-[48%]">
                  <label className="block font-semibold">Cell number:</label>
                  <input
                    type="text"
                    name="cell"
                    value={formData.cell}
                    onChange={handleChange}
                    placeholder="User cell"
                    className="w-[98%] py-2 outline-none px-4 font-semibold rounded-lg border-2 mt-1"
                  />
                </div>
                <div className="w-[48%]">
                  <label className="block font-semibold">Phone number:</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="User Phone"
                    className="w-[98%] py-2 outline-none px-4 font-semibold rounded-lg border-2 mt-1"
                  />
                </div>
              </div>

              <div className="mt-2">
                <label className="block text-lg font-semibold">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="User Email"
                  className="w-[98%] py-2 outline-none px-4 font-semibold rounded-lg border-2 mt-1"
                />
              </div>

              <div className="mt-2">
                <label className="block text-lg font-semibold">Country:</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="User Country"
                  className="w-[98%] py-2 outline-none px-4 font-semibold rounded-lg border-2 mt-1"
                />
              </div>

              <div className="flex mt-5 justify-between items-center w-full py-3 ">
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-12 py-2 bg-red-600 text-white font-semibold text-md rounded-full"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  className="px-12 py-2 bg-green-600 text-white font-semibold text-md rounded-full"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Form;
