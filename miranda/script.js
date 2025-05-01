const card1 = document.querySelector("#card1")
const card2 = document.querySelector("#card2")
const card3 = document.querySelector("#card3")
const card4 = document.querySelector("#card4")
const scroll = new LocomotiveScroll({
    el: document.querySelector('#main'),
    smooth: true
  });
  
  scroll.update();

var tl = gsap.timeline()

tl.to("#page1",{
    y:"100vh",
    scale:0.6,
    duration:0
})
tl.to("#page1",{
    y:"30vh",
    duration:1,
    delay:1
})
tl.to("#page1",{
    y:"0vh",
    rotate:360,
    scale:1,
    duration:0.7
})
function cardsAnimation() {
    function card1Animation(){
        card1.addEventListener("mouseenter", () => {
            gsap.to(card2, {
                left: "39%",
                duration: 0.8,
            });
            gsap.to(card3, {
                left: "55%",
                duration: 0.8,
            });
            gsap.to(card4, {
                left: "70%",
                duration: 0.8,
            });
        });
        card1.addEventListener("mouseleave", () => {
            gsap.to(card2, {
                left: "19%",
                duration: 0.8,
            });
            gsap.to(card3, {
                left: "39%",
                duration: 0.8,
            });
            gsap.to(card4, {
                left: "55%",
                duration: 0.8,
            });
        });
    }
    function card2Animation(){
        card2.addEventListener("mouseenter", () => {
            gsap.to(card3, {
                left: "58%",
                duration: 0.8,
            });
            gsap.to(card4, {
                left: "70%",
                duration: 0.8,
            });
        });
        card2.addEventListener("mouseleave", () => {
            gsap.to(card3, {
                left: "39%",
                duration: 0.8,
            });
            gsap.to(card4, {
                left: "55%",
                duration: 0.8,
            });
        });
    }
    function card3Animation(){
        card3.addEventListener("mouseenter", () => {
            gsap.to(card2, {
                left: "12%",
                duration: 0.8,
            });
            gsap.to(card3, {
                left: "29%",
                duration: 0.8,
            });
            gsap.to(card4, {
                left: "68%",
                duration: 0.8,
            });
        });
        card3.addEventListener("mouseleave", () => {
            gsap.to(card2, {
                left: "19%",
                duration: 0.8,
            });
            gsap.to(card3, {
                left: "39%",
                duration: 0.8,
            });
            gsap.to(card4, {
                left: "55%",
                duration: 0.8,
            });
        });
    }
    card1Animation();
    card2Animation();
    card3Animation();

}

cardsAnimation();
