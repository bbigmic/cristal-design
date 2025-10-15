"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductImage {
  id: string;
  url: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  category: Category;
  isActive: boolean;
  dimensions?: string;
  material?: string;
  features: string[];
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Pobierz 4 ostatnio dodane produkty
  const fetchLatestProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        // Sortuj po dacie utworzenia (najnowsze pierwsze) i weź tylko 4
        const latestProducts = (data.products || [])
          .filter((product: Product) => product.isActive)
          .sort((a: Product, b: Product) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 4);
        setProducts(latestProducts);
      }
    } catch (error) {
      console.error('Error fetching latest products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Nasze Produkty
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Odkryj naszą kolekcję płyt dekoracyjnych, które idealnie sprawdzą się 
              w kuchni, salonie, łazience czy korytarzu.
            </p>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Ładowanie produktów...</div>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Najnowsze Produkty
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Odkryj nasze najnowsze płyty dekoracyjne, które idealnie sprawdzą się 
            w kuchni, salonie, łazience czy korytarzu.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {products.length > 0 ? (
            products.map((product) => (
              <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <Link href={`/products/${product.id}`}>
                  <div className="relative">
                    <div className="aspect-square relative overflow-hidden">
                      {product.images.length > 0 ? (
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Package className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      <Badge className="absolute top-4 left-4 bg-green-500 hover:bg-green-500">
                        Nowość
                      </Badge>
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex flex-col space-y-2">
                          <Button 
                            size="icon" 
                            variant="secondary" 
                            className="h-10 w-10"
                            onClick={(e) => {
                              e.preventDefault();
                              // TODO: Add to favorites
                            }}
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="secondary" 
                            className="h-10 w-10"
                            onClick={(e) => {
                              e.preventDefault();
                              window.location.href = `/products/${product.id}`;
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {product.category.name}
                        </Badge>
                        {product.dimensions && (
                          <span className="text-sm text-gray-500">{product.dimensions}</span>
                        )}
                      </div>
                      <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {product.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-gray-900">
                            {product.price} zł
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(product.features) && product.features.slice(0, 2).map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Link>
                
                  {/* Add to cart button outside link */}
                  <div className="p-4 pt-0">
                    <AddToCartButton
                      product={product}
                      className="w-full group-hover:bg-blue-700 transition-colors"
                    />
                  </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Brak produktów
              </h3>
              <p className="text-gray-500">
                Nie ma jeszcze żadnych produktów do wyświetlenia.
              </p>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Link href="/products">
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
              Zobacz wszystkie produkty
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
