const closebtn = document.querySelector('.sidebar-close');
const sidebar = document.querySelector('.sidebar');
const openSidebarBtn = document.getElementById('icon-btn'); 
const aboutNavBtn = document.querySelector('.ab-about');
const experienceNavBtn = document.querySelector('.ab-experience');
const educationNavBtn = document.querySelector('.ab-education');
const skillsNavBtn = document.querySelector('.ab-skills');



function closeSideBar() {
    sidebar.classList.add('hidden');
}
function openSideBar() { 
    sidebar.classList.remove('hidden'); 
    sidebar.style.display = 'flex'; 
}
openSidebarBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openSideBar();
});
closebtn.addEventListener('click', (event) => {
    event.stopPropagation(); 
    closeSideBar();
});
document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".tabs-container > div"); 
    const navLinks = document.querySelectorAll(".ab-anchor a"); 

    function removeActiveClasses() {
        tabs.forEach(tab => tab.style.display = "none"); 
        navLinks.forEach(link => link.classList.remove("active")); 
    }

    function showTab(index) {
        removeActiveClasses();
        tabs[index].style.display = "flex"; 
        navLinks[index].classList.add("active");
    }

    navLinks.forEach((link, index) => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            showTab(index);
        });
    });

    // Ensure Tab 1 (index 0) is visible on page load
    setTimeout(() => {
        showTab(0);
    }, 10); 
});

