import React from "react";

function Footer() {
  return (
    <div className="w-full">
      <div className="max-w-screen-xl mx-auto py-10 flex gap-32">
        <div className="basis-1/2">
          <h1 className="text-[11.5rem] font-semibold leading-none tracking-tight">
            refokus.
          </h1>
        </div>
        <div className="basis-1/2 flex gap-4">
          <div className="basis-1/3">
            <h4 className="text-zinc-500 mb-10 capitalize">Social</h4>
            {["Instagram", "Twitter (X?)", "LinkedIn"].map((e, i) => (
              <a className="text-zinc-600 mt-2 capitalize block">{e}</a>
            ))}
          </div>
          <div className="basis-1/3">
            <h4 className="text-zinc-500 mb-10 capitalize">Sitemap</h4>
            {["Home", "work", "careers", "contact"].map((e, i) => (
              <a className="text-zinc-400 font-medium mt-2 capitalize block">
                {e}
              </a>
            ))}
          </div>
          <div className="basis-1/2 flex flex-col items-end justify-end">
            <p className="text-right">
              Refokus is a pioneering digital agency driven by and empowered by
              technology.
            </p>
            <img
              className="w-32 mt-12"
              src="https://assets-global.website-files.com/5df3de8e749203dc3167a479/65369e818884afbae46a35fc_Webflow-badge.svg"
              alt="logo"
            />
          </div>
        </div>
      </div>
      <div className="max-w-screen-xl mx-auto py-5 flex gap-8">
            {["privacy policy","cookie policy","impression","terms"].map((e,i)=><h5 className="text-zinc-600 capitalize">{e}</h5>)}
        </div>
    </div>
  );
}

export default Footer;
