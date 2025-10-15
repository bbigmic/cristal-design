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
  Trash2, 
  MoreHorizontal,
  User,
  Mail,
  Calendar,
  Shield,
  UserPlus
} from "lucide-react";

const users = [
  {
    id: "1",
    name: "Jan Kowalski",
    email: "jan.kowalski@example.com",
    role: "USER",
    status: "Aktywny",
    ordersCount: 3,
    totalSpent: 1650,
    lastLogin: "2024-01-15T14:30:00Z",
    createdAt: "2024-01-01T10:00:00Z",
  },
  {
    id: "2",
    name: "Anna Nowak",
    email: "anna.nowak@example.com",
    role: "USER",
    status: "Aktywny",
    ordersCount: 1,
    totalSpent: 520,
    lastLogin: "2024-01-14T09:15:00Z",
    createdAt: "2024-01-05T15:20:00Z",
  },
  {
    id: "3",
    name: "Piotr Wiśniewski",
    email: "piotr.wisniewski@example.com",
    role: "USER",
    status: "Nieaktywny",
    ordersCount: 0,
    totalSpent: 0,
    lastLogin: "2024-01-10T16:45:00Z",
    createdAt: "2024-01-08T12:30:00Z",
  },
  {
    id: "4",
    name: "Maria Kowalczyk",
    email: "maria.kowalczyk@example.com",
    role: "ADMIN",
    status: "Aktywny",
    ordersCount: 0,
    totalSpent: 0,
    lastLogin: "2024-01-15T16:20:00Z",
    createdAt: "2023-12-15T08:00:00Z",
  },
  {
    id: "5",
    name: "Tomasz Lewandowski",
    email: "tomasz.lewandowski@example.com",
    role: "USER",
    status: "Aktywny",
    ordersCount: 2,
    totalSpent: 890,
    lastLogin: "2024-01-13T11:20:00Z",
    createdAt: "2024-01-12T14:15:00Z",
  },
];

const roleOptions = [
  { value: "Wszystkie", label: "Wszystkie" },
  { value: "USER", label: "Użytkownik" },
  { value: "ADMIN", label: "Administrator" },
];

const statusOptions = [
  { value: "Wszystkie", label: "Wszystkie" },
  { value: "Aktywny", label: "Aktywny" },
  { value: "Nieaktywny", label: "Nieaktywny" },
];

const getRoleColor = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "bg-purple-100 text-purple-800";
    case "USER":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Aktywny":
      return "bg-green-100 text-green-800";
    case "Nieaktywny":
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

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("Wszystkie");
  const [selectedStatus, setSelectedStatus] = useState("Wszystkie");

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "Wszystkie" || user.role === selectedRole;
    const matchesStatus = selectedStatus === "Wszystkie" || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Użytkownicy</h1>
          <p className="text-gray-600">Zarządzaj użytkownikami platformy</p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Dodaj użytkownika
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Szukaj użytkowników..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {roleOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={selectedRole === option.value ? "default" : "outline"}
                  onClick={() => setSelectedRole(option.value)}
                  size="sm"
                >
                  {option.label}
                </Button>
              ))}
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

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role === "ADMIN" ? "Administrator" : "Użytkownik"}
                      </Badge>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Dołączył: {formatDate(user.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4" />
                        <span>Zamówienia: {user.ordersCount}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Wydał: {user.totalSpent} zł</span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Ostatnie logowanie: {formatDate(user.lastLogin)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="h-4 w-4" />
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
      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Brak użytkowników</h3>
            <p className="text-gray-500 text-center">
              {searchTerm || selectedRole !== "Wszystkie" || selectedStatus !== "Wszystkie"
                ? "Nie znaleziono użytkowników spełniających kryteria wyszukiwania."
                : "Nie masz jeszcze żadnych użytkowników."
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
