"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Package, 
  Check, 
  Share2,
  Heart,
  Ruler,
  Palette,
  Shield,
  Zap
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
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

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Pobierz produkt
  const fetchProduct = useCallback(async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      } else {
        console.error('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id, fetchProduct]);


  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link skopiowany do schowka!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-16 flex items-center justify-center h-64">
          <div className="text-lg">Ładowanie produktu...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-16 flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Produkt nie został znaleziony
              </h2>
              <p className="text-gray-600 mb-4">
                Produkt, którego szukasz, nie istnieje lub został usunięty.
              </p>
              <Link href="/products">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Wróć do produktów
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Strona główna
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/products" className="text-gray-500 hover:text-gray-700">
              Produkty
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Galeria zdjęć */}
          <div className="space-y-4">
            {/* Główne zdjęcie */}
            <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
              {product.images.length > 0 ? (
                <Image
                  src={product.images[selectedImageIndex].url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-24 w-24 text-gray-400" />
                </div>
              )}
            </div>

            {/* Miniaturki */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square relative overflow-hidden rounded-md border-2 transition-colors ${
                      selectedImageIndex === index
                        ? "border-blue-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informacje o produkcie */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{product.category.name}</Badge>
                {product.isActive && (
                  <Badge variant="default">Dostępny</Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <p className="text-4xl font-bold text-blue-600 mb-4">
                {product.price} zł
              </p>
            </div>

            {product.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Opis produktu
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Szczegóły produktu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.dimensions && (
                <div className="flex items-center gap-3">
                  <Ruler className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Wymiary</p>
                    <p className="font-medium">{product.dimensions}</p>
                  </div>
                </div>
              )}
              {product.material && (
                <div className="flex items-center gap-3">
                  <Palette className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Materiał</p>
                    <p className="font-medium">{product.material}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Cechy produktu */}
            {product.features.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Cechy produktu
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Akcje */}
            <div className="space-y-4">
              <div className="flex gap-2">
                <AddToCartButton
                  product={product}
                  className="flex-1"
                  size="lg"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="flex-1"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Udostępnij
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Dodaj do ulubionych
                </Button>
              </div>
            </div>

            {/* Informacje dodatkowe */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-600">
                  Gwarancja jakości
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-500" />
                <span className="text-sm text-gray-600">
                  Szybka dostawa
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-purple-500" />
                <span className="text-sm text-gray-600">
                  Profesjonalny montaż
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Powrót do produktów */}
        <div className="mt-12 text-center">
          <Link href="/products">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Wróć do wszystkich produktów
            </Button>
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
