import React from "react";
import html from "../assets/html.png";
import css from "../assets/css.png";
import javascript from "../assets/js.png";
import tailwind from "../assets/tailwind.png";
import react from "../assets/react.png";
import git from "../assets/git.png";
import figma from "../assets/figma.png";
import photoshop from "../assets/photoshop.png";
import "../css/about.css";

function About() {
  return (
    <div id="about" className="w-full about h-screen">
      <div className="w-[90%] mx-auto aboutContainer px-10 py-10 h-full ">
        <div className=" w-full h-full">
          <div className="h-[33%] aboutParaContainer px-3 py-5 w-full bg-brand-navGrey rounded-2xl">
            <h3 className="text-white text-3xl mt-8 aboutHeading font-bold">
              About Me
            </h3>
            <p className="text-white mt-3 aboutPara font-semibold">
              I’m Emad Khan, a frontend developer with a passion for building
              smooth, responsive, and creative web experiences. Over time, I’ve
              worked on projects that range from simple task apps to complete
              animated portfolio websites, always focusing on clean design and
              usability. I enjoy working with HTML, CSS, JavaScript, React, and
              Tailwind CSS, and I like adding motion with tools like GSAP and
              Locomotive Scroll to make websites feel more engaging. For me,
              coding is more than just writing functions—it’s about solving
              problems, experimenting with new ideas, and shaping digital
              experiences that people enjoy using. I’m always learning,
              improving, and pushing my creativity forward.
            </p>
          </div>
          <div className="h-[31%] aboutSecDiv my-[1%] w-full flex items-center justify-between ">
            <div className="w-[49%] eduContainer px-5 py-3 h-full bg-brand-navGrey rounded-2xl">
              <h4 className="text-white font-bold eduHeading text-2xl mt-2">
                Education
              </h4>
              <ul className="list-disc adoutList list-outside ml-5 text-white py-2">
                {[
                  "DHA Suffa University — BS Software Engineering (Ongoing)",
                  "SSAT Degree College — Intermediate",
                ].map((item, i) => {
                  return <li className="aboutLi text-sm">{item}</li>;
                })}
              </ul>
            </div>
            <div className="w-[49%] h-full bg-brand-navGrey certificateContainer px-5 py-3 rounded-2xl">
              <h4 className="text-white font-bold text-2xl certificationHeading mt-2">
                Certifications & Courses
              </h4>
              <ul className="list-disc adoutList list-outside ml-5 text-white py-2">
                {[
                  "Frontend Development Course — Squads Coders Dev (2023)",
                  "Frontend Development Course — Sheryians Coding School (2024)",
                  "Frontend Development Internship — CodeAlpha (2025)",
                ].map((item, i) => {
                  return <li className="aboutLi text-sm">{item}</li>;
                })}
              </ul>
            </div>
          </div>
          <div className="h-[31%] px-5 py-3 abSkillsContainer rounded-2xl w-full bg-brand-navGrey">
            <h4 className="text-white font-bold text-2xl educationHeading mt-2">
              Skills & Technologies
            </h4>
            <div className="mt-5 aboutSkills flex gap-5 items-center">
              {[
                html,
                css,
                javascript,
                tailwind,
                react,
                git,
                figma,
                photoshop,
              ].map((item, i) => {
                return <img className="aboutImgs" src={item} alt="" />;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
