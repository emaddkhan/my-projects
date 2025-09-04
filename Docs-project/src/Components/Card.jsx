import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { CiMenuKebab } from "react-icons/ci";
import { BiUndo } from "react-icons/bi";
import { IoMdArrowDropdownCircle } from "react-icons/io";
import CardBgPicker from "./color pickers/CardBgPicker";
import CardFontPicker from "./color pickers/CardFontPicker";

function Card({
  data,
  reference,
  deleteRef,
  onDragStart,
  onDragEnd,
  isActive,
  setIsOverDelete,
}) {
  const [overDelete, setOverDelete] = useState(false);
  const [showCardSetting, setCardSetting] = useState(false);
  const [showCardBg, setCardBg] = useState(false);
  const [cardBgColor, setCardBgColor] = useState("rgba(24,24,27,0.9)");
  const [showCardFont, setShowCardFont] = useState(false);
  const [cardFontColor, setCardFontColor] = useState("#ffffff");

  const bgKey = `card-bg-${data.email}`;
  const fontKey = `card-font-${data.email}`;

  useEffect(() => {
    const savedBg = localStorage.getItem(bgKey);
    const savedFont = localStorage.getItem(fontKey);

    if (savedBg) setCardBgColor(savedBg);
    if (savedFont) setCardFontColor(savedFont);
  }, [bgKey, fontKey]);

  const handleBgColorChange = (color) => {
    setCardBgColor(color);
    localStorage.setItem(bgKey, color);
  };

  const handleFontColorChange = (color) => {
    setCardFontColor(color);
    localStorage.setItem(fontKey, color);
  };

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
      style={{
        background: isActive && overDelete ? "rgb(220,38,38)" : cardBgColor,
        color: cardFontColor, 
      }}
      className="flex-shrink-0 relative w-60 h-72 px-3 py-10 rounded-[45px] overflow-hidden"
    >
      <button className="absolute flex right-3 top-5 justify-end">
        <CiMenuKebab
          onClick={() => setCardSetting(!showCardSetting)}
          className="text-2xl"
        />
      </button>

      {showCardSetting && (
        <div className="w-full h-full top-0 left-0 bg-zinc-800 absolute">
          <button onClick={() => setCardSetting(!showCardSetting)}>
            <BiUndo className="top-5 left-5 absolute text-2xl text-white" />
          </button>

          <div
            onClick={() => setCardBg(!showCardBg)}
            className="px-5 py-1 mt-5 cursor-pointer flex justify-between items-center"
          >
            <h3 className="font-semibold">Card Background</h3>
            <IoMdArrowDropdownCircle
              className={`text-xl transition-transform duration-300 ${
                showCardBg ? "rotate-180" : ""
              }`}
            />
          </div>
          {showCardBg && (
            <CardBgPicker
              showCardBg={showCardBg}
              onColorChange={handleBgColorChange}
              setCardSetting={setCardSetting}
            />
          )}

          <div
            onClick={() => setShowCardFont(!showCardFont)}
            className="px-5 py-1 mt-5 cursor-pointer flex justify-between items-center"
          >
            <h3 className="font-semibold">Card Font Color</h3>
            <IoMdArrowDropdownCircle
              className={`text-xl transition-transform duration-300 ${
                showCardFont ? "rotate-180" : ""
              }`}
            />
          </div>
          {showCardFont && (
            <CardFontPicker
              showCardFont={showCardFont}
              onColorChange={handleFontColorChange}
              setCardSetting={setCardSetting}
            />
          )}
        </div>
      )}

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

export default Card;
