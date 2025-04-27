const videoContainer = document.querySelector(".videoContainer");
const page2Video = document.querySelector(".videoContainer video");
const videoCursor = document.querySelector("#video-cursor");
const hero3 = document.querySelector("#hero3");
const aboutPara = document.querySelector(".aboutPara")
function locomotiveAnimation() {
  const scroll = new LocomotiveScroll({
    el: document.querySelector("#main"),
    smooth: true,
  });

  gsap.registerPlugin(ScrollTrigger);

  // Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll

  const locoScroll = new LocomotiveScroll({
    el: document.querySelector("#main"),
    smooth: true,
  });
  // each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
  locoScroll.on("scroll", ScrollTrigger.update);

  // tell ScrollTrigger to use these proxy methods for the "#main" element since Locomotive Scroll is hijacking things
  ScrollTrigger.scrollerProxy("#main", {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, 0, 0)
        : locoScroll.scroll.instance.scroll.y;
    }, // we don't have to define a scrollLeft because we're only scrolling vertically.
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
    pinType: document.querySelector("#main").style.transform
      ? "transform"
      : "fixed",
  });
  // each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll.
  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

  // after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
  ScrollTrigger.refresh();
}
function loadindAnimation() {
  const h5Timer = document.querySelector("#line1Part1 h5");

  function loaderTimer() {
    let grow = 0;
    setInterval(function () {
      if (grow < 100) {
        h5Timer.innerHTML = grow++;
      } else {
        h5Timer.innerHTML = grow;
      }
    }, 33); //baad me iski value bhi 33ms kroonga project k baad
  }

  const tl = gsap.timeline();

  tl.from(".line h1", {
    y: 150,
    stagger: 0.2,
    duration: 0.6,
    delay: 0.5,
  });

  tl.from("#line1Part1", {
    opacity: 0,
    onStart: function () {
      loaderTimer();
    },
  });
  tl.to(" .line h2", {
    animationName: "lineH2",
    opacity: 1,
  });

  tl.to("#loader", {
    opacity: 0,
    delay: 4, //duration baad me 4 kroonga project k baad
    duration: 0.2,
  });
  tl.from("#page1", {
    y: 1600,
    duration: 0.2,
    opacity: 0,
    ease: Power4,
  });

  tl.to("#loader", {
    display: "none",
  });
  tl.from("#nav", {
    opacity: 0,
  });
  tl.from("#hero1 h1,#hero2 h1,#hero3 h2,#hero3 h3,#hero4 h1", {
    y: 120,
    stagger: 0.1,
  });
  tl.from(
    "#hero1,#page2",
    {
      opacity: 0,
    },
    "-=1"
  );
}
function cursorAnimation() {
  const cursor = document.querySelector("#cursor");
  let mouseX = 0;
  let mouseY = 0;
  let posX = 0;
  let posY = 0;
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    posX += (mouseX - posX) * 0.1;
    posY += (mouseY - posY) * 0.1;

    gsap.set(cursor, {
      left: posX,
      top: posY,
    });

    requestAnimationFrame(animateCursor);
  }

  animateCursor();
  Shery.makeMagnet("#navPart2 h4", {
    ease: "cubic-bezier(0.23, 1, 0.320, 1)",
    duration: 1,
  });
  videoContainer.addEventListener('mouseenter',()=>{
    videoContainer.addEventListener('mousemove',function(dets){
      gsap.to("#cursor",{
        opacity:0,
      })
      gsap.to("#video-cursor",{
        top:dets.y - 300,
        left:dets.x - 570,
      })
    })
  })
  videoContainer.addEventListener("mouseleave",function(){
    gsap.to("#cursor",{
      opacity:1,
    })
    gsap.to("#video-cursor",{
      top: "-10%",
      left:"80%",
    })
  })
  var flag =0;
  videoContainer.addEventListener("click",function(){
    if(flag==0){
      page2Video.play(),
    page2Video.style.opacity =1;
    videoCursor.innerHTML=`<i class="ri-pause-line"></i>`
    gsap.to("#video-cursor",{
      scale:0.5,
    })
    flag=1
    }else{
      page2Video.pause(),
    page2Video.style.opacity =0;
    videoCursor.innerHTML=`<i class="ri-play-fill"></i>`
    gsap.to("#video-cursor",{
      scale:1,
    })
    flag=0
    }
  })
}
function sheryAnimation() {
  Shery.imageEffect(".imgDiv", {
    style: 6 ,
    config: {
      a: { value: 2, range: [0, 30] },
      b: { value: 0.7, range: [-1, 1] },
      zindex: { value: -9996999, range: [-9999999, 9999999] },
      aspect: { value: 0.7272749691738595 },
      ignoreShapeAspect: { value: true },
      shapePosition: { value: { x: 0, y: 0 } },
      shapeScale: { value: { x: 0.5, y: 0.5 } },
      shapeEdgeSoftness: { value: 0, range: [0, 0.5] },
      shapeRadius: { value: 0, range: [0, 2] },
      currentScroll: { value: 0 },
      scrollLerp: { value: 0.07 },
      gooey: { value: true },
      infiniteGooey: { value: false },
      growSize: { value: 4, range: [1, 15] },
      durationOut: { value: 1, range: [0.1, 5] },
      durationIn: { value: 1.5, range: [0.1, 5] },
      displaceAmount: { value: 0.5 },
      masker: { value: true },
      maskVal: { value: 1.31, range: [1, 5] },
      scrollType: { value: 0 },
      geoVertex: { range: [1, 64], value: 1 },
      noEffectGooey: { value: true },
      onMouse: { value: 0 },
      noise_speed: { value: 0.61, range: [0, 10] },
      metaball: { value: 0.5, range: [0, 2] },
      discard_threshold: { value: 0.5, range: [0, 1] },
      antialias_threshold: { value: 0, range: [0, 0.1] },
      noise_height: { value: 0.43, range: [0, 2] },
      noise_scale: { value: 7.63, range: [0, 100] },
    },
    gooey: true,
  });
}
function flagAnimation(){
  document.addEventListener("mousemove",function(dets){
    gsap.to("#flag",{
      top:dets.y,
      left:dets.x
    })
  })
  hero3.addEventListener("mouseenter",function(){
    gsap.to("#flag",{
      opacity:1,
    })
  })
  hero3.addEventListener("mouseleave",function(){
    gsap.to("#flag",{
      opacity:0,
    })
  })
}
function textAnimation(){
const footerH1 = document.querySelector(".footerH1")

  footerH1.addEventListener("mouseenter", function () {
    gsap.fromTo(
      ".footerH1",
      { opacity: 0 },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        delay: 0.2,
        onStart: function () {
          if (window.jQuery) {
            footerH1.classList.add("txtTransformation")
            $('#footer h1').textillate({ in: { effect: 'fadeIn' } });
          }
        }
      }
    );
  });

  footerH1.addEventListener("mouseleave", function () {
    gsap.from(".footerH1", {
      opacity: 0,
      x:0,
      duration: 1,
      onStart: function () {
        if (window.jQuery) {
          footerH1.classList.remove("txtTransformation")
          $('#footer h1').textillate({ in: { effect: 'fadeOut' } });
        }
      }
    });
  });
}
function letterAnimation(){
  let clutter = "";
  const splitedAboutPara = aboutPara.textContent.split("");
  splitedAboutPara.forEach(function(char){
    clutter += `<span>${char}</span>`;
  });
  aboutPara.innerHTML = clutter;
  gsap.to(".aboutPara span", {
    opacity: 1,
    stagger: 0.1,
    scrollTrigger: {
      trigger: "#page4",
      scroller: "#main",
      start: "top 20%",
      end: "top -10%",
      scrub: 2,
    }
  });
}


locomotiveAnimation();
loadindAnimation();
cursorAnimation();
sheryAnimation();
flagAnimation();
textAnimation();
letterAnimation();



