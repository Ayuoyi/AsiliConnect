import Navigation from "@/components/Navigation";
import { useParams, Link } from "react-router-dom";
import products from "@/data/products";
import { convertToKES } from "@/lib/currency";
import { useState, useEffect } from "react";
import { addToCart, getCart } from "@/lib/cart";
import FeedbackDialog from "@/components/FeedbackDialog";

const ProductDetails = () => {
  const { id } = useParams();
  const product = products.find((p) => p.name.replace(/\s+/g, "-").toLowerCase() === id);
  const [qty, setQty] = useState(1);
  const [cartQty, setCartQty] = useState(0);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);

  useEffect(() => {
    const cart = getCart();
    setCartQty(cart.reduce((s, it) => s + it.quantity, 0));

    const stored = JSON.parse(localStorage.getItem("feedbacks") || "[]");
    const forProduct = stored.filter((f: any) => f.productId === product?.name.replace(/\s+/g, "-").toLowerCase());
    setFeedbacks(forProduct.reverse());
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-semibold">Product not found</h2>
          <p className="mt-4">We couldn't find the product you are looking for.</p>
          <Link to="/marketplace" className="mt-6 inline-block text-primary">Back to Marketplace</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {product.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.image} alt={product.name} className="w-full h-96 object-cover rounded" />
            ) : (
              <div className="w-full h-96 bg-muted rounded" />
            )}
          </div>

          <div className="p-4 bg-card border border-border rounded">
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <p className="text-sm text-muted-foreground mb-4">{product.farmer} • {product.location}</p>
            <div className="text-3xl font-bold text-primary mb-4">{convertToKES(Number(product.price))} <span className="text-sm text-muted-foreground">/ {product.unit}</span></div>
            <p className="mb-4">Rating: {product.rating ?? "—"} ({product.reviews ?? 0} reviews)</p>
            <div className="mb-4">
              <strong>Tags:</strong> {product.featured ? "Featured " : ""} {product.organic ? "Organic " : ""} {product.local ? "Local" : ""}
            </div>
            <div className="flex gap-2 items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm">Qty</label>
                <input type="number" min={1} value={qty} onChange={(e) => setQty(Math.max(1, Number((e.target as HTMLInputElement).value || 1)))} className="w-16 p-1 border rounded" />
              </div>

              <button className="btn btn-primary px-4 py-2 bg-primary text-white rounded" onClick={() => {
                if (!product) return;
                addToCart({ productId: product.name.replace(/\s+/g, "-").toLowerCase(), productName: product.name, price: Number(product.price), unit: product.unit, quantity: qty });
                const cart = getCart();
                setCartQty(cart.reduce((s, it) => s + it.quantity, 0));
                alert(`${qty} x ${product.name} added to cart`);
              }}>Add to cart</button>

              <div className="text-sm text-muted-foreground">In cart: {cartQty}</div>
              <div className="flex-1 text-right">
                <Link to="/marketplace" className="text-sm text-muted-foreground">Back</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Feedbacks */}
        <div className="container mx-auto px-4 py-8">
          <div className="bg-card border border-border rounded p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Customer feedback</h3>
              {product && <FeedbackDialog productId={product.name.replace(/\s+/g, "-").toLowerCase()} productName={product.name} />}
            </div>

            {feedbacks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No feedbacks yet.</p>
            ) : (
              <ul className="space-y-3">
                {feedbacks.map((f) => (
                  <li key={f.id} className="border border-border rounded p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Rating: {f.rating}</div>
                      <div className="text-xs text-muted-foreground">{new Date(f.createdAt).toLocaleString()}</div>
                    </div>
                    <p className="mt-2 text-sm">{f.comment}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
