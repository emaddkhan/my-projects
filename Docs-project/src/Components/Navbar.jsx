import React from 'react'

function Navbar({addBtnHandler}) {
  return (
    <div className="py-4 flex justify-between items-center px-12 rounded-bl-xl rounded-br-xl bg-zinc-100 w-full">
        <span></span>
        <h5 className=" text-zinc-500 text-xl font-semibold">Documents</h5>
        <button onClick={addBtnHandler} className="px-12 py-3 bg-green-500 rounded-full font-semibold text-white">Add</button>
      </div>
  )
}

export default Navbar