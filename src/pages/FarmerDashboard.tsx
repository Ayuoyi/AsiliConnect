import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Package, DollarSign, Users, Plus, Eye } from "lucide-react";
import { convertToKES } from "@/lib/currency";
import { getFarmerName } from "@/lib/user";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { addNotification } from "@/lib/notifications";

type NewProduct = {
  name: string;
  farmer: string;
  location?: string;
  price: string;
  unit: string;
  image?: string;
  inStock?: boolean;
  featured?: boolean;
  organic?: boolean;
  local?: boolean;
};

const FarmerDashboard = () => {
  const farmerName = getFarmerName();
  const stats = [
    {
      title: "Total Sales",
      value: convertToKES("45231"),
      change: "+12.5%",
      icon: DollarSign,
      trend: "up",
    },
    {
      title: "Active Listings",
      value: "23",
      change: "+3",
      icon: Package,
      trend: "up",
    },
    {
      title: "Total Orders",
      value: "156",
      change: "+28",
      icon: TrendingUp,
      trend: "up",
    },
    {
      title: "Active Buyers",
      value: "89",
      change: "+15",
      icon: Users,
      trend: "up",
    },
  ];

  const recentListings = [
    {
      name: "Fresh Organic Tomatoes",
      price: convertToKES(45) + "/kg",
      stock: "500 kg",
      status: "Active",
      views: 234,
    },
    {
      name: "Premium Rice",
      price: convertToKES(120) + "/quintal",
      stock: "20 quintal",
      status: "Active",
      views: 189,
    },
    {
      name: "Fresh Potatoes",
      price: convertToKES(30) + "/kg",
      stock: "0 kg",
      status: "Out of Stock",
      views: 156,
    },
  ];

  const recentOrders = [
    {
      id: "ORD-1234",
      buyer: "Fresh Market Co.",
      product: "Organic Tomatoes",
      quantity: "50 kg",
      amount: convertToKES(2250),
      status: "Pending",
    },
    {
      id: "ORD-1233",
      buyer: "Green Grocers",
      product: "Premium Rice",
      quantity: "5 quintal",
      amount: convertToKES(6000),
      status: "Delivered",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Farmer Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {farmerName}</p>
          </div>
          <AddProductButton farmerName={farmerName} />
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-border hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant={stat.trend === "up" ? "default" : "secondary"} className="bg-success/10 text-success border-success/20">
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Listings */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Your Listings</CardTitle>
              <CardDescription>Manage your products and inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentListings.map((listing, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{listing.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{listing.price}</span>
                        <span>•</span>
                        <span>Stock: {listing.stock}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        {listing.views}
                      </div>
                      <Badge variant={listing.status === "Active" ? "default" : "secondary"}>
                        {listing.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Listings
              </Button>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Track your latest sales and deliveries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order, index) => (
                  <div
                    key={index}
                    className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm text-muted-foreground">{order.id}</span>
                      <Badge variant={order.status === "Delivered" ? "default" : "secondary"}>
                        {order.status}
                      </Badge>
                    </div>
                    <h4 className="font-semibold mb-1">{order.buyer}</h4>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {order.product} • {order.quantity}
                      </span>
                      <span className="font-semibold text-primary">{order.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Orders
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Market Insights */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Market Insights</CardTitle>
            <CardDescription>Price trends and demand forecasts for your products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-primary" />
                <p>Market insights and analytics coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FarmerDashboard;

// Simple AddProductButton component (kept in this file for convenience)
function AddProductButton({ farmerName }: { farmerName: string }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<NewProduct>({ name: "", farmer: farmerName, price: "0", unit: "kg", location: "" });

  const handleChange = (k: keyof NewProduct, v: any) => setForm((s) => ({ ...s, [k]: v }));

  const handleSave = () => {
    if (!form.name.trim()) return toast({ title: "Name required", description: "Please provide a product name" });
    const storageKey = "products-added";
    const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
    const product = { ...form, name: form.name.trim(), farmer: form.farmer || farmerName };
    // store a slug
    (product as any).id = product.name.replace(/\s+/g, "-").toLowerCase();
  // call AI describe endpoint to generate description & tags
  fetch(`${process.env.REACT_APP_AI_PROXY || "http://localhost:3001"}/api/ai/describe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: product.name, farmer: product.farmer, location: product.location, price: product.price, unit: product.unit, image: product.image }),
  })
    .then((r) => r.json())
    .then((data) => {
      if (data?.ok && data.result) {
        (product as any).description = data.result.description;
        (product as any).tags = data.result.tags || [];
      }
    })
    .catch((e) => console.warn("AI describe failed", e))
    .finally(() => {
      existing.push(product);
      localStorage.setItem(storageKey, JSON.stringify(existing));
      // dispatch product event so pages can react
      window.dispatchEvent(new CustomEvent("product:added", { detail: { product } }));
      // also add a user-visible notification
      addNotification(product);
      setOpen(false);
      setForm({ name: "", farmer: farmerName, price: "0", unit: "kg", location: "" });
      toast({ title: "Product added", description: `${product.name} was published` });
    });
  };

  return (
    <>
      <Button variant="hero" size="lg" className="shadow-lg" onClick={() => setOpen(true)}>
        <Plus className="h-5 w-5 mr-2" />
        Add New Product
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="bg-card border border-border rounded p-6 z-10 w-full max-w-xl">
            <h3 className="text-lg font-semibold mb-4">Add new product</h3>
            <div className="space-y-3">
              <input placeholder="Name" value={form.name} onChange={(e) => handleChange("name", (e.target as HTMLInputElement).value)} className="w-full p-2 border rounded" />
              <input placeholder="Price" value={form.price} onChange={(e) => handleChange("price", (e.target as HTMLInputElement).value)} className="w-full p-2 border rounded" />
              <input placeholder="Unit (kg, quintal...)" value={form.unit} onChange={(e) => handleChange("unit", (e.target as HTMLInputElement).value)} className="w-full p-2 border rounded" />
              <input placeholder="Location" value={form.location} onChange={(e) => handleChange("location", (e.target as HTMLInputElement).value)} className="w-full p-2 border rounded" />
              <input placeholder="Image URL" value={form.image || ""} onChange={(e) => handleChange("image", (e.target as HTMLInputElement).value)} className="w-full p-2 border rounded" />
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2"><input type="checkbox" checked={!!form.inStock} onChange={(e) => handleChange("inStock", (e.target as HTMLInputElement).checked)} /> In stock</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={!!form.featured} onChange={(e) => handleChange("featured", (e.target as HTMLInputElement).checked)} /> Featured</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={!!form.organic} onChange={(e) => handleChange("organic", (e.target as HTMLInputElement).checked)} /> Organic</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={!!form.local} onChange={(e) => handleChange("local", (e.target as HTMLInputElement).checked)} /> Local</label>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleSave}>Publish product</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
