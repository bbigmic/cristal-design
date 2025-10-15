"use client";

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';

interface CartBadgeProps {
  className?: string;
}

export function CartBadge({ className }: CartBadgeProps) {
  const { totalItems } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);
  const [previousCount, setPreviousCount] = useState(0);

  useEffect(() => {
    if (totalItems > previousCount && previousCount > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
    setPreviousCount(totalItems);
  }, [totalItems, previousCount]);

  if (totalItems === 0) return null;

  return (
    <Badge
      className={`absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center ${
        isAnimating ? 'animate-bounce scale-110' : ''
      } transition-all duration-300 ${className}`}
    >
      {totalItems > 99 ? '99+' : totalItems}
    </Badge>
  );
}

