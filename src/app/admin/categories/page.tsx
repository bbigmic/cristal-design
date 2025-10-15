"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Package
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  _count: {
    products: number;
  };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
  });

  // Pobierz kategorie
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Generuj slug z nazwy
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  // Obsługa zmian w formularzu
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'name' && { slug: generateSlug(value) })
    }));
  };

  // Rozpocznij tworzenie nowej kategorii
  const handleCreate = () => {
    setIsCreating(true);
    setEditingCategory(null);
    setFormData({ name: '', description: '', slug: '' });
  };

  // Rozpocznij edycję kategorii
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsCreating(false);
    setFormData({
      name: category.name,
      description: category.description || '',
      slug: category.slug,
    });
  };

  // Anuluj edycję/tworzenie
  const handleCancel = () => {
    setEditingCategory(null);
    setIsCreating(false);
    setFormData({ name: '', description: '', slug: '' });
  };

  // Zapisz kategorię
  const handleSave = async () => {
    try {
      const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchCategories();
        handleCancel();
      } else {
        const error = await response.json();
        alert(error.error || 'Wystąpił błąd podczas zapisywania kategorii');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Wystąpił błąd podczas zapisywania kategorii');
    }
  };

  // Usuń kategorię
  const handleDelete = async (category: Category) => {
    if (!confirm(`Czy na pewno chcesz usunąć kategorię "${category.name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchCategories();
      } else {
        const error = await response.json();
        alert(error.error || 'Wystąpił błąd podczas usuwania kategorii');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Wystąpił błąd podczas usuwania kategorii');
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
          <h1 className="text-3xl font-bold text-gray-900">Kategorie</h1>
          <p className="text-gray-600">Zarządzaj kategoriami produktów</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Dodaj kategorię
        </Button>
      </div>

      {/* Formularz tworzenia/edycji */}
      {(isCreating || editingCategory) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingCategory ? 'Edytuj kategorię' : 'Nowa kategoria'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nazwa kategorii *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="np. Marmur"
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="np. marmur"
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
                placeholder="Opis kategorii..."
                rows={3}
              />
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

      {/* Lista kategorii */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{category.name}</CardTitle>
                <Badge variant="secondary">
                  {category._count.products} produktów
                </Badge>
              </div>
              <CardDescription>
                Slug: {category.slug}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {category.description && (
                <p className="text-sm text-gray-600 mb-4">
                  {category.description}
                </p>
              )}
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(category)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(category)}
                  disabled={category._count.products > 0}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {category._count.products > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  Nie można usunąć kategorii z produktami
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Brak kategorii
            </h3>
            <p className="text-gray-600 text-center mb-4">
              Dodaj pierwszą kategorię, aby rozpocząć zarządzanie produktami
            </p>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Dodaj kategorię
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
