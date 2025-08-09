import React from "react";
import html from "../assets/html.png"
import css from "../assets/css.png"
import javascript from "../assets/js.png"
import tailwind from "../assets/tailwind.png"
import react from "../assets/react.png"
import git from "../assets/git.png"
import figma from "../assets/figma.png"
import photoshop from "../assets/photoshop.png"
import "../css/about.css"

function About() {
  return (
    <div id="about" className="w-full about h-screen">
      <div className="w-[90%] mx-auto aboutContainer px-10 py-10 h-full ">
        <div className=" w-full h-full">
          <div className="h-[33%] px-3 py-5 w-full bg-brand-navGrey rounded-2xl">
            <h3 className="text-white text-3xl mt-8 aboutHeading font-bold">About Me</h3>
            <p className="text-white mt-3 aboutPara font-semibold">
              I’m Mokete Elias Tyabekana, a passionate Frontend Developer &
              UI/UX Designer with expertise in React, JavaScript, and Tailwind
              CSS, dedicated to building responsive and user-friendly
              applications. With a Diploma in Information Technology from
              Central University of Technology, Free State, I have experience in
              web development, UI/UX design, and IT support, having worked as an
              IT Officer at Softstart BTI (Botshabelo Digital Hub), where I
              mentored interns and assisted startups. I enjoy transforming ideas
              into digital experiences, whether through intuitive UI designs in
              Figma or developing scalable web applications. Currently, I’m
              expanding my knowledge in React Native and working on projects
              that merge creativity with functionality to solve real-world
              problems.
            </p>
          </div>
          <div className="h-[31%] aboutSecDiv my-[1%] w-full flex items-center justify-between ">
            <div className="w-[49%] px-5 py-3 h-full bg-brand-navGrey rounded-2xl">
              <h4 className="text-white font-bold eduHeading text-2xl mt-2">Education</h4>
              <ul className="list-disc adoutList list-inside text-white py-2">
                {[
                  "Diploma in Information Technology",
                  "National Senior Certificate [Grade 12/Matric]",
                ].map((item, i) => {
                  return <li className="text-sm">{item}</li>;
                })}
              </ul>
            </div>
            <div className="w-[49%] h-full bg-brand-navGrey px-5 py-3 rounded-2xl">
                <h4 className="text-white font-bold text-2xl certificationHeading mt-2">Certifications & Courses</h4>
              <ul className="list-disc adoutList list-inside text-white py-2">
                {[
                  "Front-End Web Development Program [ALX Africa]",
                  "National Senior Certificate [freeCodeCamp]",
                  "Web Programming Foundations [LinkedIn]",
                  "HTML Essential Training [LinkedIn]",
                  "JavaScript Essentials [Cisco]",
                  "Professional  Foundations [ALX Africa]",
                ].map((item, i) => {
                  return <li className="text-sm">{item}</li>;
                })}
              </ul>
            </div>
          </div>
          <div className="h-[31%] px-5 py-3 abSkillsContainer rounded-2xl w-full bg-brand-navGrey">
              <h4 className="text-white font-bold text-2xl educationHeading mt-2">Education</h4>
              <div className="mt-5 aboutSkills flex gap-5 items-center">
                {[html,css,javascript,tailwind,react,git,figma,photoshop].map((item,i)=>{
                    return(
                <img className="aboutImgs" src={item} alt="" />

                    )
                })}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
