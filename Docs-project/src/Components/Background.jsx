import React from "react";

function Background({ backgroundMainFontColor, bgFontValue }) {
  return (
    <div className="w-full h-screen z-[2] fixed">
      <div className="w-full absolute top-[2%] py-10 flex justify-center text-zinc-500 text-xl font-semibold">
        Documents
      </div>
      <h1
        className="top-1/2 absolute font-semibold left-1/2 text-zinc-900 -translate-x-[50%] -translate-y-[50%] text-[13vw] leading-none tracking-tighter"
        style={{ color: backgroundMainFontColor, fontSize: `${bgFontValue}vw` }}
      >
        Docs.
      </h1>
    </div>
  );
}

export default Background;
