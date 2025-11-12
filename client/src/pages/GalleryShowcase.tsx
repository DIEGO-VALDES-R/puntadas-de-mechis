import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { WHATSAPP_NUMBERS, getWhatsAppLinkWithCountryCode } from "@shared/whatsapp";
import { useLocation } from "wouter";

export default function GalleryShowcase() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const galleryQuery = trpc.gallery.getAll.useQuery();
  const categoriesQuery = trpc.gallery.getCategories.useQuery();
  const highlightedQuery = trpc.gallery.getHighlighted.useQuery();
  const promotionsQuery = trpc.gallery.getActivePromotions.useQuery();

  // Filter items by selected category
  const filteredItems = useMemo(() => {
    if (!selectedCategory || !galleryQuery.data) return galleryQuery.data || [];
    return galleryQuery.data.filter((item) => item.category === selectedCategory);
  }, [galleryQuery.data, selectedCategory]);

  // Calculate discounted price
  const getPriceWithDiscount = (price: number | null, itemId: number) => {
    if (!price) return null;
    const promotion = promotionsQuery.data?.find(
      (p: any) => !p.galleryItemId || p.galleryItemId === itemId
    );
    if (!promotion) return price;
    return Math.round(price * (1 - promotion.discountPercentage / 100));
  };

  const handleRequestAmigurumi = (itemId: number) => {
    setLocation(`/request?itemId=${itemId}`);
  };

  const whatsappLink = getWhatsAppLinkWithCountryCode(
    WHATSAPP_NUMBERS[0].number,
    "57",
    "Hola, me interesa conocer más sobre los amigurumis"
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Highlighted Items Section */}
      {highlightedQuery.data && highlightedQuery.data.length > 0 && (
        <section className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Nuestros Favoritos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {highlightedQuery.data.map((item: any) => (
                <div key={item.id} className="bg-white text-black rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {item.description?.substring(0, 50)}...
                    </p>
                    {item.price && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-500">Precio</p>
                        <p className="text-2xl font-bold text-pink-500">
                          ${(item.price / 100).toLocaleString("es-CO")}
                        </p>
                      </div>
                    )}
                    <Button
                      onClick={() => handleRequestAmigurumi(item.id)}
                      className="w-full gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Solicitar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Gallery Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Nuestra Galería</h2>

        {/* Categories Tabs */}
        {categoriesQuery.data && categoriesQuery.data.length > 0 && (
          <Tabs
            defaultValue={categoriesQuery.data[0]?.name || ""}
            className="mb-8"
          >
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
              <TabsTrigger value="">Todos</TabsTrigger>
              {categoriesQuery.data.map((category: any) => (
                <TabsTrigger key={category.id} value={category.name}>
                  {category.icon && <span className="mr-2">{category.icon}</span>}
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* All Items Tab */}
            <TabsContent value="">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryQuery.data?.map((item: any) => {
                  const discountedPrice = getPriceWithDiscount(item.price, item.id);
                  const hasDiscount = discountedPrice !== item.price;

                  return (
                    <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-64 object-cover"
                        />
                        {hasDiscount && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            -
                            {promotionsQuery.data?.find(
                              (p: any) => !p.galleryItemId || p.galleryItemId === item.id
                            )?.discountPercentage}
                            %
                          </div>
                        )}
                      </div>
                      <CardContent className="pt-4">
                        <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {item.description?.substring(0, 100)}...
                        </p>
                        {item.price && (
                          <div className="mb-4">
                            {hasDiscount && (
                              <p className="text-sm text-gray-500 line-through">
                                ${(item.price / 100).toLocaleString("es-CO")}
                              </p>
                            )}
                            <p className="text-2xl font-bold text-pink-500">
                              ${(discountedPrice! / 100).toLocaleString("es-CO")}
                            </p>
                          </div>
                        )}
                        <Button
                          onClick={() => handleRequestAmigurumi(item.id)}
                          className="w-full gap-2"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Solicitar
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Category Tabs */}
            {categoriesQuery.data.map((category: any) => (
              <TabsContent key={category.id} value={category.name}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {galleryQuery.data
                    ?.filter((item: any) => item.category === category.name)
                    .map((item: any) => {
                      const discountedPrice = getPriceWithDiscount(item.price, item.id);
                      const hasDiscount = discountedPrice !== item.price;

                      return (
                        <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="relative">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-64 object-cover"
                            />
                            {hasDiscount && (
                              <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                -
                                {promotionsQuery.data?.find(
                                  (p: any) => !p.galleryItemId || p.galleryItemId === item.id
                                )?.discountPercentage}
                                %
                              </div>
                            )}
                          </div>
                          <CardContent className="pt-4">
                            <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              {item.description?.substring(0, 100)}...
                            </p>
                            {item.price && (
                              <div className="mb-4">
                                {hasDiscount && (
                                  <p className="text-sm text-gray-500 line-through">
                                    ${(item.price / 100).toLocaleString("es-CO")}
                                  </p>
                                )}
                                <p className="text-2xl font-bold text-pink-500">
                                  ${(discountedPrice! / 100).toLocaleString("es-CO")}
                                </p>
                              </div>
                            )}
                            <Button
                              onClick={() => handleRequestAmigurumi(item.id)}
                              className="w-full gap-2"
                            >
                              <ShoppingBag className="w-4 h-4" />
                              Solicitar
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </section>

      {/* WhatsApp Contact Section */}
      <section className="bg-gradient-to-r from-green-50 to-blue-50 py-12 border-t">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Tienes Preguntas?</h2>
          <p className="text-gray-600 mb-8">
            Contáctanos por WhatsApp para más información
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {WHATSAPP_NUMBERS.map((contact: any) => (
              <a
                key={contact.number}
                href={getWhatsAppLinkWithCountryCode(contact.number, "57")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                {contact.number}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
