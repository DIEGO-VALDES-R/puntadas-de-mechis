import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search, CheckCircle, Clock, AlertCircle, Package } from "lucide-react";
import { trpc } from "@/lib/trpc";

const statusConfig = {
  pending: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  deposit_paid: { label: "Abono Recibido", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
  in_progress: { label: "En Progreso", color: "bg-purple-100 text-purple-800", icon: Package },
  completed: { label: "Completado", color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { label: "Cancelado", color: "bg-red-100 text-red-800", icon: AlertCircle },
};

export default function TrackRequest() {
  const [trackingCode, setTrackingCode] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [request, setRequest] = useState<any | null>(null);

  const trackingQuery = trpc.request.getByTrackingCode.useQuery(
    { trackingCode },
    { enabled: false }
  );

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!trackingCode || trackingCode.length !== 6) {
      toast.error("Por favor ingresa un código de 6 dígitos");
      return;
    }

    setIsSearching(true);

    try {
      const result = await trackingQuery.refetch();
      if (result.data) {
        setRequest(result.data);
      } else {
        toast.error("No se encontró ninguna solicitud con ese código");
        setRequest(null);
      }
    } catch (error) {
      toast.error("Error al buscar la solicitud");
      setRequest(null);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Rastrear Mi Solicitud</h1>
          <p className="text-lg text-gray-600">
            Ingresa tu código de seguimiento de 6 dígitos para ver el estado de tu amigurumi
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Código de Seguimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Ej: 123456"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  className="text-center text-2xl font-bold tracking-widest"
                />
                <Button
                  type="submit"
                  disabled={isSearching || trackingCode.length !== 6}
                  className="bg-pink-500 hover:bg-pink-600"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Buscar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {request && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Detalles de tu Solicitud</CardTitle>
                <Badge className={statusConfig[request.status as keyof typeof statusConfig]?.color}>
                  {statusConfig[request.status as keyof typeof statusConfig]?.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900">Estado del Proceso</h3>
                <div className="space-y-3">
                  {[
                    { status: "pending", label: "Solicitud Recibida" },
                    { status: "deposit_paid", label: "Abono Confirmado" },
                    { status: "in_progress", label: "Tejiendo tu Amigurumi" },
                    { status: "completed", label: "Listo para Envío" },
                  ].map((step, idx) => {
                    const isCompleted = Object.keys(statusConfig).indexOf(request.status) >= Object.keys(statusConfig).indexOf(step.status);
                    const isCurrent = request.status === step.status;

                    return (
                      <div key={idx} className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCompleted ? "bg-green-500 text-white" : isCurrent ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-600"
                        }`}>
                          {isCompleted ? "✓" : isCurrent ? "●" : idx + 1}
                        </div>
                        <div>
                          <p className={`font-semibold ${isCompleted || isCurrent ? "text-gray-900" : "text-gray-500"}`}>
                            {step.label}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t pt-6 space-y-4">
                <h3 className="font-bold text-gray-900">Información de la Solicitud</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Código de Seguimiento</p>
                    <p className="text-lg font-bold text-gray-900">{request.trackingCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tipo de Empaque</p>
                    <p className="text-lg font-bold text-gray-900 capitalize">
                      {request.packageType.replace(/_/g, " ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Abono Recibido</p>
                    <p className="text-lg font-bold text-gray-900">${(request.depositAmount / 100).toLocaleString("es-CO")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fecha de Solicitud</p>
                    <p className="text-lg font-bold text-gray-900">
                      {new Date(request.createdAt).toLocaleDateString("es-CO")}
                    </p>
                  </div>
                </div>
              </div>

              {request.description && (
                <div className="border-t pt-6">
                  <h3 className="font-bold text-gray-900 mb-2">Descripción del Amigurumi</h3>
                  <p className="text-gray-700">{request.description}</p>
                </div>
              )}

              <div className="border-t pt-6 bg-pink-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">¿Preguntas sobre tu solicitud?</p>
                <p className="text-gray-900">
                  Contáctanos por WhatsApp: <strong>+57 3124915127</strong>
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {!request && trackingCode && !isSearching && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-gray-900 font-semibold">No se encontró la solicitud</p>
                <p className="text-sm text-gray-600 mt-2">
                  Verifica que el código de seguimiento sea correcto e intenta de nuevo
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
