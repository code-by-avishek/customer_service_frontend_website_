document.addEventListener('DOMContentLoaded', () => {
  const itemsContainer = document.getElementById('cartItems');
  const cartContent = document.getElementById('cartContent');
  const emptyState = document.getElementById('cartEmpty');
  const itemCount = document.getElementById('cartItemCount');
  const subtotalLabel = document.getElementById('cartSubtotal');
  const totalLabel = document.getElementById('cartTotal');
  const checkoutButton = document.getElementById('checkoutButton');
  const checkoutMessage = document.getElementById('checkoutMessage');

  if (!itemsContainer || !cartContent || !emptyState || !itemCount || !subtotalLabel || !totalLabel) return;

  const formatPrice = price => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2
  }).format(price);

  const makeQuantityButton = (label, title) => {
    const button = document.createElement('button');
    button.className = 'cart-quantity-button';
    button.type = 'button';
    button.textContent = label;
    button.setAttribute('aria-label', title);
    return button;
  };

  function renderCart() {
    const cart = StorageAPI.getCart();
    itemsContainer.replaceChildren();

    let subtotal = 0;
    let quantityTotal = 0;

    cart.forEach(item => {
      const product = item.product || {};
      const name = typeof product.name === 'string' ? product.name : 'Furniture piece';
      const description = typeof product.description === 'string' ? product.description : '';
      const price = Number(product.price);
      const safePrice = Number.isFinite(price) && price > 0 ? price : 0;
      const quantity = Number.isInteger(item.quantity) && item.quantity > 0 ? item.quantity : 1;
      subtotal += safePrice * quantity;
      quantityTotal += quantity;

      const row = document.createElement('article');
      row.className = 'cart-line';

      const art = document.createElement('div');
      art.className = 'cart-line-art';
      art.setAttribute('aria-hidden', 'true');
      art.textContent = 'NG';

      const info = document.createElement('div');
      info.className = 'cart-line-info';
      const title = document.createElement('h3');
      title.textContent = name;
      const detail = document.createElement('p');
      detail.textContent = description;
      const linePrice = document.createElement('span');
      linePrice.className = 'cart-line-price';
      linePrice.textContent = `${formatPrice(safePrice)} each`;

      const controls = document.createElement('div');
      controls.className = 'cart-line-controls';
      const decrease = makeQuantityButton('−', `Remove one ${name}`);
      const quantityInput = document.createElement('input');
      quantityInput.className = 'cart-quantity';
      quantityInput.type = 'number';
      quantityInput.min = '1';
      quantityInput.step = '1';
      quantityInput.value = String(quantity);
      quantityInput.setAttribute('aria-label', `Quantity of ${name}`);
      const increase = makeQuantityButton('+', `Add one ${name}`);

      decrease.addEventListener('click', () => {
        if (quantity > 1) {
          StorageAPI.updateCartQuantity(item.id, quantity - 1);
          renderCart();
        }
      });
      increase.addEventListener('click', () => {
        StorageAPI.updateCartQuantity(item.id, quantity + 1);
        renderCart();
      });
      quantityInput.addEventListener('change', () => {
        const nextQuantity = Number(quantityInput.value);
        if (!Number.isInteger(nextQuantity) || nextQuantity < 1) {
          quantityInput.value = String(quantity);
          return;
        }
        StorageAPI.updateCartQuantity(item.id, nextQuantity);
        renderCart();
      });

      controls.append(decrease, quantityInput, increase);
      info.append(title, detail, linePrice, controls);

      const remove = document.createElement('button');
      remove.className = 'cart-remove';
      remove.type = 'button';
      remove.textContent = 'Remove';
      remove.setAttribute('aria-label', `Remove ${name} from cart`);
      remove.addEventListener('click', () => {
        StorageAPI.removeFromCart(item.id);
        renderCart();
      });

      row.append(art, info, remove);
      itemsContainer.append(row);
    });

    const isEmpty = cart.length === 0;
    cartContent.hidden = isEmpty;
    emptyState.hidden = !isEmpty;
    itemCount.textContent = `${quantityTotal} ${quantityTotal === 1 ? 'item' : 'items'}`;
    subtotalLabel.textContent = formatPrice(subtotal);
    totalLabel.textContent = formatPrice(subtotal);

    document.querySelectorAll('.cart-count').forEach(counter => {
      counter.textContent = String(quantityTotal);
    });
  }

  if (checkoutButton && checkoutMessage) {
    checkoutButton.addEventListener('click', () => {
      checkoutMessage.textContent = 'Checkout is a demo and is not connected to payment processing.';
    });
  }

  renderCart();
});
