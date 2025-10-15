"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Eye, 
  Edit, 
  MoreHorizontal,
  ShoppingCart,
  User,
  MapPin
} from "lucide-react";

const orders = [
  {
    id: "ORD-001",
    customer: {
      name: "Jan Kowalski",
      email: "jan.kowalski@example.com",
      phone: "+48 123 456 789",
    },
    products: [
      { name: "Płyta Marmurowa Bianco", quantity: 2, price: 450 },
      { name: "Montaż", quantity: 1, price: 200 },
    ],
    totalAmount: 1100,
    status: "W trakcie",
    shippingAddress: "ul. Przykładowa 123, 00-000 Warszawa",
    notes: "Proszę o kontakt telefoniczny przed dostawą",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T14:20:00Z",
  },
  {
    id: "ORD-002",
    customer: {
      name: "Anna Nowak",
      email: "anna.nowak@example.com",
      phone: "+48 987 654 321",
    },
    products: [
      { name: "Płyta Granitowa Nero", quantity: 1, price: 520 },
    ],
    totalAmount: 520,
    status: "Zakończone",
    shippingAddress: "ul. Testowa 456, 30-000 Kraków",
    notes: "",
    createdAt: "2024-01-14T09:15:00Z",
    updatedAt: "2024-01-16T16:45:00Z",
  },
  {
    id: "ORD-003",
    customer: {
      name: "Piotr Wiśniewski",
      email: "piotr.wisniewski@example.com",
      phone: "+48 555 123 456",
    },
    products: [
      { name: "Płyta Ceramiczna Modern", quantity: 3, price: 380 },
      { name: "Montaż", quantity: 1, price: 200 },
    ],
    totalAmount: 1340,
    status: "Nowe",
    shippingAddress: "ul. Główna 789, 80-000 Gdańsk",
    notes: "Klient prosi o szybką realizację",
    createdAt: "2024-01-13T16:20:00Z",
    updatedAt: "2024-01-13T16:20:00Z",
  },
  {
    id: "ORD-004",
    customer: {
      name: "Maria Kowalczyk",
      email: "maria.kowalczyk@example.com",
      phone: "+48 777 888 999",
    },
    products: [
      { name: "Płyta Kwarcowa Lux", quantity: 1, price: 680 },
      { name: "Montaż", quantity: 1, price: 200 },
    ],
    totalAmount: 880,
    status: "Anulowane",
    shippingAddress: "ul. Słoneczna 321, 50-000 Wrocław",
    notes: "Klient anulował zamówienie",
    createdAt: "2024-01-12T11:45:00Z",
    updatedAt: "2024-01-14T10:30:00Z",
  },
];

const statusOptions = [
  { value: "Wszystkie", label: "Wszystkie" },
  { value: "Nowe", label: "Nowe" },
  { value: "W trakcie", label: "W trakcie" },
  { value: "Zakończone", label: "Zakończone" },
  { value: "Anulowane", label: "Anulowane" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Nowe":
      return "bg-blue-100 text-blue-800";
    case "W trakcie":
      return "bg-yellow-100 text-yellow-800";
    case "Zakończone":
      return "bg-green-100 text-green-800";
    case "Anulowane":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Wszystkie");

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "Wszystkie" || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Zamówienia</h1>
          <p className="text-gray-600">Zarządzaj zamówieniami klientów</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Szukaj zamówień..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {statusOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={selectedStatus === option.value ? "default" : "outline"}
                  onClick={() => setSelectedStatus(option.value)}
                  size="sm"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.customer.name}</p>
                        <p className="text-xs text-gray-500">{order.customer.email}</p>
                        <p className="text-xs text-gray-500">{order.customer.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <ShoppingCart className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Produkty</p>
                        <div className="text-xs text-gray-500">
                          {order.products.map((product, index) => (
                            <div key={index}>
                              {product.quantity}x {product.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Adres</p>
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {order.shippingAddress}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {order.totalAmount} zł
                      </p>
                      <p className="text-xs text-gray-500">
                        Ostatnia aktualizacja: {formatDate(order.updatedAt)}
                      </p>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Uwagi:</span> {order.notes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingCart className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Brak zamówień</h3>
            <p className="text-gray-500 text-center">
              {searchTerm || selectedStatus !== "Wszystkie" 
                ? "Nie znaleziono zamówień spełniających kryteria wyszukiwania."
                : "Nie masz jeszcze żadnych zamówień."
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
