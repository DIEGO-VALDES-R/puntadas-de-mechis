import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, ArrowLeft, MessageSquare, Package } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function MyRequests() {
  const [, setLocation] = useLocation();
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");
  const [isSubmittingMessage, setIsSubmittingMessage] = useState(false);

  const customerId = localStorage.getItem("customerId");

  const requestsQuery = trpc.request.getByCustomerId.useQuery(
    { customerId: parseInt(customerId || "0") },
    { enabled: !!customerId }
  );

  const communicationsQuery = trpc.communication.getByRequestId.useQuery(
    { requestId: selectedRequestId || 0 },
    { enabled: !!selectedRequestId }
  );

  const messageMutation = trpc.communication.create.useMutation({
    onSuccess: () => {
      toast.success("Mensaje enviado");
      setMessageText("");
      communicationsQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Error al enviar mensaje");
    },
  });

  const handleSendMessage = async (requestId: number) => {
    if (!messageText.trim() || !customerId) return;

    setIsSubmittingMessage(true);
    try {
      await messageMutation.mutateAsync({
        requestId,
        customerId: parseInt(customerId),
        senderType: "customer",
        message: messageText,
      });
    } finally {
      setIsSubmittingMessage(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      deposit_paid: "bg-blue-100 text-blue-800",
      in_progress: "bg-purple-100 text-purple-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Pendiente",
      deposit_paid: "Abono Pagado",
      in_progress: "En Proceso",
      completed: "Completado",
      cancelled: "Cancelado",
    };
    return labels[status] || status;
  };

  if (!customerId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Link href="/register">
            <Button>Registrarse</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (requestsQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando solicitudes...</p>
        </div>
      </div>
    );
  }

  const requests = requestsQuery.data || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Solicitudes</h1>
          <p className="text-gray-600">Gestiona y monitorea tus solicitudes de amigurumis</p>
        </div>

        {requests.length === 0 ? (
          <Card className="border-0 shadow-lg text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin solicitudes</h3>
            <p className="text-gray-600 mb-6">Aún no has realizado ninguna solicitud</p>
            <Link href="/request">
              <Button className="bg-gradient-to-r from-pink-500 to-purple-600">
                Crear Primera Solicitud
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Requests List */}
            <div className="lg:col-span-2 space-y-4">
              {requests.map((request) => (
                <Card
                  key={request.id}
                  className={`border-0 shadow-lg cursor-pointer transition-all ${
                    selectedRequestId === request.id
                      ? "ring-2 ring-pink-500"
                      : "hover:shadow-xl"
                  }`}
                  onClick={() => setSelectedRequestId(request.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          Solicitud #{request.id}
                        </CardTitle>
                        <CardDescription>
                          {new Date(request.createdAt).toLocaleDateString("es-CO")}
                        </CardDescription>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {getStatusLabel(request.status)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>Empaque:</strong> {request.packageType.replace(/_/g, " ")}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Abono:</strong> COP ${(request.depositAmount / 100).toLocaleString("es-CO")}
                    </p>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {request.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Chat/Communication Panel */}
            {selectedRequestId && (
              <div className="lg:col-span-1">
                <Card className="border-0 shadow-lg sticky top-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Mensajes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Messages List */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3 max-h-64 overflow-y-auto">
                      {communicationsQuery.isLoading ? (
                        <div className="text-center text-sm text-gray-500">
                          Cargando mensajes...
                        </div>
                      ) : communicationsQuery.data && communicationsQuery.data.length > 0 ? (
                        communicationsQuery.data.map((msg) => (
                          <div
                            key={msg.id}
                            className={`p-2 rounded-lg text-sm ${
                              msg.senderType === "customer"
                                ? "bg-pink-100 text-pink-900 ml-4"
                                : "bg-blue-100 text-blue-900 mr-4"
                            }`}
                          >
                            <p className="font-medium text-xs mb-1">
                              {msg.senderType === "customer" ? "Tú" : "Administrador"}
                            </p>
                            <p>{msg.message}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(msg.createdAt).toLocaleTimeString("es-CO")}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-sm text-gray-500">
                          Sin mensajes aún
                        </p>
                      )}
                    </div>

                    {/* Message Input */}
                    <div className="space-y-2">
                      <textarea
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Escribe tu mensaje..."
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                        rows={3}
                      />
                      <Button
                        onClick={() => handleSendMessage(selectedRequestId)}
                        disabled={!messageText.trim() || isSubmittingMessage}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                      >
                        {isSubmittingMessage ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          "Enviar Mensaje"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
