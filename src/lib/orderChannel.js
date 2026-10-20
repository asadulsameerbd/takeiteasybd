// src/lib/orderChannel.js
// ✅ Cross-tab sync — একই ব্রাউজারে admin আর user এর tab instant sync

export const orderChannel =
  typeof window !== "undefined" && "BroadcastChannel" in window
    ? new BroadcastChannel("tie_orders")
    : null;

export function broadcastOrderChange(type = "updated", payload = {}) {
  try {
    orderChannel?.postMessage({ type, payload, at: Date.now() });
  } catch {
    /* ignore */
  }
}
