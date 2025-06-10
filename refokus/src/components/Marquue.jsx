import { motion } from "framer-motion";
import React from "react";

function Marquue({ images, direction }) {
  return (
    <div className="flex w-full gap-28 py-4 overflow-hidden whitespace-nowrap">
      <motion.div
        initial={{ x: direction === "left" ? 0 : "-100%" }}
        animate={{ x: direction === "left" ? "-100%" : 0 }}
        transition={{ ease: "linear", duration: 15, repeat: Infinity }}
        className="flex flex-shrink-0 gap-40 py-10 pr-40"
      >
        {images.map((url, index) => (
          <img key={index} src={url} alt={`img-${index}`} className="" />
        ))}
      </motion.div>
      <motion.div
        initial={{ x: direction === "left" ? 0 : "-100%" }}
        animate={{ x: direction === "left" ? "-100%" : 0 }}
        transition={{ ease: "linear", duration: 15, repeat: Infinity }}
        className="flex flex-shrink-0 gap-40 py-10 pr-40"
      >
        {images.map((url, index) => (
          <img key={index} src={url} alt={`img-${index + images.length}`} className="" />
        ))}
      </motion.div>
    </div>
  );
}

export default Marquue;
