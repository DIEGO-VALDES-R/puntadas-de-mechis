import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Heart, MessageCircle, Download } from "lucide-react";
import { toast } from "sonner";

export default function CommunityHub() {
  const [activeTab, setActiveTab] = useState("patterns");

  const patterns = [
    { id: 1, title: "Patrón Virgen María", price: 15000, downloads: 234, rating: 4.8 },
    { id: 2, title: "Patrón Sirena Clásica", price: 12000, downloads: 156, rating: 4.9 },
    { id: 3, title: "Patrón Animales Selva", price: 18000, downloads: 89, rating: 4.7 },
  ];

  const classes = [
    { id: 1, title: "Tejido Básico para Principiantes", instructor: "Sandra", price: 25000, students: 45, duration: "4 semanas" },
    { id: 2, title: "Técnicas Avanzadas de Tejido", instructor: "Aida", price: 35000, students: 28, duration: "6 semanas" },
    { id: 3, title: "Diseño de Patrones Personalizados", instructor: "Diego", price: 40000, students: 15, duration: "8 semanas" },
  ];

  const challenges = [
    { id: 1, title: "Reto Virgen Navideña", endDate: "2024-12-25", participants: 156, prize: "COP 500,000" },
    { id: 2, title: "Reto Amigurumi Miniatura", endDate: "2024-12-31", participants: 89, prize: "COP 300,000" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Comunidad de Tejedoras</h1>
        <p className="text-gray-600 mb-8">Aprende, comparte y crece con nuestra comunidad</p>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="patterns">Patrones</TabsTrigger>
            <TabsTrigger value="classes">Clases</TabsTrigger>
            <TabsTrigger value="challenges">Retos</TabsTrigger>
          </TabsList>

          {/* Patrones Tab */}
          <TabsContent value="patterns" className="mt-6">
            <div className="mb-6">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Subir Patrón
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {patterns.map((pattern) => (
                <Card key={pattern.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{pattern.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gray-100 h-40 rounded-lg flex items-center justify-center text-gray-400">
                      Imagen del Patrón
                    </div>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-pink-600">COP ${(pattern.price / 100).toLocaleString("es-CO")}</p>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>⭐ {pattern.rating}</span>
                        <span>📥 {pattern.downloads} descargas</span>
                      </div>
                    </div>
                    <Button className="w-full gap-2">
                      <Download className="w-4 h-4" />
                      Comprar Patrón
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Clases Tab */}
          <TabsContent value="classes" className="mt-6">
            <div className="mb-6">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Crear Clase
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {classes.map((cls) => (
                <Card key={cls.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{cls.title}</CardTitle>
                    <p className="text-sm text-gray-600">Instructor: {cls.instructor}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gradient-to-r from-pink-200 to-purple-200 h-40 rounded-lg flex items-center justify-center text-gray-600">
                      Contenido de la Clase
                    </div>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-pink-600">COP ${(cls.price / 100).toLocaleString("es-CO")}</p>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>👥 {cls.students} estudiantes</span>
                        <span>⏱️ {cls.duration}</span>
                      </div>
                    </div>
                    <Button className="w-full gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Inscribirse
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Retos Tab */}
          <TabsContent value="challenges" className="mt-6">
            <div className="mb-6">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Crear Reto
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {challenges.map((challenge) => (
                <Card key={challenge.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{challenge.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-yellow-50 border-2 border-yellow-200 p-4 rounded-lg">
                      <p className="text-sm text-yellow-800">🏆 Premio: {challenge.prize}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Finaliza: {challenge.endDate}</p>
                      <p className="text-sm text-gray-600">👥 {challenge.participants} participantes</p>
                    </div>
                    <Button className="w-full gap-2">
                      <Heart className="w-4 h-4" />
                      Participar en Reto
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
