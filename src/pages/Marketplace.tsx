import Navigation from "@/components/Navigation";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { convertToKES } from "@/lib/currency";
import { useState, useMemo } from "react";
import productsData from "@/data/products";
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

const Marketplace = () => {
  const [query, setQuery] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [organicOnly, setOrganicOnly] = useState(false);
  const [localOnly, setLocalOnly] = useState(false);

  const [view, setView] = useState<"grid" | "list">("grid");
  const products = productsData;

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (featuredOnly && !p.featured) return false;
      if (inStockOnly && !p.inStock) return false;
      if (organicOnly && !p.organic) return false;
      if (localOnly && !p.local) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.farmer.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q)
      );
    });
  }, [products, query, featuredOnly, inStockOnly, organicOnly, localOnly]);

  useEffect(() => {
    const onAdded = (e: any) => {
      const p = e.detail?.product;
      if (!p) return;
      toast({ title: "New product added", description: `${p.name} was just listed by ${p.farmer}` });
    };
    window.addEventListener("product:added", onAdded as EventListener);
    return () => window.removeEventListener("product:added", onAdded as EventListener);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Marketplace</h1>
          <p className="text-muted-foreground">Fresh produce directly from verified farmers</p>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8 shadow-sm">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery((e.target as HTMLInputElement).value)} placeholder="Search products, farmer, location..." className="pl-10" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="vegetables">Vegetables</SelectItem>
                <SelectItem value="fruits">Fruits</SelectItem>
                <SelectItem value="grains">Grains</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="featured">
              <SelectTrigger>
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Button variant={inStockOnly ? "hero" : "outline"} size="sm" onClick={() => setInStockOnly(!inStockOnly)}>{inStockOnly ? "In Stock" : "In Stock Only"}</Button>
            <Button variant={featuredOnly ? "hero" : "outline"} size="sm" onClick={() => setFeaturedOnly(!featuredOnly)}>{featuredOnly ? "Featured only" : "Show featured"}</Button>
            <Button variant={organicOnly ? "hero" : "outline"} size="sm" onClick={() => setOrganicOnly(!organicOnly)}>{organicOnly ? "Organic" : "Organic Only"}</Button>
            <Button variant={localOnly ? "hero" : "outline"} size="sm" onClick={() => setLocalOnly(!localOnly)}>{localOnly ? "Local" : "Local Only"}</Button>
            <Button variant="ghost" size="sm" className="text-primary" onClick={() => { setQuery(""); setFeaturedOnly(false); setInStockOnly(false); setOrganicOnly(false); setLocalOnly(false); }}>Clear Filters</Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">Showing {filteredProducts.length} products</p>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* Products */}
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">View:</div>
          <div className="flex gap-2">
            <Button size="sm" variant={view === "grid" ? "hero" : "outline"} onClick={() => setView("grid")}>Grid</Button>
            <Button size="sm" variant={view === "list" ? "hero" : "outline"} onClick={() => setView("list")}>List</Button>
          </div>
        </div>

        {view === "grid" ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredProducts.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
        ) : (
          <div className="space-y-3 mb-12">
            {filteredProducts.map((p, i) => (
              <div key={i} className="flex items-center bg-card border border-border rounded-lg p-3">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt={p.name} className="w-20 h-20 object-cover rounded mr-4" />
                ) : (
                  <div className="w-20 h-20 bg-muted rounded mr-4" />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{p.name}</h3>
                    <div className="text-sm text-muted-foreground">{convertToKES(Number(p.price))}/{p.unit}</div>
                  </div>
                  <p className="text-sm text-muted-foreground">{p.farmer} • {p.location}</p>
                  <div className="mt-2 text-xs text-muted-foreground">{p.inStock ? "In stock" : "Out of stock"} {p.featured ? "• Featured" : ""} {p.organic ? "• Organic" : ""}</div>
                </div>
                <div>
                  <Button size="sm" variant="outline">View</Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        <div className="text-center">
          <Button variant="outline" size="lg">Load More Products</Button>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
