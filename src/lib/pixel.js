// src/lib/pixel.js

const PIXEL_ID = "2346615959428743";

/**
 * Safe fbq wrapper — pixel load না হলেও crash করবে না
 */
function fbq(...args) {
  if (typeof window === "undefined") return;
  if (!window.fbq) return;
  if (!window.__takeItEasyNewPixelInitialized) return;
  try {
    window.fbq(...args);
  } catch (e) {
    // silently ignore pixel errors
  }
}

/**
 * Format items for Meta content arrays
 */
function formatContents(items = []) {
  return items.map((i) => ({
    id: String(i.productId || i._id || i.id || ""),
    quantity: Number(i.quantity || 1),
    item_price: Number(i.price || 0),
    title: i.title || i.name || "",
  }));
}

function formatIds(items = []) {
  return items.map((i) => String(i.productId || i._id || i.id || ""));
}

/* ============================================================ */
/* Core Events                                                  */
/* ============================================================ */

export const pixel = {
  /* PageView — handled inside MetaPixel component */

  /**
   * ViewContent — user product page দেখলে
   */
  viewContent(product) {
    if (!product) return;
    fbq("track", "ViewContent", {
      content_ids: [String(product._id)],
      content_name: product.title,
      content_type: "product",
      content_category: product.category || "",
      value: Number(product.price) || 0,
      currency: "BDT",
    });
  },

  /**
   * AddToCart — cart-এ কিছু যোগ হলে
   */
  addToCart(product, quantity = 1, size = "") {
    if (!product) return;
    fbq("track", "AddToCart", {
      content_ids: [String(product._id)],
      content_name: product.title,
      content_type: "product",
      contents: [
        {
          id: String(product._id),
          quantity: Number(quantity),
          item_price: Number(product.price),
          title: product.title,
        },
      ],
      value: Number(product.price) * Number(quantity),
      currency: "BDT",
    });
  },

  /**
   * RemoveFromCart — cart থেকে remove হলে
   */
  removeFromCart(item) {
    if (!item) return;
    fbq("track", "RemoveFromCart", {
      content_ids: [String(item.productId)],
      content_type: "product",
      contents: [
        {
          id: String(item.productId),
          quantity: Number(item.quantity || 1),
          item_price: Number(item.price || 0),
        },
      ],
      value: Number(item.price || 0) * Number(item.quantity || 1),
      currency: "BDT",
    });
  },

  /**
   * InitiateCheckout — checkout page-এ ঢুকলে
   */
  initiateCheckout(cart = [], total = 0, numItems = 0) {
    if (!cart.length) return;
    fbq("track", "InitiateCheckout", {
      content_ids: formatIds(cart),
      contents: formatContents(cart),
      content_type: "product",
      num_items: Number(numItems),
      value: Number(total),
      currency: "BDT",
    });
  },

  /**
   * AddPaymentInfo — payment method select করলে
   */
  addPaymentInfo(cart = [], total = 0, numItems = 0, paymentMethod = "") {
    if (!cart.length) return;
    fbq("track", "AddPaymentInfo", {
      content_ids: formatIds(cart),
      contents: formatContents(cart),
      content_type: "product",
      num_items: Number(numItems),
      value: Number(total),
      currency: "BDT",
    });
  },

  /**
   * Purchase — order সফলভাবে place হলে (সবচেয়ে গুরুত্বপূর্ণ!)
   */
  purchase({ cart = [], total = 0, numItems = 0, orderId = "" }) {
    if (!cart.length) return;
    fbq("track", "Purchase", {
      content_ids: formatIds(cart),
      contents: formatContents(cart),
      content_type: "product",
      num_items: Number(numItems),
      value: Number(total),
      currency: "BDT",
      order_id: String(orderId || ""),
    });
  },

  /**
   * Search — products search করলে
   */
  search(searchString) {
    if (!searchString || !searchString.trim()) return;
    fbq("track", "Search", {
      search_string: String(searchString).trim(),
      content_type: "product",
    });
  },

  /**
   * ViewCategory — category filter করলে
   */
  viewCategory(categoryName) {
    if (!categoryName || categoryName === "All") return;
    fbq("track", "ViewContent", {
      content_name: String(categoryName),
      content_type: "product_group",
      content_category: String(categoryName),
    });
  },

  /**
   * Lead — contact form / WhatsApp click
   */
  lead(source = "") {
    fbq("track", "Lead", {
      content_name: source || "contact",
    });
  },

  /**
   * CompleteRegistration — নতুন account তৈরি হলে
   */
  completeRegistration() {
    fbq("track", "CompleteRegistration", {
      status: true,
    });
  },

  /**
   * Custom event — যেকোনো custom track করতে
   */
  custom(eventName, params = {}) {
    if (!eventName) return;
    fbq("trackCustom", String(eventName), params);
  },
};

export default pixel;
