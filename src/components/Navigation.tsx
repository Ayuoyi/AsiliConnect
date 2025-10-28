import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SignInDialog from "@/components/SignInDialog";
import { Menu, Leaf } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import { getCart } from "@/lib/cart";
import { getNotifications, markAllRead, markRead, clearNotifications } from "@/lib/notifications";
import { Bell } from "lucide-react";

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(() => getCart().reduce((s, it) => s + it.quantity, 0));
  const [notifications, setNotifications] = useState(() => getNotifications());
  const [notifOpen, setNotifOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const onUpdate = (e: any) => setCartCount((e.detail?.cart ?? getCart()).reduce((s: number, it: any) => s + it.quantity, 0));
    window.addEventListener("cart:updated", onUpdate as EventListener);
    return () => window.removeEventListener("cart:updated", onUpdate as EventListener);
  }, []);

  useEffect(() => {
    const onNotif = (e: any) => setNotifications(e.detail?.notifications ?? getNotifications());
    window.addEventListener("notifications:updated", onNotif as EventListener);
    return () => window.removeEventListener("notifications:updated", onNotif as EventListener);
  }, []);

  return (
    <nav className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-1 rounded-lg group-hover:shadow-lg transition-all">
              <img src="src/assets/logo.png" alt="FarmConnect logo" className="h-8 w-auto object-contain" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AsiliConnect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/marketplace" className="text-foreground hover:text-primary transition-colors font-medium">
              Marketplace
            </Link>
            <Link to="https://ayuoyi.github.io/logistics/" className="text-foreground hover:text-primary transition-colors font-medium">
              Logistics
            </Link>
            <Link to="/farmer-dashboard" className="text-foreground hover:text-primary transition-colors font-medium">
              For Farmers
            </Link>
            <Link to="/buyer-dashboard" className="text-foreground hover:text-primary transition-colors font-medium">
              For Buyers
            </Link>
            <Link to="/cart" className="text-foreground hover:text-primary transition-colors font-medium flex items-center gap-2">
              Cart
              <span className="text-sm bg-muted px-2 py-0.5 rounded">{cartCount}</span>
            </Link>

            {/* Notifications */}
            <div className="relative">
              <button className="p-2 rounded hover:bg-muted" onClick={() => setNotifOpen(!notifOpen)} aria-label="Notifications">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 text-xs bg-destructive text-white rounded-full px-1">{unreadCount}</span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded shadow-lg z-50">
                  <div className="p-3 border-b border-border flex items-center justify-between">
                    <div className="font-semibold">Notifications</div>
                    <div className="text-xs text-muted-foreground flex gap-2">
                      <button onClick={() => { markAllRead(); }} className="underline">Mark all read</button>
                      <button onClick={() => { clearNotifications(); }} className="underline">Clear</button>
                    </div>
                  </div>
                  <div className="max-h-64 overflow-auto">
                    {notifications.length === 0 ? (
                      <div className="p-3 text-sm text-muted-foreground">No notifications</div>
                    ) : (
                      notifications.map((n) => (
                        <Link key={n.id} to={`/marketplace/product/${n.productId}`} onClick={() => { markRead(n.id); setNotifOpen(false); }} className={`block p-3 border-b border-border ${n.read ? "bg-transparent" : "bg-muted/20"}`}>
                          <div className="text-sm font-medium">{n.name}</div>
                          <div className="text-xs text-muted-foreground">Listed by {n.farmer} • {new Date(n.createdAt).toLocaleString()}</div>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <Link to="/auth">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
            <Link to="/auth?role=buyer">
              <Button variant="hero" size="sm">Get Started</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-3">
              <Link to="/marketplace" className="px-4 py-2 hover:bg-muted rounded-lg transition-colors">
                Marketplace
              </Link>
              <Link to="/farmer-dashboard" className="px-4 py-2 hover:bg-muted rounded-lg transition-colors">
                For Farmers
              </Link>
              <Link to="/buyer-dashboard" className="px-4 py-2 hover:bg-muted rounded-lg transition-colors">
                For Buyers
              </Link>
              <div className="flex flex-col gap-2 px-4 pt-2">
                <Link to="/auth">
                  <Button variant="outline" size="sm" className="w-full">Sign In</Button>
                </Link>
                <Link to="/auth?role=buyer">
                  <Button variant="hero" size="sm" className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
