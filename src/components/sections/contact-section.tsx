"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <div>
            <h2 className="text-4xl font-bold mb-6">
              Skontaktuj się z nami
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Masz pytania? Chcesz zamówić płyty pod wymiar? 
              Jesteśmy tutaj, aby pomóc Ci stworzyć wymarzone wnętrze.
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Telefon</h3>
                  <p className="text-gray-300">+48 123 456 789</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Email</h3>
                  <p className="text-gray-300">kontakt@cristaldesign.pl</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Adres</h3>
                  <p className="text-gray-300">ul. Przykładowa 123<br />00-000 Warszawa</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Godziny pracy</h3>
                  <p className="text-gray-300">Pon-Pt: 8:00-18:00<br />Sob: 9:00-15:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Wyślij wiadomość</CardTitle>
              <CardDescription className="text-gray-300">
                Wypełnij formularz, a skontaktujemy się z Tobą w ciągu 24 godzin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2 text-white">
                      Imię i nazwisko
                    </label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Jan Kowalski"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2 text-white">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="jan@example.com"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2 text-white">
                    Telefon
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+48 123 456 789"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2 text-white">
                    Temat
                  </label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="Zapytanie o płyty dekoracyjne"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2 text-white">
                    Wiadomość
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Opisz swoje potrzeby..."
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 min-h-[120px]"
                  />
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Wyślij wiadomość
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
