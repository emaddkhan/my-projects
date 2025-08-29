import { useState } from "react";
import { motion } from "motion/react";


function Card({ data, reference, deleteRef, onDragStart, onDragEnd, isActive, setIsOverDelete }) {
  const [overDelete, setOverDelete] = useState(false);

  const handleDrag = (event, info) => {
    const deleteEl = deleteRef?.current;
    if (!deleteEl) return;

    const deleteRect = deleteEl.getBoundingClientRect();
    const { x, y } = info.point;

    const inside =
      x > deleteRect.left &&
      x < deleteRect.right &&
      y > deleteRect.top &&
      y < deleteRect.bottom;

    setOverDelete(inside);
    setIsOverDelete(inside);
  };

  return (
    <motion.div
      drag
      dragConstraints={reference}
      whileDrag={{ scale: 1.1 }}
      dragElastic={0.1}
      dragTransition={{ bounceStiffness: 100, bounceDamping: 30 }}
      onDragStart={onDragStart}
      onDragEnd={() => {
        setOverDelete(false);
        setIsOverDelete(false);
        onDragEnd();
      }}
      onDrag={handleDrag}
      className={`flex-shrink-0 relative w-60 h-72 text-white px-3 py-10 rounded-[45px] overflow-hidden 
        ${isActive && overDelete ? "bg-red-600" : "bg-zinc-900/90"}`}
    >
      <div className="w-16 h-16 mx-auto rounded-full overflow-hidden">
        <img className="h-full w-full" src={data.picture.large} alt="" />
      </div>
      <h3 className="text-center text-md font-semibold mt-5">
        {data.name.title} {data.name.first} {data.name.last}
      </h3>
      <p className="mt-2">Cell: {data.cell}</p>
      <p>Phone: {data.phone}</p>
      <p className="flex items-center gap-1">
        Email: <span className="text-sm">{data.email}</span>
      </p>
      <p>Country: {data.location.country}</p>
    </motion.div>
  );
}
export default Card