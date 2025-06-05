import React, { useState } from "react";
import Product from "./Product";
import { motion } from "motion/react";

import arqitel from "../assets/videos/arqitel.mp4";
import ttr from "../assets/videos/ttr.mp4";
import yir from "../assets/videos/yir.mp4";
import yahoo from "../assets/videos/yahoo.mp4";
import rainfall from "../assets/videos/rainfall.mp4";
function Products() {
  var products = [
    {
      title: "Arqitel",
      description:
        "With a continuous 3D animation, we showcase Arqitel approach and show how migration data translates into real estate.",
      live: true,
      case: false,
    },
    {
      title: "TTR",
      description:
        "We've created an interactive site using generative AI to allow users to engage with our thinking about Ai, industry trends and design.",
      live: true,
      case: false,
    },
    {
      title: "YIR 2022",
      description:
        "Our second year was filled with great events, exciting projects, awards and amazing people - so we made another showcase to celebrate.",
      live: true,
      case: false,
    },
    {
      title: "Yahoo!",
      description:
        "We enhanced the New York Fashion Week, by creating a fully digital AR fashion experience for Yahoo and Maisie Wilen, featuring holographic 3D models and an integrated web shop.",
      live: true,
      case: true,
    },
    {
      title: "Rainfall",
      description:
        "We crafted a website for Rainfall Ventures, developing prototypes and custom code that ultimately allows their team to update content regularly and with ease.",
      live: true,
      case: true,
    },
  ];

  const [pos, setPos] = useState(0);
  const mover = (val) => {
    setPos(val * 23);
  };
  return (
    <div className="relative py-20 mt-24">
      {products.map((e, i) => {
        return <Product key={i} index={i} val={e} mover={mover} />;
      })}
      <div className="absolute h-full w-full top-0  pointer-events-none">
        <motion.div
          transition={{ ease: [0.76, 0, 0.24, 1], duration: 0.6 }}
          initial={{ y: pos, x: "-50%" }}
          animate={{ y: pos + "rem" }}
          className="window rounded-lg  overflow-hidden -translate-x-[50%] h-[23rem] absolute w-[32rem] left-[44%]"
        >
          <motion.div
            transition={{ ease: [0.76, 0, 0.24, 1], duration: 0.5 }}
            animate={{ y: -pos + "rem" }}
            className="bg-zinc-200 h-full w-full "
          >
            {pos === 0 && (
              <video autoPlay muted loop>
                <source src={arqitel} type="video/webm" />
                Your browser does not support the video tag.
              </video>
            )}
          </motion.div>
          <motion.div
            transition={{ ease: [0.76, 0, 0.24, 1], duration: 0.5 }}
            animate={{ y: -pos + "rem" }}
            className="bg-zinc-300 h-full w-full "
          >
            <video autoPlay muted loop>
              <source src={ttr} type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
          <motion.div
            transition={{ ease: [0.76, 0, 0.24, 1], duration: 0.5 }}
            animate={{ y: -pos + "rem" }}
            className="bg-zinc-400 h-full w-full "
          >
            <video autoPlay muted loop>
              <source src={yir} type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
          <motion.div
            transition={{ ease: [0.76, 0, 0.24, 1], duration: 0.5 }}
            animate={{ y: -pos + "rem" }}
            className="bg-zinc-500 h-full w-full "
          >
            <video autoPlay muted loop>
              <source src={yahoo} type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
          <motion.div
            transition={{ ease: [0.76, 0, 0.24, 1], duration: 0.5 }}
            animate={{ y: -pos + "rem" }}
            className="bg-zinc-600 h-full w-full "
          >
            <video autoPlay muted loop>
              <source src={rainfall} type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Products;
