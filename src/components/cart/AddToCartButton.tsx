"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Check } from 'lucide-react';
import { Product } from '@/types';

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'secondary';
  showIcon?: boolean;
}

export function AddToCartButton({
  product,
  quantity = 1,
  className = '',
  size = 'default',
  variant = 'default',
  showIcon = true,
}: AddToCartButtonProps) {
  const { addToCart, isInCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    // Simulate a brief delay for animation
    await new Promise(resolve => setTimeout(resolve, 200));
    
    addToCart(product, quantity);
    setJustAdded(true);
    setIsAdding(false);
    
    // Reset the "just added" state after animation
    setTimeout(() => setJustAdded(false), 2000);
  };

  const isProductInCart = isInCart(product.id);

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isAdding}
      size={size}
      variant={justAdded ? 'default' : variant}
      className={`relative overflow-hidden transition-all duration-300 ${
        justAdded 
          ? 'bg-green-600 hover:bg-green-700 text-white' 
          : isProductInCart 
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : ''
      } ${className}`}
    >
      {isAdding ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Dodawanie...</span>
        </div>
      ) : justAdded ? (
        <div className="flex items-center space-x-2 animate-pulse">
          <Check className="h-4 w-4" />
          <span>Dodano!</span>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          {showIcon && <ShoppingCart className="h-4 w-4" />}
          <span>
            {isProductInCart ? 'W koszyku' : 'Dodaj do koszyka'}
          </span>
        </div>
      )}
      
      {/* Ripple effect */}
      {justAdded && (
        <div className="absolute inset-0 bg-white opacity-30 animate-ping" />
      )}
    </Button>
  );
}
