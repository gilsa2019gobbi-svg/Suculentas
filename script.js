const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-cont");
const addressInput = document.getElementById("address");
const addresswarn = document.getElementById("address-warn");

let cart = [];

// Abrir modal
cartBtn.addEventListener("click", () => {
  updateCartModal();
  cartModal.style.display = "flex";
});

// Fechar modal
closeModalBtn.addEventListener("click", () => {
  cartModal.style.display = "none";
});
cartModal.addEventListener("click", (event) => {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

// Adicionar ao carrinho (funciona em todas as seções)
document.addEventListener("click", (event) => {
  const btn = event.target.closest(".add-to-cart-btn");
  if (btn) {
    const name = btn.getAttribute("data-name");
    const price = parseFloat(btn.getAttribute("data-price"));
    addToCart(name, price);
  }
});

function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  updateCartModal();
}

// Atualizar carrinho
function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;
  let totalItems = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;
    totalItems += item.quantity;

    const itemEl = document.createElement("div");
    itemEl.innerHTML = `
      <div class="flex justify-between items-center border-b pb-2">
        <div>
          <p class="font-bold">${item.name}</p>
          <p>Qtd: ${item.quantity}</p>
          <p class="mt-1">R$ ${(item.price * item.quantity).toFixed(2)}</p>
        </div>
        <button class="text-red-500 remove-btn" data-name="${item.name}">Remover</button>
      </div>
    `;
    cartItemsContainer.appendChild(itemEl);
  });

  cartTotal.textContent = total.toFixed(2);
  cartCounter.textContent = totalItems;

  // Remover item
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.getAttribute("data-name");
      cart = cart.filter(item => item.name !== name);
      updateCartModal();
    });
  });
}

// Finalizar pedido (WhatsApp)
checkoutBtn.addEventListener("click", () => {
  const address = addressInput.value.trim();
  if (address === "") {
    addresswarn.classList.remove("hidden");
    return;
  }

  let message = "Olá, gostaria de fazer um pedido:%0A";
  cart.forEach(item => {
    message += `- ${item.name} (x${item.quantity}) - R$ ${(item.price * item.quantity).toFixed(2)}%0A`;
  });
  message += `Total: R$ ${parseFloat(cartTotal.textContent).toFixed(2)}%0A`;
  message += `Endereço: ${address}`;

  const phone = "555484122702"; // Exemplo: 5551999999999
  const url = `https://wa.me/${phone}?text=${message}`;

  window.open(url, "_blank");
});