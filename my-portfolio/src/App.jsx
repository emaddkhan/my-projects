import React, { useRef } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import AboutMe from './components/AboutMe';
import Work from './components/Work';
import Form from './components/Form';
import Footer from './components/Footer';

function App() {
  const landingRef = useRef(null);
  const aboutRef = useRef(null);
  const workRef = useRef(null);        
  const contactRef = useRef(null);

  const sectionRefs = {
    Home: landingRef,
    AboutMe: aboutRef,
    Work: workRef, 
    Contact: contactRef
  };

  return (
    <div className='w-full h-full bg-brand-blue flex justify-center'>
      <div className='w-full h-full'>
        <Navbar sectionRefs={sectionRefs} />
        <div ref={landingRef}>
          <LandingPage sectionRefs={[landingRef, aboutRef, workRef, contactRef]} />
        </div>
        <div ref={aboutRef}>
          <AboutMe />
        </div>
        <div ref={workRef}> 
          <Work />
        </div>
        <div ref={contactRef}>
          <Form />
        </div>
        <Footer sectionRefs={sectionRefs}  />
      </div>
    </div>
  );
}

export default App;
