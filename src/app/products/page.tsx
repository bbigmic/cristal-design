"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Grid, 
  List,
  Package
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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Pobierz produkty i kategorie
  const fetchProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') {
        params.append('categoryId', selectedCategory);
      }
      
      const response = await fetch(`/api/products?${params}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [selectedCategory, fetchProducts]);

  // Filtruj i sortuj produkty
  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.material?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
      return matchesSearch && matchesPrice && product.isActive;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setPriceRange({ min: 0, max: 10000 });
    setSortBy("newest");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-16 flex items-center justify-center h-64">
          <div className="text-lg">Ładowanie produktów...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header */}
      <div className="bg-white border-b pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Nasze Produkty
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Odkryj naszą kolekcję eleganckich płyt dekoracyjnych, 
              które idealnie sprawdzą się w każdym wnętrzu
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar z filtrami */}
          <div className="lg:w-64 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Filtry</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-sm"
                >
                  Wyczyść
                </Button>
              </div>

              {/* Wyszukiwanie */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wyszukaj
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Nazwa produktu..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Kategorie */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategoria
                  </label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedCategory === "all"
                          ? "bg-blue-100 text-blue-700"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      Wszystkie
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          selectedCategory === category.id
                            ? "bg-blue-100 text-blue-700"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Zakres cenowy */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cena (zł)
                  </label>
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                        className="text-sm"
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 10000 }))}
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Główna zawartość */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    Znaleziono {filteredAndSortedProducts.length} produktów
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Sortowanie */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="newest">Najnowsze</option>
                    <option value="price-low">Cena: od najniższej</option>
                    <option value="price-high">Cena: od najwyższej</option>
                    <option value="name">Nazwa: A-Z</option>
                  </select>

                  {/* Widok */}
                  <div className="flex border border-gray-300 rounded-md">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 ${viewMode === "grid" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"}`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 ${viewMode === "list" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"}`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista produktów */}
            {filteredAndSortedProducts.length > 0 ? (
              <div className={
                viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-3 gap-8"
                  : "space-y-4"
              }>
                {filteredAndSortedProducts.map((product) => (
                  <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                    <Link href={`/products/${product.id}`}>
                      <div className="relative">
                        <div className={`relative overflow-hidden rounded-t-lg ${
                          viewMode === "grid" ? "aspect-[4/3]" : "h-48"
                        }`}>
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
                          <div className="absolute top-4 left-4">
                            <Badge variant="secondary">
                              {product.category.name}
                            </Badge>
                          </div>
                        </div>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-xl line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {product.name}
                          </CardTitle>
                          <CardDescription className="line-clamp-3 text-base">
                            {product.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-3xl font-bold text-gray-900">
                                {product.price} zł
                              </span>
                              {product.dimensions && (
                                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {product.dimensions}
                                </span>
                              )}
                            </div>
                            {product.material && (
                              <p className="text-base text-gray-600 font-medium">
                                Materiał: {product.material}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-2">
                              {Array.isArray(product.features) && product.features.slice(0, 4).map((feature, index) => (
                                <Badge key={index} variant="secondary" className="text-sm">
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
                        className="w-full"
                      />
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nie znaleziono produktów
                  </h3>
                  <p className="text-gray-500 text-center mb-4">
                    Spróbuj zmienić kryteria wyszukiwania lub filtry
                  </p>
                  <Button onClick={resetFilters}>
                    Wyczyść filtry
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
