import React from "react";

function RatingCircle({ value }) {
  const percent = Math.round(value * 10);
  const radius = 22;
  const circumference = 2 * Math.PI * radius;

  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative w-12 h-12">

      <svg className="w-12 h-12 -rotate-90">
        {/* background circle */}
        <circle
          cx="24"
          cy="24"
          r={radius}
          stroke="#204529"
          strokeWidth="4"
          fill="none"
        />

        {/* progress circle */}
        <circle
          cx="24"
          cy="24"
          r={radius}
          stroke="#21d07a"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>

      {/* text center */}
      <div className="absolute inset-0 flex items-center justify-center text-white text-[.9vw] font-bold">
        {percent}<sup className="text-[.4vw]">%</sup>
      </div>

    </div>
  );
}

export default RatingCircle;