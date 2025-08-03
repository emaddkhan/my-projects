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
          className="text-xl cursor-pointer hover:text-brand-cyan text-brand-white"
        >
          {item}
        </a>
      ))}
    </div>
  );
}

export default NavElem;
