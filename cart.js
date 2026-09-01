// ===== WaldyKits Shared Cart Logic =====
// Cart persists in localStorage so it works across index.html and shop.html
const WK_PHONE = "50940303686";
const WK_CART_KEY = "waldykits_cart";

function wkGetCart() {
  try {
    const raw = localStorage.getItem(WK_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function wkSaveCart(cart) {
  localStorage.setItem(WK_CART_KEY, JSON.stringify(cart));
  wkRenderCart();
}

function wkAddToCart(item) {
  const cart = wkGetCart();
  // item: {id, name, price, img, kit}
  const existing = cart.find(c => c.id === item.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  wkSaveCart(cart);
  wkOpenCart();
}

function wkRemoveFromCart(id) {
  let cart = wkGetCart();
  cart = cart.filter(c => c.id !== id);
  wkSaveCart(cart);
}

function wkCartTotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function wkCartCount(cart) {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function wkRenderCart() {
  const cart = wkGetCart();
  const countEl = document.getElementById('cartCount');
  const itemsEl = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');
  const totalEl = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('cartCheckoutBtn');

  if (countEl) countEl.textContent = wkCartCount(cart);

  if (!itemsEl) return; // cart panel not on this page

  if (cart.length === 0) {
    itemsEl.innerHTML = '<div class="cart-empty">Panyen ou vid. Ale nan <a href="shop.html">Boutik la</a> pou ajoute mayo.</div>';
    if (footerEl) footerEl.style.display = 'none';
    return;
  }

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.img}" alt="${item.name}" />
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${item.qty} x ${item.price.toLocaleString()} HTG</div>
        <button class="cart-item-remove" onclick="wkRemoveFromCart('${item.id}')">Retire</button>
      </div>
    </div>
  `).join('');

  if (footerEl) footerEl.style.display = 'block';
  if (totalEl) totalEl.textContent = wkCartTotal(cart).toLocaleString() + ' HTG';

  if (checkoutBtn) {
    const lines = cart.map(item => `- ${item.name} (${item.kit || ''}) x${item.qty} = ${item.price * item.qty} HTG`).join('\n');
    const message = `Bonjou! Mwen vle kòmande mayo sa yo nan WaldyKits:\n${lines}\n\nTotal: ${wkCartTotal(cart)} HTG`;
    checkoutBtn.href = `https://wa.me/${WK_PHONE}?text=${encodeURIComponent(message)}`;
  }
}

function wkOpenCart() {
  const overlay = document.getElementById('cartOverlay');
  const panel = document.getElementById('cartPanel');
  if (overlay && panel) {
    overlay.classList.add('open');
    panel.classList.add('open');
  }
}

function wkCloseCart() {
  const overlay = document.getElementById('cartOverlay');
  const panel = document.getElementById('cartPanel');
  if (overlay && panel) {
    overlay.classList.remove('open');
    panel.classList.remove('open');
  }
}

document.addEventListener('DOMContentLoaded', function () {
  wkRenderCart();
  const openBtn = document.getElementById('cartOpenBtn');
  const closeBtn = document.getElementById('cartCloseBtn');
  const overlay = document.getElementById('cartOverlay');
  if (openBtn) openBtn.addEventListener('click', wkOpenCart);
  if (closeBtn) closeBtn.addEventListener('click', wkCloseCart);
  if (overlay) overlay.addEventListener('click', wkCloseCart);
});
