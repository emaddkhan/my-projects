import React from 'react';

function NavElem({ sectionRefs }) {
  const handleScroll = (sectionName) => {
    const ref = sectionRefs[sectionName];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex justify-between mr-4">
      {['Home', 'AboutMe', 'Contact'].map((item, index) => (
        <a
  key={index}
  onClick={() => handleScroll(item)}
  className="text-xl text-brand-white cursor-pointer transition-all duration-300 hover:text-brand-cyan hover:drop-shadow-[0_0_15px_rgba(0,255,255,0.9)]"
>
  {item}
</a>

      ))}
    </div>
  );
}

export default NavElem;
