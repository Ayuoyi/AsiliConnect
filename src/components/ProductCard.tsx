import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, User, Leaf, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import BadgePill from "@/components/BadgePill";
import FeedbackDialog from "@/components/FeedbackDialog";
import { convertToKES } from "@/lib/currency";

interface ProductCardProps {
  name: string;
  farmer: string;
  location: string;
  price: string | number;
  unit: string;
  rating?: number;
  reviews?: number;
  image?: string;
  inStock?: boolean;
  featured?: boolean;
  organic?: boolean;
  local?: boolean;
}

const ProductCard = ({
  name,
  farmer,
  location,
  price,
  unit,
  rating = 0,
  reviews = 0,
  image = "",
  inStock = false,
  featured = false,
  organic = false,
  local = false,
}: ProductCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group border-border">
      <div className="relative overflow-hidden h-48">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <Link to={`/marketplace/product/${name.replace(/\s+/g, "-").toLowerCase()}`} className="block w-full h-full">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </Link>
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">No image</div>
        )}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {featured && <BadgePill icon={<Star className="h-4 w-4 text-yellow-500" />} label="Featured" variant="yellow" ariaLabel="Featured product" title="Featured product" />}
          {organic && <BadgePill icon={<Leaf className="h-4 w-4 text-emerald-500" />} label="Organic" variant="emerald" ariaLabel="Organic produce" title="Organic produce" />}
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
          {!inStock ? (
            <BadgePill icon={<XCircle className="h-4 w-4 text-red-500" />} label="Out of Stock" variant="red" ariaLabel="Out of stock" title="Out of stock" />
          ) : (
            local && <BadgePill icon={<MapPin className="h-4 w-4 text-sky-500" />} label="Local" variant="sky" ariaLabel="Local product" title="Local product" />
          )}
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
          <Link to={`/marketplace/product/${name.replace(/\s+/g, "-").toLowerCase()}`} className="block">{name}</Link>
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <User className="h-4 w-4" />
          <span>{farmer}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>

        <div className="flex items-center gap-1 mb-3">
          <Star className="h-4 w-4 fill-warning text-warning" />
          <span className="font-medium">{rating}</span>
          <span className="text-sm text-muted-foreground">({reviews})</span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary">{convertToKES(price)}</span>
          <span className="text-sm text-muted-foreground">per {unit}</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 gap-2">
        <Button className="flex-1" disabled={!inStock}>
          {inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
        <FeedbackDialog productId={name.replace(/\s+/g, "-").toLowerCase()} productName={name} />
        <Button variant="outline" size="icon">
          <Star className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
