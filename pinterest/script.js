const imgContainer = document.querySelector('.container');
const overlay = document.querySelector('.overlay');
const searchInput = document.querySelector('#searchinput');
const searchData = document.querySelector('.searchdata');
const fullImage = document.querySelector('.fullImage');
const fImg = document.querySelector('#fimg');
const dotsContainer = document.querySelector(".dotsContainer");
const prevBtn = document.querySelector(".previous");
const nextBtn = document.querySelector(".next");

const arr = [
    {name: "Petals of roses", image: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=3786&auto=format&fit=crop"},
    {name: "Animals of town", image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2688&auto=format&fit=crop"},
    {name: "The crowd of city", image: "https://images.unsplash.com/photo-1517732306149-e8f829eb588a?q=80&w=3872&auto=format&fit=crop"},
    {name: "Fruits of planet", image: "https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?q=80&w=3764&auto=format&fit=crop"},
    {name: "Orange peeled", image: "https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=3337&auto=format&fit=crop"},
    {name: "Web design", image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=3870&auto=format&fit=crop"},
    {name: "Nature", image: "https://images.unsplash.com/photo-1743031031848-d1cb97c18395?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyMHx8fGVufDB8fHx8fA%3D%3D"},
    {name: "Car", image: "https://images.unsplash.com/photo-1742243305573-f5eada1d1490?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D"},
    {name: "Library", image: "https://images.unsplash.com/photo-1741850820882-1cb02da0f04f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzMHx8fGVufDB8fHx8fA%3D%3D"},
    {name: "Art gallery", image: "https://images.unsplash.com/photo-1545989253-02cc26577f88?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGFydHxlbnwwfHwwfHx8MA%3D%3D"},
    {name: "Modern civilization", image: "https://images.unsplash.com/photo-1742472194048-13ebb038a5fc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3Nnx8fGVufDB8fHx8fA%3D%3D"},
    {name: "Apple juice", image: "https://images.unsplash.com/photo-1576673442511-7e39b6545c87?q=80&w=3456&auto=format&fit=crop"},
];
let currentIndex = 0;
function showTheCards() {
    let clutter = "";
    arr.forEach((obj, index) => {
        clutter += `<div class="box cursor-pointer" data-index="${index}">
            <img src="${obj.image}" alt="${obj.name}" class="small-img">
            <div class="caption">${obj.name}</div>
        </div>`;
    });
    imgContainer.innerHTML = clutter;
    document.querySelectorAll(".small-img").forEach((img, index) => {
        img.addEventListener("click", () => {
            openFullImage(index);
        });
    });
}

function searchFunctionHandler() {
    searchInput.addEventListener("focus", () => {
        overlay.style.display = "block";
    });
    searchInput.addEventListener("blur", () => {
        overlay.style.display = "none";
    });
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase().trim();
        if (query === "") {
            searchData.style.display = "none";
            return;
        }      
        const filteredArray = arr.filter(obj => obj.name.toLowerCase().startsWith(query));        
        let clutter = "";
        filteredArray.forEach(obj => {
            clutter += `<div class="res flex px-8 py-3 cursor-pointer search-result" data-image="${obj.image}">
                <i class="ri-search-line font-semibold mr-5"></i>
                <h3 class="font-semibold">${obj.name}</h3>
            </div>`;
        });
        searchData.style.display = "block";
        searchData.innerHTML = clutter;
        document.querySelectorAll(".search-result").forEach(item => {
            item.addEventListener("click", (e) => {
                const imgSrc = e.currentTarget.getAttribute("data-image");
                fImg.src = imgSrc;
                fullImage.style.display = "flex";
            });
        });
    });
}

function openFullImage(index) {
    currentIndex = index;
    fImg.src = arr[currentIndex].image;
    fullImage.style.display = "flex";
    updateDots();
}
function updateDots() {
    dotsContainer.innerHTML = arr.map((_, i) => 
        `<div class="dot ${i === currentIndex ? 'active' : ''}" data-index="${i}"></div>`
    ).join("");

    document.querySelectorAll(".dot").forEach(dot => {
        dot.addEventListener("click", (e) => {
            let newIndex = parseInt(e.target.getAttribute("data-index"));
            openFullImage(newIndex);
        });
    });
}
function nextImage() {
    currentIndex = (currentIndex + 1) % arr.length;
    openFullImage(currentIndex);
}
function prevImage() {
    currentIndex = (currentIndex - 1 + arr.length) % arr.length; 
    openFullImage(currentIndex);
}

nextBtn.addEventListener("click", nextImage);
prevBtn.addEventListener("click", prevImage);

fullImage.addEventListener("click", (e) => {
    if (e.target === fullImage) {
        fullImage.style.display = "none";
    }
});

document.addEventListener("keydown", (e) => {
    if (fullImage.style.display === "flex") {
        if (e.key === "ArrowRight") {
            nextImage();
        } else if (e.key === "ArrowLeft") {
            prevImage();
        } else if (e.key === "Escape") {
            fullImage.style.display = "none";
        }
    }
});
showTheCards();
searchFunctionHandler();