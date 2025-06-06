import { motion } from "motion/react";
import React from "react";
function Marquue({ images }) {
  return (
    <div className="flex w-full gap-28 py-8  overflow-hidden whitespace-nowrap ">
      <motion.div initial={{x:"0"}} animate={{x:"-100%"}} transition={{ease:"linear",duration:10,repeat:Infinity}} className="flex flex-shrink-0 gap-40 py-10 pr-40">
        {images.map((url) => (
          <img src={url} className="" />
        ))}
      </motion.div>
      <motion.div initial={{x:"0"}} animate={{x:"-100%"}} transition={{ease:"linear",duration:10,repeat:Infinity}} className="flex flex-shrink-0 gap-40 py-10 pr-40">
        {images.map((url) => (
          <img src={url} className="" />
        ))}
      </motion.div>
    </div>
  );
}

export default Marquue;
