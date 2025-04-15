const productContainer = document.querySelector('.productsFashion');

async function products() {
  try {
    const response = await fetch('https://dummyjson.com/products?limit=9');
    const res = await response.json();
    const products = res.products;

    products.forEach(({ title, price, images }) => {
      productContainer.innerHTML += `
        <div class="col-lg-4 col-sm-4">
          <div class="box_main">
            <h4 class="shirt_text">${title}</h4>
            <p class="price_text">Price <span style="color: #262626;">$ ${price}</span></p>
            <div class="tshirt_img"><img src="${images[0]}" alt="${title}"></div>
            <div class="btn_main">
              <div class="buy_bt"><a href="#">Buy Now</a></div>
              <div class="seemore_bt"><a href="#">See More</a></div>
            </div>
          </div>
        </div>
      `;
    });
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

products();
