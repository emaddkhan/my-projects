import React, { useState, useEffect, useRef } from "react";

function MouseFollower() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [circlePos, setCirclePos] = useState({ x: 0, y: 0 });
  const [color, setColor] = useState("white");
  const requestRef = useRef();

  useEffect(() => {
    const moveHandler = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el) {
        const bg = window.getComputedStyle(el).backgroundColor;
        if (bg === "rgb(255, 255, 255)") {
          setColor("black");
        } else {
          setColor("white");
        }
      }
    };

    window.addEventListener("mousemove", moveHandler);
    return () => window.removeEventListener("mousemove", moveHandler);
  }, []);

  useEffect(() => {
    const animate = () => {
      setCirclePos((prev) => ({
        x: prev.x + (position.x - prev.x) * 0.25, 
        y: prev.y + (position.y - prev.y) * 0.25,
      }));
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [position]);

  return (
    <div
      className="h-8 w-8 z-[99]  fixed rounded-full pointer-events-none mix-blend-difference"
      style={{
        border: `2px solid ${color}`,
        transform: `translate(${circlePos.x - 16}px, ${circlePos.y - 16}px)`,
      }}
    ></div>
  );
}

export default MouseFollower;
