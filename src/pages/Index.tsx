import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import ProductCard from "@/components/ProductCard";
import heroImage from "@/assets/hero.jpg";
import { TrendingUp, Users, Shield, BarChart3, ArrowRight } from "lucide-react";
import { convertToKES } from "@/lib/currency";

const Index = () => {
  const featuredProducts = [{
    name: "Premium Arabica Coffee Beans",
    farmer: "Nyeri Highlands Coffee Co-op",
    location: "Nyeri County, Kenya",
    price: "850",
    unit: "kg",
    rating: 4.9,
    reviews: 42,
    image: "https://images.unsplash.com/photo-1610632380989-680fe40816c6?w=400",
    inStock: true,
    featured: true
  }, {
    name: "Premium Rice",
    farmer: "Sunrise Agriculture",
  location: "Kisii, Kenya",
    price: "150",
    unit: "quintal",
    rating: 4.9,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
    inStock: true
  }, {
    name: "Fresh Potatoes",
    farmer: "Highland Farms",
    location: "Kisii, Kenya",
    price: "150",
    unit: "kg",
    rating: 4.6,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400",
    inStock: true
  }];
  const features = [{
    icon: Users,
    title: "Direct Connection",
    description: "Connect farmers directly with buyers, eliminating middlemen and increasing profits."
  }, {
    icon: TrendingUp,
    title: "Dynamic Pricing",
    description: "Real-time transparent pricing based on supply and demand dynamics."
  }, {
    icon: Shield,
    title: "Quality Verified",
    description: "Rating system ensures trust and accountability for both parties."
  }, {
    icon: BarChart3,
    title: "Market Insights",
    description: "Track sales, income, and demand trends with comprehensive dashboards."
  }];
  return <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block">
                <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold border border-primary/20">
                  Empowering Farmers & Buyers
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Fair Trade,{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Fresh Produce, Gussi Finest
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Direct farmer-to-buyer marketplace eliminating middlemen. Get fair prices, transparent
                transactions, and fresh produce delivered efficiently.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/marketplace">
                  <Button variant="hero" size="xl" className="group">
                    Explore Marketplace
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button variant="outline" size="xl">
                  Learn More
                </Button>
              </div>
              <div className="flex items-center gap-8 pt-6">
                <div>
                  <div className="text-3xl font-bold text-primary">150+</div>
                  <div className="text-sm text-muted-foreground">Verified Farmers</div>
                </div>
                <div className="h-12 w-px bg-border" />
                <div>
                  <div className="text-3xl font-bold text-secondary">45+</div>
                  <div className="text-sm text-muted-foreground">Active Buyers</div>
                </div>
                <div className="h-12 w-px bg-border" />
                <div>
                  <div className="text-3xl font-bold text-primary">10K+</div>
                  <div className="text-sm text-muted-foreground">Products Traded</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />
              <img 
                src={heroImage} 
                alt="Vibrant African marketplace with fresh fruits and produce" 
                className="relative rounded-3xl shadow-2xl w-full h-[600px] object-cover object-center" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Gusii Farm Connect?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A transparent, fair, and efficient marketplace designed for the agricultural community
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => <Card key={index} className="border-border hover:shadow-lg transition-all group">
                <CardContent className="p-6 space-y-4">
                  <div className="bg-gradient-to-br from-primary to-primary/80 p-3 rounded-xl w-fit group-hover:scale-110 transition-transform shadow-md">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Featured Products</h2>
              <p className="text-muted-foreground">Fresh produce from verified farmers</p>
            </div>
            <Link to="/marketplace">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product, index) => <ProductCard key={index} {...product} />)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Agricultural Trade?
            </h2>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Join thousands of farmers and buyers creating a fair, transparent marketplace
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/auth?role=admin">
                <Button variant="secondary" size="xl" className="shadow-lg">
                  Join as Farmer
                </Button>
              </Link>
              <Link to="/auth?role=buyer">
                <Button variant="outline" size="xl" className="bg-background/10 backdrop-blur-sm border-primary-foreground/20 text-primary-foreground hover:bg-background/20 shadow-lg">
                  Join as Buyer
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">FarmConnect</h3>
              <p className="text-muted-foreground text-sm">
                Empowering farmers and buyers through transparent, direct trade.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/marketplace" className="hover:text-primary transition-colors">Marketplace</Link></li>
                <li><Link to="/farmer-dashboard" className="hover:text-primary transition-colors">For Farmers</Link></li>
                <li><Link to="/buyer-dashboard" className="hover:text-primary transition-colors">For Buyers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 FarmConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;