const productMain = document.querySelector('.product_main');

//mens clothing
fetch("https://fakestoreapi.com/products/category/men's clothing")
  .then(res => res.json())
  .then(data => {
    data.forEach(({ title, price, image }) => {
      productMain.innerHTML += `
        <div class="project_box">
          <div class="dark_white_bg">
            <img src="${image}" alt="${title}" />
          </div>
          <h3>${title} - $${price}</h3>
        </div>`;
    });
  });

//women clothes
fetch("https://fakestoreapi.com/products/category/women's clothing")
  .then(res => res.json())
  .then(data => {
    data.forEach(({ title, price, image }) => {
      productMain.innerHTML += `
        <div class="project_box">
          <div class="dark_white_bg">
            <img src="${image}" alt="${title}" />
          </div>
          <h3>${title} - $${price}</h3>
        </div>`;
    });
  })
  .catch(err => {
    console.error("Error fetching women's clothing:", err);
  });

