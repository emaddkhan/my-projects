import React, { useState } from 'react'
import { PiCheckFatFill } from 'react-icons/pi';

function CardBgPicker({ showCardBg, onColorChange,setCardSetting }) {
  const [hue, setHue] = useState(0);
  const [lightness, setLightness] = useState(50);

  const hslToHex = (h, s, l) => {
    s /= 100;
    l /= 100;

    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

    return (
      "#" +
      [f(0), f(8), f(4)]
        .map((x) =>
          Math.round(x * 255)
            .toString(16)
            .padStart(2, "0")
        )
        .join("")
        .toUpperCase()
    );
  };

  const hex = hslToHex(hue, 100, lightness);

  const setColorHandler = () => {
    onColorChange(hex); 
    setCardSetting(false)
  };

  return (
    <div
      className={`px-5 space-y-3 overflow-hidden transition-all duration-500 ease-in-out
        ${showCardBg ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}
    >
      <div>
        <label className="block font-semibold">Hue</label>
        <input
          type="range"
          min="0"
          max="360"
          value={hue}
          onChange={(e) => setHue(Number(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{
            background:
              "linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red)",
          }}
        />
      </div>

      <div>
        <label className="block font-semibold">Lightness</label>
        <input
          type="range"
          min="0"
          max="100"
          value={lightness}
          onChange={(e) => setLightness(Number(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, black, hsl(${hue},100%,50%), white)`,
          }}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div
          className="h-4 w-20 rounded-lg border shadow"
          style={{ background: hex }}
        />
        <button
          onClick={setColorHandler}
          className="p-2 rounded-lg hover:bg-green-100 transition"
        >
          <PiCheckFatFill className="text-2xl text-green-600" />
        </button>
      </div>
    </div>
  );
}

export default CardBgPicker;
