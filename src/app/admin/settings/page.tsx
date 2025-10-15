"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Save, 
  Settings, 
  Mail, 
  Shield, 
  Globe, 
  Bell,
  Palette
} from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "CRISTAL DESIGN",
    siteDescription: "Nowoczesne aranżacje z płytami wielkoformatowymi",
    siteUrl: "https://cristaldesign.pl",
    
    // Contact Settings
    email: "kontakt@cristaldesign.pl",
    phone: "+48 123 456 789",
    address: "ul. Przykładowa 123, 00-000 Warszawa",
    
    // Business Settings
    currency: "PLN",
    taxRate: 23,
    shippingCost: 50,
    freeShippingThreshold: 500,
    
    // Notification Settings
    emailNotifications: true,
    orderNotifications: true,
    userNotifications: true,
    
    // Security Settings
    requireEmailVerification: true,
    allowRegistration: true,
    sessionTimeout: 30,
    
    // Appearance Settings
    primaryColor: "#3B82F6",
    secondaryColor: "#8B5CF6",
    logoUrl: "",
  });

  const handleSave = () => {
    // Here you would typically save to your backend
    console.log("Saving settings:", settings);
    // Show success message
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ustawienia</h1>
          <p className="text-gray-600">Zarządzaj ustawieniami platformy</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Zapisz zmiany
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Ustawienia ogólne</span>
            </CardTitle>
            <CardDescription>
              Podstawowe informacje o stronie
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteName">Nazwa strony</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({...settings, siteName: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="siteDescription">Opis strony</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="siteUrl">URL strony</Label>
              <Input
                id="siteUrl"
                value={settings.siteUrl}
                onChange={(e) => setSettings({...settings, siteUrl: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>Dane kontaktowe</span>
            </CardTitle>
            <CardDescription>
              Informacje kontaktowe wyświetlane na stronie
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({...settings, email: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                value={settings.phone}
                onChange={(e) => setSettings({...settings, phone: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="address">Adres</Label>
              <Textarea
                id="address"
                value={settings.address}
                onChange={(e) => setSettings({...settings, address: e.target.value})}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Business Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Ustawienia biznesowe</span>
            </CardTitle>
            <CardDescription>
              Konfiguracja sprzedaży i płatności
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currency">Waluta</Label>
                <Input
                  id="currency"
                  value={settings.currency}
                  onChange={(e) => setSettings({...settings, currency: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="taxRate">Stawka VAT (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  value={settings.taxRate}
                  onChange={(e) => setSettings({...settings, taxRate: Number(e.target.value)})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="shippingCost">Koszt dostawy (zł)</Label>
                <Input
                  id="shippingCost"
                  type="number"
                  value={settings.shippingCost}
                  onChange={(e) => setSettings({...settings, shippingCost: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="freeShippingThreshold">Darmowa dostawa od (zł)</Label>
                <Input
                  id="freeShippingThreshold"
                  type="number"
                  value={settings.freeShippingThreshold}
                  onChange={(e) => setSettings({...settings, freeShippingThreshold: Number(e.target.value)})}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Powiadomienia</span>
            </CardTitle>
            <CardDescription>
              Ustawienia powiadomień email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications">Powiadomienia email</Label>
                <p className="text-sm text-gray-500">Wysyłaj powiadomienia email</p>
              </div>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="orderNotifications">Powiadomienia o zamówieniach</Label>
                <p className="text-sm text-gray-500">Powiadamiaj o nowych zamówieniach</p>
              </div>
              <Switch
                id="orderNotifications"
                checked={settings.orderNotifications}
                onCheckedChange={(checked) => setSettings({...settings, orderNotifications: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="userNotifications">Powiadomienia o użytkownikach</Label>
                <p className="text-sm text-gray-500">Powiadamiaj o nowych użytkownikach</p>
              </div>
              <Switch
                id="userNotifications"
                checked={settings.userNotifications}
                onCheckedChange={(checked) => setSettings({...settings, userNotifications: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Bezpieczeństwo</span>
            </CardTitle>
            <CardDescription>
              Ustawienia bezpieczeństwa platformy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="requireEmailVerification">Wymagaj weryfikacji email</Label>
                <p className="text-sm text-gray-500">Użytkownicy muszą zweryfikować email</p>
              </div>
              <Switch
                id="requireEmailVerification"
                checked={settings.requireEmailVerification}
                onCheckedChange={(checked) => setSettings({...settings, requireEmailVerification: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="allowRegistration">Zezwól na rejestrację</Label>
                <p className="text-sm text-gray-500">Pozwól nowym użytkownikom się rejestrować</p>
              </div>
              <Switch
                id="allowRegistration"
                checked={settings.allowRegistration}
                onCheckedChange={(checked) => setSettings({...settings, allowRegistration: checked})}
              />
            </div>
            <div>
              <Label htmlFor="sessionTimeout">Timeout sesji (minuty)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({...settings, sessionTimeout: Number(e.target.value)})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="h-5 w-5" />
              <span>Wygląd</span>
            </CardTitle>
            <CardDescription>
              Personalizacja wyglądu strony
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primaryColor">Kolor główny</Label>
                <Input
                  id="primaryColor"
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="secondaryColor">Kolor dodatkowy</Label>
                <Input
                  id="secondaryColor"
                  type="color"
                  value={settings.secondaryColor}
                  onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="logoUrl">URL logo</Label>
              <Input
                id="logoUrl"
                value={settings.logoUrl}
                onChange={(e) => setSettings({...settings, logoUrl: e.target.value})}
                placeholder="https://example.com/logo.png"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
