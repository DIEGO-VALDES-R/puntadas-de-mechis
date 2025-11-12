import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { LogOut, Plus, Users, ShoppingBag, Gift } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function CustomerDashboard() {
  const [, setLocation] = useLocation();
  const [customerEmail, setCustomerEmail] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<any>(null);

  const requestsQuery = trpc.request.getByCustomerId.useQuery(
    { customerId: currentCustomer?.id },
    { enabled: !!currentCustomer }
  );

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerEmail) {
      toast.error("Por favor ingresa tu correo");
      return;
    }

    setIsSearching(true);

    try {
      // Usar useQuery con enabled: false no es la mejor opción aquí
      // Mejor hacer una llamada directa
      const response = await fetch(`/api/trpc/customer.getByEmail?input=${encodeURIComponent(JSON.stringify({ email: customerEmail }))}`);
      const data = await response.json();
      const customer = data.result?.data;

      if (!customer) {
        toast.error("Cliente no encontrado. ¿Deseas registrarte?");
        return;
      }

      setCurrentCustomer(customer);
      toast.success(`¡Bienvenido ${customer.firstName}!`);
    } catch (error) {
      toast.error("Error al buscar cliente");
    } finally {
      setIsSearching(false);
    }
  };

  const handleLogout = () => {
    setCurrentCustomer(null);
    setCustomerEmail("");
  };

  const handleNewRequest = () => {
    setLocation("/request");
  };

  if (!currentCustomer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
        <div className="max-w-md mx-auto mt-20">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Mi Panel</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Ingresa tu correo para ver tu historial de compras
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Correo Electrónico
                  </label>
                  <Input
                    type="email"
                    placeholder="tu@correo.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    disabled={isSearching}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSearching}
                >
                  {isSearching ? "Buscando..." : "Continuar"}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm">
                <p className="font-medium mb-2">¿Nuevo cliente?</p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setLocation("/register")}
                >
                  Registrarse
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Hola, {currentCustomer.firstName}
            </h1>
            <p className="text-muted-foreground">{currentCustomer.email}</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Salir
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="requests" className="space-y-4">
          <TabsList>
            <TabsTrigger value="requests" className="gap-2">
              <ShoppingBag className="w-4 h-4" />
              Mis Solicitudes
            </TabsTrigger>
            <TabsTrigger value="referrals" className="gap-2">
              <Users className="w-4 h-4" />
              Mis Referidos
            </TabsTrigger>
            <TabsTrigger value="discounts" className="gap-2">
              <Gift className="w-4 h-4" />
              Descuentos
            </TabsTrigger>
          </TabsList>

          {/* Mis Solicitudes */}
          <TabsContent value="requests">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Historial de Solicitudes</CardTitle>
                <Button onClick={handleNewRequest} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Nueva Solicitud
                </Button>
              </CardHeader>
              <CardContent>
                {requestsQuery.isLoading ? (
                  <div className="text-center py-8">Cargando...</div>
                ) : requestsQuery.data?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No tienes solicitudes aún</p>
                    <Button
                      onClick={handleNewRequest}
                      variant="link"
                      className="mt-2"
                    >
                      Crear tu primera solicitud
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {requestsQuery.data?.map((request) => (
                      <div
                        key={request.id}
                        className="border rounded-lg p-4 hover:bg-accent transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">
                              Solicitud #{request.id}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {request.description.substring(0, 50)}...
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(request.createdAt).toLocaleDateString(
                                "es-CO"
                              )}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                              {request.status === "pending" && "Pendiente"}
                              {request.status === "deposit_paid" &&
                                "Abono Pagado"}
                              {request.status === "in_progress" &&
                                "En Progreso"}
                              {request.status === "completed" && "Completado"}
                              {request.status === "cancelled" && "Cancelado"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mis Referidos */}
          <TabsContent value="referrals">
            <Card>
              <CardHeader>
                <CardTitle>Mis Referidos</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Clientes que se registraron con tu código de referencia
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>Tu código de referencia: {currentCustomer.referralCode}</p>
                  <p className="text-sm mt-4">
                    Comparte este código para ganar descuentos
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Descuentos */}
          <TabsContent value="discounts">
            <Card>
              <CardHeader>
                <CardTitle>Mis Descuentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>No tienes descuentos activos en este momento</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
