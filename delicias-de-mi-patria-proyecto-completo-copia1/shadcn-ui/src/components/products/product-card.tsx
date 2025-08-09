import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useCart } from '@/context/cart-context';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <Link to={`/producto/${product.id}`} className="flex-grow">
        <div className="aspect-square relative overflow-hidden">
          <img
            src={product.image || "/images/placeholder.jpg"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium text-lg line-clamp-2">{product.name}</h3>
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
          <p className="text-primary font-bold mt-2">${product.price.toFixed(2)}</p>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleAddToCart}
          className="w-full gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          Añadir al Carrito
        </Button>
      </CardFooter>
    </Card>
  );
}