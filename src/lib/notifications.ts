export type Notification = {
  id: string;
  productId: string;
  name: string;
  farmer?: string;
  createdAt: string;
  read?: boolean;
};

const STORAGE_KEY = "notifications";

export const getNotifications = (): Notification[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

export const addNotification = (product: any) => {
  const list = getNotifications();
  const n: Notification = {
    id: `${product.id || product.name.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}`,
    productId: product.id || product.name.replace(/\s+/g, "-").toLowerCase(),
    name: product.name,
    farmer: product.farmer,
    createdAt: new Date().toISOString(),
    read: false,
  };
  list.unshift(n);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent("notifications:updated", { detail: { notifications: list } }));
  return n;
};

export const markAllRead = () => {
  const list = getNotifications().map((n) => ({ ...n, read: true }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent("notifications:updated", { detail: { notifications: list } }));
  return list;
};

export const markRead = (id: string) => {
  const list = getNotifications().map((n) => (n.id === id ? { ...n, read: true } : n));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent("notifications:updated", { detail: { notifications: list } }));
  return list;
};

export const clearNotifications = () => {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("notifications:updated", { detail: { notifications: [] } }));
};

export default { getNotifications, addNotification, markAllRead, markRead, clearNotifications };
