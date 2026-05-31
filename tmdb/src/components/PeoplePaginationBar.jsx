import React from "react";
import arrow from "../assets/back.jpg";

function PeoplePaginationBar({ page, totalPages, setPage }) {
  const renderPages = () => {
    const pages = [];

    const isStart = page <= 3;
    const isEnd = page === totalPages;

    // CASE 1: START (1,2,3)
    if (isStart) {
      pages.push(1);

      for (let i = 2; i <= 3 && i < totalPages; i++) {
        pages.push(i);
      }

      if (totalPages > 4) pages.push("...");
      if (totalPages > 1) pages.push(totalPages);

      return pages;
    }

    // CASE 2: END (ONLY 1 ... LAST)
    if (isEnd) {
      return [1, "...", totalPages];
    }

    // CASE 3: MIDDLE (1 ... current ... last)
    return [1, "...", page, "...", totalPages];
  };

  return (
    <div className="w-full flex justify-center mt-6">
      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">

        {/* Back */}
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 disabled:opacity-40 cursor-pointer"
        >
          <img src={arrow} alt="Back" className="w-4 h-4" />
        </button>

        {/* Pages */}
        {renderPages().map((p, i) =>
          p === "..." ? (
            <span key={i} className="text-xs px-4 cursor-pointer py-2">
              ...
            </span>
          ) : (
            <button
              key={i}
              onClick={() => setPage(p)}
              className={`px-4 py-2 text-xs  border-l cursor-pointer border-gray-200 ${
                page === p ? "bg-[#01B4E4] text-white font-bold" : ""
              }`}
            >
              {p}
            </button>
          )
        )}

        {/* Forward */}
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 border-l border-gray-200 disabled:opacity-40 cursor-pointer"
        >
                    <img src={arrow} alt="Back" className="rotate-180 w-4 h-4" />

        </button>

      </div>
    </div>
  );
}

export default PeoplePaginationBar;