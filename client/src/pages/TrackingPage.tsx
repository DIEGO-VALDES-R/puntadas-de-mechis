import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Package, Truck, Home } from "lucide-react";
import { toast } from "sonner";

const statusSteps = [
  { status: "created", label: "Creado", icon: Package },
  { status: "in_production", label: "En Producción", icon: Clock },
  { status: "ready", label: "Listo", icon: CheckCircle2 },
  { status: "shipped", label: "Enviado", icon: Truck },
  { status: "delivered", label: "Entregado", icon: Home },
];

export default function TrackingPage() {
  const [requestId, setRequestId] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const trackingQuery = trpc.qrTracking.getByRequestId.useQuery(
    { requestId: parseInt(requestId) },
    { enabled: submitted && !!requestId }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestId) {
      toast.error("Por favor ingresa un número de solicitud");
      return;
    }
    setSubmitted(true);
  };

  const getStatusIndex = (status: string) => {
    return statusSteps.findIndex((step) => step.status === status);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Rastrear tu Amigurumi</h1>
          <p className="text-muted-foreground">
            Ingresa el número de tu solicitud para ver el estado de tu amigurumi
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Buscar Solicitud</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="number"
                placeholder="Número de solicitud"
                value={requestId}
                onChange={(e) => {
                  setRequestId(e.target.value);
                  setSubmitted(false);
                }}
              />
              <Button type="submit">Buscar</Button>
            </form>
          </CardContent>
        </Card>

        {submitted && (
          <>
            {trackingQuery.isLoading && (
              <div className="text-center py-12">Cargando información...</div>
            )}

            {trackingQuery.error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <p className="text-red-600">
                    No se encontró información de rastreo para esta solicitud
                  </p>
                </CardContent>
              </Card>
            )}

            {trackingQuery.data && (
              <div className="space-y-8">
                {trackingQuery.data && trackingQuery.data.qrCode && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Código QR</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                      <img
                        src={trackingQuery.data.qrCode}
                        alt="QR Code"
                        className="w-48 h-48"
                      />
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>Estado del Amigurumi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {statusSteps.map((step, index) => {
                        const currentStatusIndex = getStatusIndex(
                          trackingQuery.data?.status || ""
                        );
                        const isCompleted = index <= currentStatusIndex;
                        const isCurrent = index === currentStatusIndex;
                        const Icon = step.icon;

                        return (
                          <div key={step.status} className="flex items-center gap-4">
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                                  isCompleted
                                    ? "bg-pink-500 text-white"
                                    : "bg-gray-200 text-gray-400"
                                } ${isCurrent ? "ring-4 ring-pink-200" : ""}`}
                              >
                                <Icon size={24} />
                              </div>
                              {index < statusSteps.length - 1 && (
                                <div
                                  className={`w-1 h-12 mt-2 ${
                                    isCompleted ? "bg-pink-500" : "bg-gray-200"
                                  }`}
                                />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold">{step.label}</p>
                              {isCurrent && (
                                <Badge className="mt-1">Estado Actual</Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Información</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p>
                      <span className="font-semibold">Solicitud #:</span>{" "}
                      {requestId}
                    </p>
                    <p>
                      <span className="font-semibold">Estado:</span>{" "}
                      <Badge variant="outline">
                        {trackingQuery.data?.status && statusSteps.find((s) => s.status === trackingQuery.data?.status)
                          ?.label}
                      </Badge>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Última actualización:{" "}
                      {new Date(trackingQuery.data.updatedAt).toLocaleDateString(
                        "es-CO"
                      )}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-6">
                    <p className="text-sm text-blue-900">
                      ¿Tienes preguntas? Contáctanos a través de WhatsApp o correo
                      electrónico para más información sobre tu amigurumi.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
