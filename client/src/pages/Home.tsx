import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Heart, Gift, CreditCard, MessageSquare, Star, ShoppingCart } from "lucide-react";
import GalleryModal from "@/components/GalleryModal";
import WhatsAppButton from "@/components/WhatsAppButton";

const gallery = [
  {
    id: 1,
    image: "/gallery/1002478157.jpg",
    title: "Virgen de Fátima",
    description: "Amigurumi religioso con detalles dorados",
    details: "• Luz LED incorporada\n• Denarios en rodio y acero\n• Corona metálica tejida\n• Altura: 20cm aprox",
  },
  {
    id: 2,
    image: "/gallery/1002481107.jpg",
    title: "Virgen de Fátima en Cúpula",
    description: "Presentación en cúpula de vidrio con base de madera",
    details: "• Luz LED incorporada\n• Denarios en rodio y acero\n• Corona metálica\n• Cúpula de vidrio incluida",
  },
  {
    id: 3,
    image: "/gallery/1002474791.png",
    title: "Virgen de Guadalupe",
    description: "Amigurumi con detalles en plata",
    details: "• Luz LED incorporada\n• Denarios en acero\n• Corona tejida\n• Altura: 22cm aprox",
  },
  {
    id: 4,
    image: "/gallery/1002490163.jpg",
    title: "Virgen de Guadalupe en Cúpula",
    description: "Con iluminación LED incorporada",
    details: "• Luz LED incorporada\n• Denarios en rodio y acero\n• Corona metálica tejida\n• Cúpula de vidrio con base",
  },
  {
    id: 5,
    image: "/gallery/1002474906.png",
    title: "Virgen María Personalizada",
    description: "Amigurumi religioso con detalles dorados",
    details: "• Luz LED incorporada\n• Denarios en rodio\n• Corona metálica\n• Personalizable en colores",
  },
  {
    id: 6,
    image: "/gallery/1002075872.png",
    title: "Conejo Floral",
    description: "Amigurumi con flores y detalles delicados",
    details: "• Flores tejidas\n• Detalles en hilo de colores\n• Altura: 18cm aprox\n• Personalizable",
  },
  {
    id: 7,
    image: "/gallery/1002478191.jpg",
    title: "Caja de Presentación",
    description: "Empaque profesional con logo PUNTADAS DE MECHIS",
    details: "• Caja de cartón kraft\n• Papel de regalo incluido\n• Logo personalizado\n• Tarjeta de agradecimiento",
  },
  {
    id: 8,
    image: "/gallery/1002384650.jpg",
    title: "Gato Personalizado",
    description: "Amigurumi de gato con empaque especial",
    details: "• Detalles tejidos\n• Ojos de seguridad\n• Altura: 15cm aprox\n• Empaque profesional",
  },
];

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<typeof gallery[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = (image: typeof gallery[0]) => {
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
      <section className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Tus Amigurumis Personalizados
        </h2>
        <p className="text-base text-gray-600 mb-6 max-w-2xl mx-auto">
          Solicita amigurumis únicos y personalizados. Elige el empaque perfecto y realiza tu pago de forma segura.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/register">
            <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-5">
              <Gift className="mr-2 h-4 w-4" />
              Solicitar Amigurumi
            </Button>
          </Link>
          <Link href="/my-requests">
            <Button variant="outline" className="px-6 py-5">
              <Heart className="mr-2 h-4 w-4" />
              Mis Solicitudes
            </Button>
          </Link>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Algunas de Nuestras Creaciones
        </h3>
        <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto text-sm">
          Mira algunos de nuestros trabajos anteriores. Toca cualquier imagen para ver más detalles.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {gallery.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleImageClick(item)}
            >
              <div className="relative h-40 md:h-48 bg-gray-200 overflow-hidden group">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    console.error(`Error loading image: ${item.image}`);
                    (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%23999' font-size='14'%3ENo image%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <CardContent className="p-3">
                <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          ¿Cómo Funciona?
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            {
              icon: <Heart className="w-6 h-6" />,
              title: "Regístrate",
              description: "Crea tu cuenta",
            },
            {
              icon: <Gift className="w-6 h-6" />,
              title: "Solicita",
              description: "Describe tu amigurumi",
            },
            {
              icon: <CreditCard className="w-6 h-6" />,
              title: "Paga",
              description: "Realiza tu abono",
            },
            {
              icon: <MessageSquare className="w-6 h-6" />,
              title: "Comunica",
              description: "Mantente en contacto",
            },
          ].map((step, index) => (
            <Card key={index} className="border-0 shadow-md text-center">
              <CardContent className="pt-4 pb-3">
                <div className="flex justify-center mb-2 text-pink-500">
                  {step.icon}
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">{step.title}</h4>
                <p className="text-xs text-gray-600">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Package Options Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Opciones de Empaque
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { title: "Caja de Madera", icon: "📦" },
            { title: "Bolsa de Papel", icon: "🛍️" },
            { title: "Caja Cofre", icon: "💎" },
            { title: "Cúpula de Vidrio", icon: "🔮" },
          ].map((pkg, index) => (
            <Card key={index} className="border-0 shadow-md">
              <CardContent className="pt-4 pb-3 text-center">
                <div className="text-3xl mb-2">{pkg.icon}</div>
                <h4 className="font-semibold text-gray-900 text-sm">{pkg.title}</h4>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-pink-500 to-purple-600 py-10 my-12 mx-4 rounded-lg">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">¿Listo para tu Amigurumi?</h3>
          <p className="text-sm mb-6 opacity-90">
            Únete a cientos de clientes satisfechos
          </p>
          <Link href="/register">
            <Button className="bg-white text-pink-600 hover:bg-gray-100 px-6 py-5 font-semibold">
              Comenzar Ahora
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Lo que Dicen Nuestros Clientes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "María García", text: "¡Hermoso! Exactamente como lo imaginaba." },
            { name: "Juan Rodríguez", text: "La calidad es excelente y el empaque muy profesional." },
            { name: "Ana López", text: "Perfecto regalo. Mi familia lo amó." },
          ].map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-md">
              <CardContent className="pt-4">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-3">"{testimonial.text}"</p>
                <p className="font-semibold text-gray-900 text-sm">— {testimonial.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <h4 className="font-semibold mb-2 text-sm">PUNTADAS DE MECHIS</h4>
              <p className="text-gray-400 text-xs">Hilos que conectan corazones</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-sm">Contacto</h4>
              <p className="text-gray-400 text-xs">Email: diegoferrangel@gmail.com</p>
              <p className="text-gray-400 text-xs">Teléfono: +57 312 591 2152</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-sm">Síguenos</h4>
              <p className="text-gray-400 text-xs">@puntadasdemechis</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-gray-400 text-xs">
            <p>© 2024 PUNTADAS DE MECHIS. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Gallery Modal */}
      <GalleryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} image={selectedImage} />

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
}
