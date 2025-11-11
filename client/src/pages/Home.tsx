import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Link } from "wouter";
import { Heart, Palette, Gift, MessageSquare } from "lucide-react";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8" />
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              {APP_TITLE}
            </h1>
          </div>
          <nav className="flex gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline">Panel de Control</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/register">
                  <Button variant="outline">Registrarse</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold mb-6 text-gray-900">
            Tus Amigurumis Personalizados
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Solicita amigurumis únicos y personalizados. Elige el empaque perfecto y realiza tu pago de forma segura.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            {isAuthenticated ? (
              <>
                <Link href="/request">
                  <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                    <Gift className="mr-2 h-5 w-5" />
                    Solicitar Amigurumi
                  </Button>
                </Link>
                <Link href="/my-requests">
                  <Button size="lg" variant="outline">
                    <Heart className="mr-2 h-5 w-5" />
                    Mis Solicitudes
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/register">
                  <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                    <Gift className="mr-2 h-5 w-5" />
                    Comenzar Ahora
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">¿Cómo Funciona?</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center">
                  <Palette className="h-6 w-6 text-pink-600" />
                </div>
                <CardTitle>1. Regístrate</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-gray-600">
                Crea tu cuenta con tu nombre, correo y teléfono
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Gift className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>2. Solicita</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-gray-600">
                Describe tu amigurumi y sube una foto de referencia
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-pink-600" />
                </div>
                <CardTitle>3. Paga</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-gray-600">
                Realiza un abono seguro a través de Bold
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>4. Comunica</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-gray-600">
                Mantente en contacto con nosotros durante el proceso
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Packaging Options */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Opciones de Empaque</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { name: "Caja de Madera", desc: "Elegante y resistente" },
              { name: "Bolsa de Papel", desc: "Eco-amigable y económica" },
              { name: "Caja Cofre", desc: "Lujosa y exclusiva" },
              { name: "Cúpula de Vidrio", desc: "Moderna y sofisticada" },
            ].map((pkg) => (
              <Card key={pkg.name} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{pkg.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{pkg.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-pink-500 to-purple-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">¿Listo para tu Amigurumi?</h3>
          <p className="text-lg mb-8 opacity-90">
            Únete a cientos de clientes satisfechos que ya han recibido sus amigurumis personalizados
          </p>
          {!isAuthenticated && (
            <Link href="/register">
              <Button size="lg" variant="secondary" className="text-pink-600">
                Registrarse Ahora
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 {APP_TITLE}. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
