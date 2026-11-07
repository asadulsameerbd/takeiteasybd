// Safe Meta Pixel wrapper
function fbq(...args) {
  if (typeof window === "undefined") return;
  if (!window.fbq) return;
  if (!window.__takeItEasyNewPixelInitialized) return;

  try {
    window.fbq(...args);
  } catch (error) {
    console.error("Meta Pixel Error:", error);
  }
}

// Get product ID from different possible object structures
function getProductId(item = {}) {
  return String(
    item.productId ||
      item._id ||
      item.id ||
      item.product?._id ||
      item.product?.id ||
      "",
  );
}

// Safely convert number
function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

// Get item price
function getItemPrice(item = {}) {
  return toNumber(item.price ?? item.product?.price ?? item.item_price ?? 0);
}

// Get item title
function getItemTitle(item = {}) {
  return (
    item.title || item.name || item.product?.title || item.product?.name || ""
  );
}

// Get item quantity
function getItemQuantity(item = {}) {
  return Math.max(1, toNumber(item.quantity, 1));
}

// Format cart items for Meta
function formatContents(items = []) {
  return items
    .map((item) => ({
      id: getProductId(item),
      quantity: getItemQuantity(item),
      item_price: getItemPrice(item),
      title: getItemTitle(item),
    }))
    .filter((item) => item.id);
}

// Format product IDs
function formatIds(items = []) {
  return items.map(getProductId).filter(Boolean);
}

// Calculate total quantity
function getTotalItems(items = []) {
  return items.reduce((total, item) => total + getItemQuantity(item), 0);
}

// Core Pixel Events
export const pixel = {
  // PageView is handled by MetaPixel.jsx

  // ViewContent
  viewContent(product) {
    if (!product) return;

    const id = getProductId(product);
    if (!id) return;

    fbq("track", "ViewContent", {
      content_ids: [id],
      content_name: getItemTitle(product),
      content_type: "product",
      content_category: product.category || "",
      value: getItemPrice(product),
      currency: "BDT",
    });
  },

  // AddToCart
  addToCart(product, quantity = 1, size = "") {
    if (!product) return;

    const id = getProductId(product);
    if (!id) return;

    const qty = Math.max(1, toNumber(quantity, 1));
    const price = getItemPrice(product);

    fbq("track", "AddToCart", {
      content_ids: [id],
      content_name: getItemTitle(product),
      content_type: "product",
      contents: [
        {
          id,
          quantity: qty,
          item_price: price,
        },
      ],
      value: price * qty,
      currency: "BDT",
      ...(size ? { size: String(size) } : {}),
    });
  },

  // RemoveFromCart (Custom Event)
  removeFromCart(item) {
    if (!item) return;

    const id = getProductId(item);
    if (!id) return;

    const quantity = getItemQuantity(item);
    const price = getItemPrice(item);

    fbq("trackCustom", "RemoveFromCart", {
      content_ids: [id],
      content_type: "product",
      contents: [
        {
          id,
          quantity,
          item_price: price,
        },
      ],
      value: price * quantity,
      currency: "BDT",
    });
  },

  // InitiateCheckout
  initiateCheckout(cart = [], total = 0, numItems = 0) {
    if (!cart.length) return;

    const contents = formatContents(cart);
    const ids = formatIds(cart);

    if (!ids.length) return;

    fbq("track", "InitiateCheckout", {
      content_ids: ids,
      contents,
      content_type: "product",
      num_items: toNumber(numItems) || getTotalItems(cart),
      value: toNumber(total),
      currency: "BDT",
    });
  },

  // AddPaymentInfo
  addPaymentInfo(cart = [], total = 0, numItems = 0, paymentMethod = "") {
    if (!cart.length) return;

    const contents = formatContents(cart);
    const ids = formatIds(cart);

    if (!ids.length) return;

    fbq("track", "AddPaymentInfo", {
      content_ids: ids,
      contents,
      content_type: "product",
      num_items: toNumber(numItems) || getTotalItems(cart),
      value: toNumber(total),
      currency: "BDT",
      ...(paymentMethod ? { payment_method: String(paymentMethod) } : {}),
    });
  },

  // Purchase - Call only after successful order creation
  purchase({ cart = [], total = 0, numItems = 0, orderId = "" } = {}) {
    if (!cart.length) return;

    const contents = formatContents(cart);
    const ids = formatIds(cart);

    if (!ids.length) return;

    fbq("track", "Purchase", {
      content_ids: ids,
      contents,
      content_type: "product",
      num_items: toNumber(numItems) || getTotalItems(cart),
      value: toNumber(total),
      currency: "BDT",
      ...(orderId ? { order_id: String(orderId) } : {}),
    });
  },

  // Search
  search(searchString) {
    if (!searchString || !String(searchString).trim()) return;

    fbq("track", "Search", {
      search_string: String(searchString).trim(),
      content_type: "product",
    });
  },

  // ViewCategory (Custom Event)
  viewCategory(categoryName) {
    if (!categoryName || categoryName === "All") return;

    fbq("trackCustom", "ViewCategory", {
      content_name: String(categoryName),
      content_type: "product_group",
      content_category: String(categoryName),
    });
  },

  // Lead
  lead(source = "") {
    fbq("track", "Lead", {
      content_name: source || "contact",
    });
  },

  // CompleteRegistration
  completeRegistration() {
    fbq("track", "CompleteRegistration", {
      status: true,
    });
  },

  // Custom Event
  custom(eventName, params = {}) {
    if (!eventName) return;

    fbq("trackCustom", String(eventName), params);
  },
};

export default pixel;
