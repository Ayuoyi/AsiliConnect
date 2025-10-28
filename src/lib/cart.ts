export type CartItem = {
  id: string;
  productId: string;
  productName: string;
  price: number;
  unit: string;
  quantity: number;
};

const STORAGE_KEY = "cart";

export const getCart = (): CartItem[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

export const addToCart = (item: Omit<CartItem, "id">) => {
  const cart = getCart();
  const existing = cart.find((c) => c.productId === item.productId);
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push({ id: `${item.productId}-${Date.now()}`, ...item });
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  // notify other parts of the app
  window.dispatchEvent(new CustomEvent("cart:updated", { detail: { cart } }));
  return cart;
};

export const updateCartItem = (productId: string, quantity: number) => {
  const cart = getCart();
  const item = cart.find((c) => c.productId === productId);
  if (item) {
    item.quantity = Math.max(0, quantity);
    const filtered = cart.filter((c) => c.quantity > 0);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent("cart:updated", { detail: { cart: filtered } }));
    return filtered;
  }
  return cart;
};

export const removeCartItem = (productId: string) => {
  const cart = getCart();
  const filtered = cart.filter((c) => c.productId !== productId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  window.dispatchEvent(new CustomEvent("cart:updated", { detail: { cart: filtered } }));
  return filtered;
};

export const clearCart = () => {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("cart:updated", { detail: { cart: [] } }));
};

export default { getCart, addToCart, clearCart };
