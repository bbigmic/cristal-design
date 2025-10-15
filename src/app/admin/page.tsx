"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Plus,
  Eye,
  Edit,
  Trash2
} from "lucide-react";

const stats = [
  {
    title: "Wszystkie produkty",
    value: "24",
    change: "+12%",
    changeType: "positive",
    icon: Package,
  },
  {
    title: "Aktywni użytkownicy",
    value: "156",
    change: "+8%",
    changeType: "positive",
    icon: Users,
  },
  {
    title: "Zamówienia",
    value: "89",
    change: "+23%",
    changeType: "positive",
    icon: ShoppingCart,
  },
  {
    title: "Przychód",
    value: "45,230 zł",
    change: "+15%",
    changeType: "positive",
    icon: TrendingUp,
  },
];

const recentOrders = [
  {
    id: "ORD-001",
    customer: "Jan Kowalski",
    product: "Płyta Marmurowa Bianco",
    amount: 450,
    status: "W trakcie",
    date: "2024-01-15",
  },
  {
    id: "ORD-002",
    customer: "Anna Nowak",
    product: "Płyta Granitowa Nero",
    amount: 520,
    status: "Zakończone",
    date: "2024-01-14",
  },
  {
    id: "ORD-003",
    customer: "Piotr Wiśniewski",
    product: "Płyta Ceramiczna Modern",
    amount: 380,
    status: "Nowe",
    date: "2024-01-13",
  },
];

const recentProducts = [
  {
    id: "1",
    name: "Płyta Marmurowa Bianco",
    category: "Marmur",
    price: 450,
    status: "Aktywny",
    stock: 12,
  },
  {
    id: "2",
    name: "Płyta Granitowa Nero",
    category: "Granit",
    price: 520,
    status: "Aktywny",
    stock: 8,
  },
  {
    id: "3",
    name: "Płyta Ceramiczna Modern",
    category: "Ceramika",
    price: 380,
    status: "Nieaktywny",
    stock: 0,
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Przegląd Twojej platformy sprzedaży</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Dodaj produkt
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change} z poprzedniego miesiąca
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders and Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Ostatnie zamówienia</CardTitle>
            <CardDescription>
              Najnowsze zamówienia z Twojej platformy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                    <p className="text-sm text-gray-500">{order.product}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-medium">{order.amount} zł</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'Nowe' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'W trakcie' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {order.status}
                    </span>
                    <p className="text-xs text-gray-500">{order.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Zobacz wszystkie zamówienia
            </Button>
          </CardContent>
        </Card>

        {/* Recent Products */}
        <Card>
          <CardHeader>
            <CardTitle>Produkty</CardTitle>
            <CardDescription>
              Zarządzaj swoimi produktami
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.category}</p>
                    <p className="text-sm text-gray-500">Stan: {product.stock}</p>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="font-medium">{product.price} zł</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.status === 'Aktywny' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.status}
                    </span>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Zarządzaj produktami
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
