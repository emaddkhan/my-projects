import React, { useEffect, useState } from 'react';

function IntroScreen({setIsLoading}) {
  const [loadVal, setLoadVal] = useState(0);
   useEffect(() => {
    const interval = setInterval(() => {
      setLoadVal(prev => {
        if (prev < 100) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(setIsLoading(false),500)
          return prev;
        }
      });
    }, 50);
    return () => clearInterval(interval);
  }, [setIsLoading]);

  return (
    <div className='w-full h-screen'>
      <div
        className='h-2 bg-[#7542ff]'
        style={{ width: `${loadVal}%`, transition: 'width 0.1s linear' }}
      ></div>
      <div className='py-1 w-full flex justify-end'>
        <h1 className='text-[#42474c] text-[15vw] leading-none items-start '>
          {loadVal}<span className='text-[#7542ff]'>%</span>
        </h1>
      </div>
    </div>
  );
}

export default IntroScreen;
