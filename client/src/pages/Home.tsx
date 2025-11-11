'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Heart, Gift, CreditCard, MessageSquare, Star, ShoppingCart, Loader2 } from "lucide-react";
import GalleryModal from "@/components/GalleryModal";
import WhatsAppButton from "@/components/WhatsAppButton";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cargar productos desde la base de datos
  const { data: galleryItems = [], isLoading } = trpc.gallery.getAll.useQuery();

  const handleImageClick = (image: any) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="PUNTADAS DE MECHIS"
              className="h-12 w-auto rounded-lg"
              loading="lazy"
            />
            <div>
              <h1 className="text-lg font-bold text-gray-900">PUNTADAS DE MECHIS</h1>
              <p className="text-xs text-gray-600">Hilos que conectan corazones</p>
            </div>
          </div>
          <Link href="/admin">
            <Button variant="outline" size="sm">
              Panel de Control
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Tus Amigurumis Personalizados</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Solicita amigurumis únicos y personalizados. Elige el empaque perfecto y realiza tu pago de forma segura.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/request">
            <Button className="bg-pink-500 hover:bg-pink-600 text-white">
              <Gift className="w-4 h-4 mr-2" />
              Solicitar Amigurumi
            </Button>
          </Link>
          <Link href="/my-requests">
            <Button variant="outline">
              <Heart className="w-4 h-4 mr-2" />
              Mis Solicitudes
            </Button>
          </Link>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-2 text-gray-900">Algunas de Nuestras Creaciones</h3>
          <p className="text-center text-gray-600 mb-12">
            Mira algunos de nuestros trabajos anteriores. Toca cualquier imagen para ver más detalles.
          </p>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {galleryItems.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleImageClick(item)}
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">{item.title}</h4>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                    <Link href="/request">
                      <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white text-sm">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Solicitar
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">¿Cómo Funciona?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-pink-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Regístrate</h4>
              <p className="text-sm text-gray-600">Crea tu cuenta con tus datos básicos</p>
            </div>
            <div className="text-center">
              <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-pink-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Solicita</h4>
              <p className="text-sm text-gray-600">Describe tu amigurumi ideal</p>
            </div>
            <div className="text-center">
              <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-pink-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Paga</h4>
              <p className="text-sm text-gray-600">Realiza tu abono de forma segura</p>
            </div>
            <div className="text-center">
              <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-pink-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Comunica</h4>
              <p className="text-sm text-gray-600">Mantente en contacto con nosotros</p>
            </div>
          </div>
        </div>
      </section>

      {/* Packaging Options */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">Opciones de Empaque</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">📦</div>
              <h4 className="font-bold text-gray-900">Caja de Madera</h4>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🛍️</div>
              <h4 className="font-bold text-gray-900">Bolsa de Papel</h4>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💎</div>
              <h4 className="font-bold text-gray-900">Caja Cofre</h4>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔮</div>
              <h4 className="font-bold text-gray-900">Cúpula de Vidrio</h4>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h3 className="text-3xl font-bold mb-4">¿Listo para tu Amigurumi?</h3>
          <p className="text-lg mb-8 opacity-90">Únete a cientos de clientes satisfechos</p>
          <Link href="/request">
            <Button className="bg-white text-pink-600 hover:bg-gray-100 font-bold">
              Comenzar Ahora
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">Lo que Dicen Nuestros Clientes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { text: "¡Hermoso! Exactamente como lo imaginaba.", author: "María García" },
              { text: "La calidad es excelente y el empaque muy profesional.", author: "Juan Rodríguez" },
              { text: "Perfecto regalo. Mi familia lo amó.", author: "Ana López" },
            ].map((testimonial, idx) => (
              <Card key={idx}>
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                  <p className="font-bold text-gray-900">— {testimonial.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">PUNTADAS DE MECHIS</h4>
              <p className="text-gray-400 text-sm">Hilos que conectan corazones</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contacto</h4>
              <p className="text-gray-400 text-sm">Email: diegoferrangel@gmail.com</p>
              <p className="text-gray-400 text-sm">Teléfono: +57 312 591 2152</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Síguenos</h4>
              <p className="text-gray-400 text-sm">@puntadasdemechis</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 PUNTADAS DE MECHIS. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {selectedImage && (
        <GalleryModal
          image={selectedImage}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedImage(null);
          }}
        />
      )}

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
}
