"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Scissors, Wrench, Truck, Shield } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const features = [
  {
    icon: Scissors,
    title: "Łatwa obróbka",
    description: "Można je przycinać tarczą diamentową",
    image: "https://res.cloudinary.com/dd0dqviwc/image/upload/v1760532963/image_1_h4zkec.png"
  },
  {
    icon: Wrench,
    title: "Docinamy pod wymiar",
    description: "Docinamy pod dowolny wymiar i indywidualne życzenie klienta",
    image: "https://res.cloudinary.com/dd0dqviwc/image/upload/v1760532963/image_2_ecr28d.png"
  },
  {
    icon: Truck,
    title: "Profesjonalny montaż",
    description: "Oferujemy również profesjonalny montaż",
    image: "https://res.cloudinary.com/dd0dqviwc/image/upload/v1760532963/image_4_sngpo3.png"
  }
];

const benefits = [
  "Wodoodporne",
  "Ognioodporne", 
  "Łatwe w obróbce",
  "Docinamy pod dowolny wymiar",
  "Profesjonalny montaż",
  "Elegancja i jakość"
];

export default function FeaturesSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Parallax Background */}
      <div 
        className="absolute inset-0 opacity-50"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
          backgroundImage: `url('https://res.cloudinary.com/dd0dqviwc/image/upload/v1760570163/image_5_nu6tsa.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          top: '-50%'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Dlaczego wybrać nasze płyty?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Postaw na elegancję, jakość i dopasowanie do Twojego wnętrza. 
            Nasze płyty wielkoformatowe to idealne rozwiązanie dla nowoczesnych aranżacji.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="group overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-4 left-4">
                  <div className="w-12 h-12 bg-white/90 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Kluczowe zalety naszych produktów
              </h3>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <Image
                src="https://res.cloudinary.com/dd0dqviwc/image/upload/v1760525489/photo-square_ck459b.jpg"
                alt="Płyty dekoracyjne w kuchni"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <Shield className="h-6 w-6" />
                  <span className="font-semibold">Gwarancja jakości</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
