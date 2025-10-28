import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Package, TrendingDown, Heart, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { convertToKES } from "@/lib/currency";
import { getUserName } from "@/lib/user";
import EnhancedChatBot from "@/components/EnhancedChatBot";
import TestGeminiAPI from "@/components/TestGeminiAPI";
import EnvCheck from "@/components/EnvCheck";

const BuyerDashboard = () => {
  const stats = [
    {
      title: "Total Purchases",
      value: convertToKES("45200"),
      change: "+12.5%",
      icon: ShoppingCart,
      description: "vs last month",
    },
    {
      title: "Active Orders",
      value: "12",
      change: "+5",
      icon: Package,
      description: "in transit",
    },
    {
      title: "Avg. Savings",
      value: "18%",
      change: "+2.1%",
      icon: TrendingDown,
      description: "vs market price",
    },
    {
      title: "Favorite Farmers",
      value: "23",
      change: "+4",
      icon: Heart,
      description: "trusted sellers",
    },
  ];

  const activeOrders = [
    {
      id: "ORD-5678",
      farmer: "Green Valley Farm",
      product: "Fresh Organic Tomatoes",
      quantity: "100 kg",
      amount: "₹4,500",
      status: "In Transit",
      eta: "Tomorrow",
    },
    {
      id: "ORD-5677",
      farmer: "Sunrise Agriculture",
      product: "Premium Rice",
      quantity: "10 quintal",
      amount: "₹12,000",
      status: "Processing",
      eta: "3 days",
    },
    {
      id: "ORD-5676",
      farmer: "Highland Farms",
      product: "Fresh Potatoes",
      quantity: "150 kg",
      amount: "₹4,500",
      status: "Delivered",
      eta: "Completed",
    },
  ];

  const favoriteFarmers = [
    {
      name: "Green Valley Farm",
      location: "Keroka",
      rating: 4.8,
      products: 15,
      image: "https://images.unsplash.com/photo-1595855759920-86582396756a?w=100",
    },
    {
      name: "Sunrise Agriculture",
      location: "Menyinkwa",
      rating: 4.9,
      products: 12,
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=100",
    },
    {
      name: "Highland Farms",
      location: "Suneka",
      rating: 4.7,
      products: 18,
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=100",
    },
  ];

  const userName = getUserName();

  return (
    <div className="min-h-screen bg-background relative">
      <EnvCheck />
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-green-600">Buyer Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {userName}</p>
          </div>
          <Button variant="hero" size="lg" className="shadow-lg">
            <Search className="h-5 w-5 mr-2" />
            Browse Marketplace
          </Button>
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
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <Badge variant="secondary" className="text-xs">
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Active Orders */}
          <Card className="border-border lg:col-span-2">
            <CardHeader>
              <CardTitle>Active Orders</CardTitle>
              <CardDescription>Track your purchases and deliveries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeOrders.map((order, index) => (
                  <div
                    key={index}
                    className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-sm text-muted-foreground">{order.id}</span>
                      <Badge
                        variant={
                          order.status === "Delivered"
                            ? "default"
                            : order.status === "In Transit"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">{order.product}</h4>
                      <p className="text-sm text-muted-foreground">from {order.farmer}</p>
                      <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
                        <span className="text-muted-foreground">{order.quantity}</span>
                        <span className="font-semibold text-primary">{order.amount}</span>
                      </div>
                      {order.status !== "Delivered" && (
                        <p className="text-xs text-muted-foreground">ETA: {order.eta}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View Order History
              </Button>
            </CardContent>
          </Card>

          {/* Favorite Farmers */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Favorite Farmers</CardTitle>
              <CardDescription>Your trusted suppliers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {favoriteFarmers.map((farmer, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                  >
                    <img
                      src={farmer.image}
                      alt={farmer.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">{farmer.name}</h4>
                      <p className="text-xs text-muted-foreground">{farmer.location}</p>
                      <div className="flex items-center gap-2 text-xs mt-1">
                        <span className="text-warning">★ {farmer.rating}</span>
                        <span className="text-muted-foreground">• {farmer.products} products</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Find More Farmers
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Search */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Quick Search</CardTitle>
            <CardDescription>Find produce you need quickly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search for vegetables, fruits, grains..." className="pl-10" />
              </div>
              <Button variant="default">Search</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">Tomatoes</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">Rice</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">Potatoes</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">Wheat</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">Mangoes</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      <EnhancedChatBot />
    </div>
  );
};

export default BuyerDashboard;
