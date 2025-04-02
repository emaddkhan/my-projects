const fullimageBox = document.getElementById('fullimgBox');
const fullimage = document.getElementById('fullimg');
const leftKey = document.getElementById('leftKey')
const rightKey = document.getElementById('rightKey')
const images = document.querySelectorAll('.image-gallery img')
const fileInput = document.getElementById('fileInput')
const imageGallery = document.querySelector('.image-gallery')
const dotContainer = document.getElementById('dotsContainer')
const introScreen = document.getElementById('introScreen')

let touchStartX = 0;
let touchEndX = 0;
fullimageBox.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0].clientX;
});
fullimageBox.addEventListener("touchmove", (event) => {
    touchEndX = event.touches[0].clientX;
});
fullimageBox.addEventListener("touchend", () => {
    let swipeDistance = touchStartX - touchEndX;

    if (swipeDistance > 50) {
        showNextImage();
    } else if (swipeDistance < -50) {
        showPreviousImage();
    }
});

setTimeout(()=>{
    introScreen.style.opacity='0.9';
},1900)
setTimeout(()=>{
    introScreen.style.opacity='0.85';
},1950)
setTimeout(()=>{
    introScreen.style.opacity='0.8';
},2000)
setTimeout(()=>{
    introScreen.style.opacity='0.75';
},2050)
setTimeout(()=>{
    introScreen.style.opacity='0.7';
},2100)
setTimeout(()=>{
    introScreen.style.opacity='0.65';
},2150)
setTimeout(()=>{
    introScreen.style.opacity='0.6';
},2200)
setTimeout(()=>{
    introScreen.style.opacity='0.55';
},2250)
setTimeout(()=>{
    introScreen.style.opacity='0.5';
},2300)
setTimeout(()=>{
    introScreen.style.opacity='0.45';
},2350)
setTimeout(()=>{
    introScreen.style.opacity='0.4';
},2400)
setTimeout(()=>{
    introScreen.style.opacity='0.35';
},2450)
setTimeout(()=>{
    introScreen.style.opacity='0.3';
},2500)
setTimeout(()=>{
    introScreen.style.opacity='0.25';
},2550)
setTimeout(()=>{
    introScreen.style.opacity='0.2';
},2600)
setTimeout(()=>{
    introScreen.style.opacity='0.15';
},2650)
setTimeout(()=>{
    introScreen.style.opacity='0.1';
},2700)
setTimeout(()=>{
    introScreen.style.opacity='0.05';
},2750)
setTimeout(()=>{
    introScreen.style.opacity='0';
    introScreen.style.display='none'
},2800)


fileInput.addEventListener('change',function(event){
    const file = event.target.files[0];
    if(file){
        const reader = new FileReader();
        reader.onload = function(e){
            addImageToGallery(e.target.result);
        }
        reader.readAsDataURL(file);
    }
})

function generateDots(){
    dotContainer.innerHTML='';
    imagesArray.forEach((_,index)=>{
        const dot = document.createElement('div');
        dot.classList.add('dot')
        if(index===currentindex)dot.classList.add('active')
            dot.addEventListener('click',()=>showImageAtIndex(index))
        dotContainer.appendChild(dot)
    })
}
function updateDots() {
    document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentindex);
    });
}

function addImageToGallery(src){
    const div =document.createElement('div')
    div.classList.add('overflow-hidden')
    const img = document.createElement('img')
    img.src = src
    img.onclick = function(){openFullImage(img.src);};
    div.appendChild(img);
    imageGallery.appendChild(div)
    imagesArray.push(src)
    generateDots();
}

let currentindex =0;
const imagesArray = Array.from(images).map((img) => img.src);

function openFullImage(pic) {
    fullimageBox.style.display = 'flex';
    currentindex = imagesArray.indexOf(pic)
    fullimage.src = pic;
    updateDots();
}
function closeFullImage(){
    fullimageBox.style.display = 'none';
    updateDots();
}
function showNextImage(){
    currentindex = (currentindex + 1) % imagesArray.length;
    fullimage.src = imagesArray[currentindex];
    updateDots()
    rightKey.style.boxShadow = "0px 0px 45px rgba(255, 255, 255, 0.5)";
    setTimeout(() => {
        rightKey.style.boxShadow = "0px 0px 5px rgba(255, 255, 255, 0.3)";
    }, 300);
    setTimeout(() => {
        rightKey.style.boxShadow = "0px 0px 5px rgba(255, 255, 255, 0.3)";
    }, 500);
    
}
function showPreviousImage(){
    currentindex = (currentindex - 1 + imagesArray.length) % imagesArray.length;
    fullimage.src = imagesArray[currentindex];
    updateDots();

    leftKey.style.boxShadow = "0px 0px 45px rgba(255, 255, 255, 0.5)";
    setTimeout(() => {
        leftKey.style.boxShadow = "0px 0px 5px rgba(255, 255, 255, 0.3)";
    }, 300);
    setTimeout(() => {
        leftKey.style.boxShadow = "0px 0px 5px rgba(255, 255, 255, 0.3)";
    }, 500);
}
function showImageAtIndex(index){
 currentindex=index;
 fullimage.src=imagesArray[currentindex];
 updateDots()
}

rightKey.addEventListener("click", showNextImage);
leftKey.addEventListener("click", showPreviousImage);

document.addEventListener("keydown",(event)=>{
    if(fullimageBox.style.display === 'flex'){
        if(event.key === 'ArrowRight') showNextImage();
        if(event.key === 'ArrowLeft') showPreviousImage();
        if(event.key === 'Escape') closeFullImage();
    }
})
generateDots();

