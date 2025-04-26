var tl = gsap.timeline();

tl.set("#main", { overflowY: "hidden" });

tl.to("#page1", {
  y: "100vh",
  scale: 0.6,
  duration: 0,
})
  .to("#page1", {
    y: "30vh",
    duration: 1,
    delay: 1,
  })
  .to("#page1", {
    y: "0vh",
    rotation: 360,
    scale: 1,
    duration: 0.8,
  });
tl.set("#main", { overflowY: "auto" });
