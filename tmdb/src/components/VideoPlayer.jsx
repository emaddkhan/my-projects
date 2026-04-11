import React, { useEffect } from "react";

function VideoPlayer({ trailorLoading,videoKey, setVideoKey }) {
  // ESC press se close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setVideoKey(null);
        window.location.hash = "";
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setVideoKey]);

  if (!videoKey) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      
      <div className="relative w-[75%] h-[90%]">

        <iframe
          className="w-full h-full rounded-xl"
          src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
          title="Trailer"
          allow="autoplay; encrypted-media"
          allowFullScreen
        >   </iframe>
        {trailorLoading && (
          <div className="flex flex-col items-center gap-3">
            
            {/* YouTube style blue spinner */}
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

            <p className="text-blue-500 text-sm font-semibold">
              Loading video...
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default VideoPlayer;