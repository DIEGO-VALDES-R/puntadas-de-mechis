import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Heart, Gift, CreditCard, MessageSquare, Star } from "lucide-react";

const gallery = [
  {
    id: 1,
    image: "/gallery/1002490155.jpg",
    title: "Colección Familiar",
    description: "Amigurumis personalizados para toda la familia",
  },
  {
    id: 2,
    image: "/gallery/1002474906.png",
    title: "Virgen María",
    description: "Amigurumi religioso con detalles dorados",
  },
  {
    id: 3,
    image: "/gallery/1002490163.jpg",
    title: "Virgen con Cúpula",
    description: "Presentación en cúpula de vidrio",
  },
  {
    id: 4,
    image: "/gallery/1002481107.jpg",
    title: "Virgen Azul",
    description: "Amigurumi con detalles en plata",
  },
  {
    id: 5,
    image: "/gallery/1002474791.png",
    title: "Virgen Dorada",
    description: "Con iluminación LED incorporada",
  },
  {
    id: 6,
    image: "/gallery/1002075872.png",
    title: "Conejo Floral",
    description: "Amigurumi con flores y detalles delicados",
  },
  {
    id: 7,
    image: "/gallery/1002478191.jpg",
    title: "Caja de Presentación",
    description: "Empaque profesional con logo",
  },
  {
    id: 8,
    image: "/gallery/1002384650.jpg",
    title: "Gato Personalizado",
    description: "Amigurumi de gato con empaque especial",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">PUNTADAS DE MECHIS</h1>
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
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Tus Amigurumis Personalizados
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Solicita amigurumis únicos y personalizados. Elige el empaque perfecto y realiza tu pago de forma segura.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-6 text-lg">
              <Gift className="mr-2 h-5 w-5" />
              Solicitar Amigurumi
            </Button>
          </Link>
          <Link href="/my-requests">
            <Button variant="outline" className="px-8 py-6 text-lg">
              <Heart className="mr-2 h-5 w-5" />
              Mis Solicitudes
            </Button>
          </Link>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          Nuestras Creaciones
        </h3>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Mira algunos de nuestros trabajos anteriores. Cada amigurumi es único y personalizado según tus deseos.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {gallery.map((item) => (
            <Card key={item.id} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative h-64 overflow-hidden bg-gray-200">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4">
                <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          ¿Cómo Funciona?
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <Heart className="w-8 h-8" />,
              title: "1. Regístrate",
              description: "Crea tu cuenta con tu nombre, correo y teléfono",
            },
            {
              icon: <Gift className="w-8 h-8" />,
              title: "2. Solicita",
              description: "Describe tu amigurumi y sube una foto de referencia",
            },
            {
              icon: <CreditCard className="w-8 h-8" />,
              title: "3. Paga",
              description: "Realiza un abono seguro a través de Bold",
            },
            {
              icon: <MessageSquare className="w-8 h-8" />,
              title: "4. Comunica",
              description: "Mantente en contacto con nosotros durante el proceso",
            },
          ].map((step, index) => (
            <Card key={index} className="border-0 shadow-lg text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4 text-pink-500">
                  {step.icon}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
                <p className="text-sm text-gray-600">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Package Options Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Opciones de Empaque
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Caja de Madera",
              description: "Elegante y resistente",
              icon: "📦",
            },
            {
              title: "Bolsa de Papel",
              description: "Eco-amigable y económica",
              icon: "🛍️",
            },
            {
              title: "Caja Cofre",
              description: "Lujosa y exclusiva",
              icon: "💎",
            },
            {
              title: "Cúpula de Vidrio",
              description: "Moderna y sofisticada",
              icon: "🔮",
            },
          ].map((pkg, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6 text-center">
                <div className="text-4xl mb-4">{pkg.icon}</div>
                <h4 className="font-semibold text-gray-900 mb-2">{pkg.title}</h4>
                <p className="text-sm text-gray-600">{pkg.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-pink-500 to-purple-600 py-16 my-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">¿Listo para tu Amigurumi?</h3>
          <p className="text-lg mb-8 opacity-90">
            Únete a cientos de clientes satisfechos que ya han recibido sus amigurumis personalizados
          </p>
          <Link href="/register">
            <Button className="bg-white text-pink-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold">
              Comenzar Ahora
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Lo que Dicen Nuestros Clientes
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "María García",
              text: "¡Hermoso! Exactamente como lo imaginaba. Muy recomendado.",
              rating: 5,
            },
            {
              name: "Juan Rodríguez",
              text: "La calidad es excelente y el empaque muy profesional.",
              rating: 5,
            },
            {
              name: "Ana López",
              text: "Perfecto regalo. Mi familia lo amó. Volveré a ordenar.",
              rating: 5,
            },
          ].map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                <p className="font-semibold text-gray-900">— {testimonial.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">PUNTADAS DE MECHIS</h4>
              <p className="text-gray-400">Hilos que conectan corazones</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <p className="text-gray-400">Email: diegoferrangel@gmail.com</p>
              <p className="text-gray-400">Teléfono: +57 312 591 2152</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Síguenos</h4>
              <p className="text-gray-400">@puntadasdemechis</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2024 PUNTADAS DE MECHIS. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
