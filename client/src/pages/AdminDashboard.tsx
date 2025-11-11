import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, MessageSquare, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [adminMessage, setAdminMessage] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user is admin
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Acceso Denegado</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">No tienes permisos para acceder al panel de administración.</p>
              <Link href="/">
                <Button>Volver al Inicio</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const requestsQuery = trpc.request.getAll.useQuery();
  const communicationsQuery = trpc.communication.getByRequestId.useQuery(
    { requestId: selectedRequestId || 0 },
    { enabled: !!selectedRequestId }
  );

  const updateRequestMutation = trpc.request.update.useMutation({
    onSuccess: () => {
      toast.success("Solicitud actualizada");
      requestsQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Error al actualizar");
    },
  });

  const messageMutation = trpc.communication.create.useMutation({
    onSuccess: () => {
      toast.success("Mensaje enviado");
      setAdminMessage("");
      communicationsQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Error al enviar mensaje");
    },
  });

  const handleUpdateStatus = async (requestId: number, newStatus: string) => {
    setIsSubmitting(true);
    try {
      await updateRequestMutation.mutateAsync({
        id: requestId,
        status: newStatus as any,
        adminNotes,
      });
      setAdminNotes("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendMessage = async (requestId: number) => {
    if (!adminMessage.trim()) return;

    setIsSubmitting(true);
    try {
      const request = requestsQuery.data?.find(r => r.id === requestId);
      if (request) {
        await messageMutation.mutateAsync({
          requestId,
          customerId: request.customerId,
          senderType: "admin",
          message: adminMessage,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "deposit_paid":
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case "in_progress":
        return <AlertCircle className="h-5 w-5 text-purple-500" />;
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
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
  const selectedRequest = requests.find(r => r.id === selectedRequestId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
          <p className="text-gray-600">Gestiona todas las solicitudes de amigurumis</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Requests List */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Solicitudes ({requests.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {requests.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Sin solicitudes</p>
                  ) : (
                    requests.map((request) => (
                      <div
                        key={request.id}
                        onClick={() => setSelectedRequestId(request.id)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedRequestId === request.id
                            ? "border-pink-500 bg-pink-50"
                            : "border-gray-200 hover:border-pink-300"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusIcon(request.status)}
                              <h4 className="font-semibold text-gray-900">
                                Solicitud #{request.id}
                              </h4>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              Abono: COP ${(request.depositAmount / 100).toLocaleString("es-CO")}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(request.createdAt).toLocaleDateString("es-CO")}
                            </p>
                          </div>
                          <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded">
                            {getStatusLabel(request.status)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Details Panel */}
          {selectedRequest && (
            <div className="lg:col-span-1 space-y-4">
              {/* Request Details */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Detalles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600 font-medium">ID:</p>
                    <p className="text-gray-900">#{selectedRequest.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Empaque:</p>
                    <p className="text-gray-900 capitalize">
                      {selectedRequest.packageType.replace(/_/g, " ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Abono:</p>
                    <p className="text-gray-900">
                      COP ${(selectedRequest.depositAmount / 100).toLocaleString("es-CO")}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Descripción:</p>
                    <p className="text-gray-900 text-xs line-clamp-3">
                      {selectedRequest.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Status Update */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Cambiar Estado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Notas del Administrador
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Agrega notas sobre esta solicitud..."
                      className="w-full p-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-pink-500"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    {["in_progress", "completed", "cancelled"].map((status) => (
                      <Button
                        key={status}
                        onClick={() => handleUpdateStatus(selectedRequest.id, status)}
                        disabled={isSubmitting}
                        variant="outline"
                        className="w-full text-xs"
                      >
                        {isSubmitting ? (
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        ) : null}
                        Marcar como {getStatusLabel(status)}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Messages */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Mensajes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2 max-h-32 overflow-y-auto">
                    {communicationsQuery.data && communicationsQuery.data.length > 0 ? (
                      communicationsQuery.data.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-2 rounded text-xs ${
                            msg.senderType === "admin"
                              ? "bg-pink-100 text-pink-900"
                              : "bg-blue-100 text-blue-900"
                          }`}
                        >
                          <p className="font-medium mb-1">
                            {msg.senderType === "admin" ? "Tú" : "Cliente"}
                          </p>
                          <p>{msg.message}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">Sin mensajes</p>
                    )}
                  </div>
                  <textarea
                    value={adminMessage}
                    onChange={(e) => setAdminMessage(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-pink-500"
                    rows={2}
                  />
                  <Button
                    onClick={() => handleSendMessage(selectedRequest.id)}
                    disabled={!adminMessage.trim() || isSubmitting}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-xs"
                  >
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    ) : null}
                    Enviar
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
