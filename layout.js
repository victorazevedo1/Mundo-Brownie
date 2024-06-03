document.addEventListener('DOMContentLoaded', function() {
  let slideIndex = 0;
  var totalAmount = "0,00";

  function showSlides() {
      let slides = document.getElementsByClassName("mySlides");
      for (let i = 0; i < slides.length; i++) {
          slides[i].style.display = "none";  
      }
      slideIndex++;
      if (slideIndex > slides.length) {
          slideIndex = 1;
      }    
      slides[slideIndex - 1].style.display = "block";  
      setTimeout(showSlides, 5000); 
  }
  showSlides();

  function plusSlides(n) {
      slideIndex += n;
      let slides = document.getElementsByClassName("mySlides");
      if (slideIndex > slides.length) {
          slideIndex = 1;
      }
      if (slideIndex < 1) {
          slideIndex = slides.length;
      }
      for (let i = 0; i < slides.length; i++) {
          slides[i].style.display = "none";
      }
      slides[slideIndex - 1].style.display = "block";
  }

  document.querySelector('.prev').addEventListener('click', function() {
      plusSlides(-1);
  });

  document.querySelector('.next').addEventListener('click', function() {
      plusSlides(1);
  });

  function searchProducts() {
      const searchInput = document.querySelector('.search-bar input');
      const filter = searchInput.value.toLowerCase();
      const products = document.querySelectorAll('.movie-product');

      products.forEach(product => {
          const title = product.querySelector('.product-title').innerText.toLowerCase();
          product.style.display = title.includes(filter) ? 'block' : 'none';
      });
  }

  document.querySelector('.search-bar input').addEventListener('input', searchProducts);

  function ready() {
 
      loadCartFromStorage();

      const removeCartProductButtons = document.getElementsByClassName("remove-product-button");
      for (var i = 0; i < removeCartProductButtons.length; i++) {
          removeCartProductButtons[i].addEventListener("click", removeProduct);
      }

      const quantityInputs = document.getElementsByClassName("product-qtd-input");
      for (var i = 0; i < quantityInputs.length; i++) {
          quantityInputs[i].addEventListener("change", checkIfInputIsNull);
      }

      const addToCartButtons = document.getElementsByClassName("button-hover-background");
      for (var i = 0; i < addToCartButtons.length; i++) {
          addToCartButtons[i].addEventListener("click", addProductToCart);
      }

      const purchaseButton = document.getElementsByClassName("purchase-button")[0];
      purchaseButton.addEventListener("click", makePurchase);
  }

  function removeProduct(event) {
      event.target.parentElement.parentElement.remove();
      updateTotal();
      saveCartToStorage();
  }

  function checkIfInputIsNull(event) {
      if (event.target.value === "0") {
          event.target.parentElement.parentElement.remove();
      }
      updateTotal();
      saveCartToStorage();
  }

  function addProductToCart(event) {
      const button = event.target;
      const productInfos = button.parentElement.parentElement;
      const productImage = productInfos.getElementsByClassName("product-image")[0].src;
      const productName = productInfos.getElementsByClassName("product-title")[0].innerText;
      const productPrice = productInfos.getElementsByClassName("product-price")[0].innerText;

      const productsCartNames = document.getElementsByClassName("cart-product-title");
      for (var i = 0; i < productsCartNames.length; i++) {
          if (productsCartNames[i].innerText === productName) {
              productsCartNames[i].parentElement.parentElement.getElementsByClassName("product-qtd-input")[0].value++;
              updateTotal();
              saveCartToStorage();
              return;
          }
      }

      let newCartProduct = document.createElement("tr");
      newCartProduct.classList.add("cart-product");

      newCartProduct.innerHTML =
          `
          <td class="product-identification">
            <img src="${productImage}" alt="${productName}" class="cart-product-image">
            <strong class="cart-product-title">${productName}</strong>
          </td>
          <td>
            <span class="cart-product-price">${productPrice}</span>
          </td>
          <td>
            <input type="number" value="1" min="0" class="product-qtd-input">
            <button type="button" class="remove-product-button">Remover</button>
          </td>
        `;

      const tableBody = document.querySelector(".cart-table tbody");
      tableBody.append(newCartProduct);
      updateTotal();

      newCartProduct.getElementsByClassName("remove-product-button")[0].addEventListener("click", removeProduct);
      newCartProduct.getElementsByClassName("product-qtd-input")[0].addEventListener("change", checkIfInputIsNull);

      saveCartToStorage();
  }

  function makePurchase() {
      if (totalAmount === "0,00") {
          alert("Seu carrinho está vazio!");
      } else {   
          alert(
              `
                Obrigado pela sua compra!
                Valor do pedido: R$${totalAmount}\n
                Volte sempre, pois a vida merece ser adoçada!!! ;)
              `
          );

          document.querySelector(".cart-table tbody").innerHTML = "";
          updateTotal();
          saveCartToStorage();
      }
  }

  function updateTotal() {
      const cartProducts = document.getElementsByClassName("cart-product");
      totalAmount = 0;

      for (var i = 0; i < cartProducts.length; i++) {
          const productPrice = cartProducts[i].getElementsByClassName("cart-product-price")[0].innerText.replace("R$", "").replace(",", ".");
          const productQuantity = cartProducts[i].getElementsByClassName("product-qtd-input")[0].value;

          totalAmount += productPrice * productQuantity;
      }

      totalAmount = totalAmount.toFixed(2);
      totalAmount = totalAmount.replace(".", ",");
      document.querySelector(".cart-total-container span").innerText = "R$" + totalAmount;
  }

  function saveCartToStorage() {
      const cartProducts = document.getElementsByClassName("cart-product");
      let cart = [];

      for (var i = 0; i < cartProducts.length; i++) {
          const productImage = cartProducts[i].getElementsByClassName("cart-product-image")[0].src;
          const productName = cartProducts[i].getElementsByClassName("cart-product-title")[0].innerText;
          const productPrice = cartProducts[i].getElementsByClassName("cart-product-price")[0].innerText;
          const productQuantity = cartProducts[i].getElementsByClassName("product-qtd-input")[0].value;

          cart.push({
              image: productImage,
              name: productName,
              price: productPrice,
              quantity: productQuantity
          });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
  }

  function loadCartFromStorage() {
      const cart = JSON.parse(localStorage.getItem('cart'));

      if (cart) {
          cart.forEach(item => {
              let newCartProduct = document.createElement("tr");
              newCartProduct.classList.add("cart-product");

              newCartProduct.innerHTML =
                  `
                  <td class="product-identification">
                    <img src="${item.image}" alt="${item.name}" class="cart-product-image">
                    <strong class="cart-product-title">${item.name}</strong>
                  </td>
                  <td>
                    <span class="cart-product-price">${item.price}</span>
                  </td>
                  <td>
                    <input type="number" value="${item.quantity}" min="0" class="product-qtd-input">
                    <button type="button" class="remove-product-button">Remover</button>
                  </td>
                `;

              const tableBody = document.querySelector(".cart-table tbody");
              tableBody.append(newCartProduct);

              newCartProduct.getElementsByClassName("remove-product-button")[0].addEventListener("click", removeProduct);
              newCartProduct.getElementsByClassName("product-qtd-input")[0].addEventListener("change", checkIfInputIsNull);
          });

          updateTotal();
      }
  }

  if (document.readyState == 'loading') {
      document.addEventListener('DOMContentLoaded', ready);
  } else {
      ready();
  }
});