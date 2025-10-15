"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const heroImages = [
  {
    src: "https://res.cloudinary.com/dd0dqviwc/image/upload/v1760525489/photo-horizontal2_kujyho.jpg",
    alt: "Nowoczesne płyty dekoracyjne w kuchni"
  },
  {
    src: "https://res.cloudinary.com/dd0dqviwc/image/upload/v1760525489/photo-square_ck459b.jpg",
    alt: "Eleganckie płyty dekoracyjne w salonie"
  },
  {
    src: "https://res.cloudinary.com/dd0dqviwc/image/upload/v1760525488/photo-horizontal1_c5jg3k.jpg",
    alt: "Nowoczesne aranżacje z płytami wielkoformatowymi"
  }
];

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);



  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentImageIndex) return;
    setIsTransitioning(true);
    setCurrentImageIndex(index);
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex
                ? 'opacity-100'
                : 'opacity-0'
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className={`object-cover transition-transform linear ${
                index === currentImageIndex ? 'ken-burns-active' : 'ken-burns-inactive'
              }`}
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            CRISTAL
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              DESIGN
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Nowoczesne aranżacje z płytami wielkoformatowymi, które idealnie sprawdzą się w wielu wnętrzach
          </p>
        </div>

        {/* Features */}
        <div className="hidden md:grid grid-cols-3 gap-6 mb-12">
          <div className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <Shield className="h-6 w-6 text-blue-400" />
            <span className="text-sm font-medium">Wodoodporne</span>
          </div>
          <div className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <Zap className="h-6 w-6 text-yellow-400" />
            <span className="text-sm font-medium">Ognioodporne</span>
          </div>
          <div className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <Sparkles className="h-6 w-6 text-purple-400" />
            <span className="text-sm font-medium">Łatwe w obróbce</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
              Zobacz Produkty
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white text-black hover:bg-white hover:text-gray-900 px-8 py-4 text-lg"
            onClick={scrollToContact}
          >
            Skontaktuj się z nami
          </Button>
        </div>
      </div>

      {/* Carousel Controls 
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 hidden md:block">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPrevious}
          disabled={isTransitioning}
          className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 transition-all duration-300"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>

      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 hidden md:block">
        <Button
          variant="outline"
          size="icon"
          onClick={goToNext}
          disabled={isTransitioning}
          className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 transition-all duration-300"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>*/}

      {/* Carousel Indicators */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isTransitioning}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentImageIndex
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Przejdź do slajdu ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
