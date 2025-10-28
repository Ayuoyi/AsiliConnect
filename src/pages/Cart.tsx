import Navigation from "@/components/Navigation";
import { useEffect, useMemo, useState } from "react";
import { getCart, updateCartItem, removeCartItem } from "@/lib/cart";
import { convertToKES } from "@/lib/currency";
import { Link } from "react-router-dom";

const CartPage = () => {
  const [items, setItems] = useState(() => getCart());

  useEffect(() => {
    const onUpdate = (e: any) => setItems(e.detail?.cart ?? getCart());
    window.addEventListener("cart:updated", onUpdate as EventListener);
    return () => window.removeEventListener("cart:updated", onUpdate as EventListener);
  }, []);

  const total = useMemo(() => items.reduce((s, it) => s + it.price * it.quantity, 0), [items]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>

        {items.length === 0 ? (
          <div className="p-6 bg-card border border-border rounded">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Link to="/marketplace" className="text-primary mt-3 inline-block">Browse products</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((it) => (
              <div key={it.id} className="flex items-center gap-4 bg-card p-4 border border-border rounded">
                <div className="flex-1">
                  <div className="font-medium">{it.productName}</div>
                  <div className="text-sm text-muted-foreground">{convertToKES(it.price)} / {it.unit}</div>
                </div>

                <div className="flex items-center gap-2">
                  <input type="number" min={0} value={it.quantity} onChange={(e) => updateCartItem(it.productId, Number((e.target as HTMLInputElement).value || 0))} className="w-20 p-1 border rounded" />
                  <button className="text-sm text-destructive" onClick={() => removeCartItem(it.productId)}>Remove</button>
                </div>
              </div>
            ))}

            <div className="p-4 bg-card border border-border rounded flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Total</div>
                <div className="text-2xl font-bold">{convertToKES(total)}</div>
              </div>
              <div>
                <button className="px-4 py-2 bg-primary text-white rounded">Checkout</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
