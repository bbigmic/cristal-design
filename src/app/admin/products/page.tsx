"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Package,
  Save,
  X,
  Upload,
  Image as ImageIcon
} from "lucide-react";
import Image from "next/image";

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
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    categoryId: '',
    isActive: true,
    dimensions: '',
    material: '',
    features: [] as string[],
    images: [] as string[],
  });
  const [newFeature, setNewFeature] = useState('');

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

  // Filtruj produkty
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Obsługa zmian w formularzu
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      isActive: checked
    }));
  };

  // Dodaj nową cechę
  const handleAddFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  // Usuń cechę
  const handleRemoveFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }));
  };

  // Upload zdjęć
  const handleImageUpload = async (files: FileList) => {
    setUploadingImages(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'products');

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          return data.url;
        }
        throw new Error('Upload failed');
      });

      const urls = await Promise.all(uploadPromises);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...urls]
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Wystąpił błąd podczas przesyłania zdjęć');
    } finally {
      setUploadingImages(false);
    }
  };

  // Usuń zdjęcie
  const handleRemoveImage = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(url => url !== imageUrl)
    }));
  };

  // Rozpocznij tworzenie nowego produktu
  const handleCreate = () => {
    setIsCreating(true);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      categoryId: categories[0]?.id || '',
      isActive: true,
      dimensions: '',
      material: '',
      features: [],
      images: [],
    });
  };

  // Rozpocznij edycję produktu
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsCreating(false);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      categoryId: product.categoryId,
      isActive: product.isActive,
      dimensions: product.dimensions || '',
      material: product.material || '',
      features: product.features,
      images: product.images.map(img => img.url),
    });
  };

  // Anuluj edycję/tworzenie
  const handleCancel = () => {
    setEditingProduct(null);
    setIsCreating(false);
    setFormData({
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      isActive: true,
      dimensions: '',
      material: '',
      features: [],
      images: [],
    });
  };

  // Zapisz produkt
  const handleSave = async () => {
    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchProducts();
        handleCancel();
      } else {
        const error = await response.json();
        alert(error.error || 'Wystąpił błąd podczas zapisywania produktu');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Wystąpił błąd podczas zapisywania produktu');
    }
  };

  // Usuń produkt
  const handleDelete = async (product: Product) => {
    if (!confirm(`Czy na pewno chcesz usunąć produkt "${product.name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchProducts();
      } else {
        const error = await response.json();
        alert(error.error || 'Wystąpił błąd podczas usuwania produktu');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Wystąpił błąd podczas usuwania produktu');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Ładowanie...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Produkty</h1>
          <p className="text-gray-600">Zarządzaj swoimi produktami</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Dodaj produkt
        </Button>
      </div>

      {/* Filtry */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Szukaj produktów..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                onClick={() => setSelectedCategory("all")}
                size="sm"
              >
                Wszystkie
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  size="sm"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formularz tworzenia/edycji */}
      {(isCreating || editingProduct) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingProduct ? 'Edytuj produkt' : 'Nowy produkt'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nazwa produktu *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="np. Płyta Marmurowa Bianco"
                />
              </div>
              <div>
                <Label htmlFor="price">Cena (zł) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="450"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Opis</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Opis produktu..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="categoryId">Kategoria *</Label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Wybierz kategorię</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="dimensions">Wymiary</Label>
                <Input
                  id="dimensions"
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={handleInputChange}
                  placeholder="120x60 cm"
                />
              </div>
              <div>
                <Label htmlFor="material">Materiał</Label>
                <Input
                  id="material"
                  name="material"
                  value={formData.material}
                  onChange={handleInputChange}
                  placeholder="Marmur"
                />
              </div>
            </div>

            <div>
              <Label>Cechy produktu</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="np. Wodoodporna"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                />
                <Button type="button" onClick={handleAddFeature}>
                  Dodaj
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {feature}
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(feature)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label>Zdjęcia produktu</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600">
                    {uploadingImages ? 'Przesyłanie...' : 'Kliknij aby dodać zdjęcia'}
                  </p>
                </label>
              </div>
              
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {formData.images.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={imageUrl}
                        alt={`Product image ${index + 1}`}
                        width={150}
                        height={150}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(imageUrl)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="isActive">Produkt aktywny</Label>
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Zapisz
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" />
                Anuluj
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista produktów */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow">
            <div className="relative">
              <div className="aspect-square relative overflow-hidden rounded-t-lg">
                {product.images.length > 0 ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <Badge variant={product.isActive ? "default" : "secondary"}>
                    {product.isActive ? "Aktywny" : "Nieaktywny"}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex flex-col space-y-2">
                    <Button size="icon" variant="secondary" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="h-8 w-8"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="h-8 w-8"
                      onClick={() => handleDelete(product)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{product.category.name}</Badge>
                  <span className="text-sm text-gray-500">{product.dimensions}</span>
                </div>
                <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
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
                    <span className="text-sm text-gray-500">{product.material}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {product.features.slice(0, 2).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500">
                    Dodano: {new Date(product.createdAt).toLocaleDateString('pl-PL')}
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Brak produktów</h3>
            <p className="text-gray-500 text-center mb-4">
              {searchTerm || selectedCategory !== "all" 
                ? "Nie znaleziono produktów spełniających kryteria wyszukiwania."
                : "Nie masz jeszcze żadnych produktów. Dodaj pierwszy produkt, aby rozpocząć."
              }
            </p>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Dodaj produkt
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}