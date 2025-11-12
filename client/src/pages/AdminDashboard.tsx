import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, MessageSquare, CheckCircle, Clock, AlertCircle, Search, Filter, Download, Eye, BarChart3, DollarSign, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");
    toast.success("Sesión cerrada");
    setLocation("/");
  };
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [adminMessage, setAdminMessage] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "deposit">("newest");
  const [activeTab, setActiveTab] = useState("solicitudes");

  // Fetch all requests - moved to top level
  const requestsQuery = trpc.request.getAll.useQuery();
  const promotionsQuery = trpc.gallery.getPromotions.useQuery();
  const categoriesQuery = trpc.gallery.getCategories.useQuery();
  
  // Fetch communications - always called, but with enabled condition
  const communicationsQuery = trpc.communication.getByRequestId.useQuery(
    { requestId: selectedRequestId || 0 },
    { enabled: !!selectedRequestId }
  );

  // Mutations
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

  const markReadyMutation = trpc.completionNotification.markAsReady.useMutation({
    onSuccess: () => {
      toast.success("¡Amigurumi marcado como listo! Notificación enviada al cliente");
      requestsQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Error al marcar como listo");
    },
  });

  const generateQRMutation = trpc.qrTracking.generateForRequest.useMutation({
    onSuccess: (data) => {
      toast.success("Código QR generado exitosamente");
      requestsQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Error al generar código QR");
    },
  });

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "deposit_paid":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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

  let requests = requestsQuery.data || [];

  // Filter by status
  if (statusFilter !== "all") {
    requests = requests.filter(r => r.status === statusFilter);
  }

  // Search
  if (searchTerm) {
    requests = requests.filter(r =>
      r.id.toString().includes(searchTerm) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Sort
  if (sortBy === "newest") {
    requests = [...requests].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sortBy === "oldest") {
    requests = [...requests].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } else if (sortBy === "deposit") {
    requests = [...requests].sort((a, b) => b.depositAmount - a.depositAmount);
  }

  const selectedRequest = requests.find(r => r.id === selectedRequestId);

  // Calculate statistics
  const stats = {
    total: requestsQuery.data?.length || 0,
    pending: requestsQuery.data?.filter(r => r.status === "pending").length || 0,
    inProgress: requestsQuery.data?.filter(r => r.status === "in_progress").length || 0,
    completed: requestsQuery.data?.filter(r => r.status === "completed").length || 0,
    totalDeposits: requestsQuery.data?.reduce((sum, r) => sum + r.depositAmount, 0) || 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
          <div className="flex gap-4">
            <Link href="/" className="px-4 py-2 text-gray-600 hover:text-gray-900">Volver al Inicio</Link>
            <Button variant="outline" onClick={handleLogout}>Cerrar Sesión</Button>
          </div>
        </div>
      </div>

      <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="text-gray-600 mb-8">Gestiona solicitudes, inventario, contabilidad y promociones</p>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="solicitudes">Solicitudes</TabsTrigger>
            <TabsTrigger value="inventario">Inventario</TabsTrigger>
            <TabsTrigger value="contabilidad">Contabilidad</TabsTrigger>
            <TabsTrigger value="promociones">Promociones</TabsTrigger>
          </TabsList>

          {/* Solicitudes Tab */}
          <TabsContent value="solicitudes" className="mt-6">

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-gray-600 text-sm font-medium">Total</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-yellow-600 text-sm font-medium">Pendientes</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-purple-600 text-sm font-medium">En Progreso</p>
                <p className="text-3xl font-bold text-purple-600">{stats.inProgress}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-green-600 text-sm font-medium">Completadas</p>
                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-blue-600 text-sm font-medium">Abonos</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${(stats.totalDeposits / 100).toLocaleString("es-CO")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Requests Table */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Solicitudes ({requests.length})</CardTitle>
                <CardDescription>Filtra y busca solicitudes de clientes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search and Filters */}
                <div className="space-y-3">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar por ID o descripción..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                    />
                  </div>

                  {/* Filters */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-700 block mb-1">Estado</label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                      >
                        <option value="all">Todos</option>
                        <option value="pending">Pendiente</option>
                        <option value="deposit_paid">Abono Pagado</option>
                        <option value="in_progress">En Progreso</option>
                        <option value="completed">Completado</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-700 block mb-1">Ordenar por</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                      >
                        <option value="newest">Más Reciente</option>
                        <option value="oldest">Más Antiguo</option>
                        <option value="deposit">Mayor Abono</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Requests List */}
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {requests.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No hay solicitudes que coincidan con los filtros</p>
                    </div>
                  ) : (
                    requests.map((request) => (
                      <div
                        key={request.id}
                        onClick={() => setSelectedRequestId(request.id)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedRequestId === request.id
                            ? "border-pink-500 bg-pink-50"
                            : "border-gray-200 hover:border-pink-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusIcon(request.status)}
                              <h4 className="font-semibold text-gray-900 truncate">
                                Solicitud #{request.id}
                              </h4>
                            </div>
                            <p className="text-sm text-gray-600 mb-1 truncate">
                              {request.description.substring(0, 50)}...
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>Abono: COP ${(request.depositAmount / 100).toLocaleString("es-CO")}</span>
                              <span>•</span>
                              <span>{new Date(request.createdAt).toLocaleDateString("es-CO")}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className={`text-xs font-medium px-2 py-1 rounded whitespace-nowrap ${getStatusColor(request.status)}`}>
                              {getStatusLabel(request.status)}
                            </span>
                            <Eye className="h-4 w-4 text-gray-400" />
                          </div>
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
                  <CardTitle className="text-lg">Detalles de Solicitud</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-3 rounded-lg">
                    <p className="text-gray-600 font-medium mb-1">ID de Solicitud</p>
                    <p className="text-2xl font-bold text-gray-900">#{selectedRequest.id}</p>
                  </div>

                  <div>
                    <p className="text-gray-600 font-medium mb-1">Estado</p>
                    <span className={`inline-block text-xs font-medium px-3 py-1 rounded ${getStatusColor(selectedRequest.status)}`}>
                      {getStatusLabel(selectedRequest.status)}
                    </span>
                  </div>

                  <div>
                    <p className="text-gray-600 font-medium mb-1">Empaque</p>
                    <p className="text-gray-900 capitalize bg-gray-50 p-2 rounded">
                      {selectedRequest.packageType.replace(/_/g, " ")}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600 font-medium mb-1">Abono Pagado</p>
                    <p className="text-lg font-bold text-green-600">
                      COP ${(selectedRequest.depositAmount / 100).toLocaleString("es-CO")}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600 font-medium mb-1">Descripción</p>
                    <p className="text-gray-900 bg-gray-50 p-2 rounded text-xs leading-relaxed">
                      {selectedRequest.description}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600 font-medium mb-1">Fecha de Solicitud</p>
                    <p className="text-gray-900">
                      {new Date(selectedRequest.createdAt).toLocaleDateString("es-CO", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
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
                    <Button
                      onClick={() => {
                        if (selectedRequest) {
                          markReadyMutation.mutate({
                            requestId: selectedRequest.id,
                            customerId: selectedRequest.customerId,
                          });
                        }
                      }}
                      disabled={isSubmitting || markReadyMutation.isPending}
                      className="w-full text-xs bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    >
                      {markReadyMutation.isPending ? (
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      ) : null}
                      ✓ Marcar como Listo
                    </Button>
                    <Button
                      onClick={() => {
                        if (selectedRequest) {
                          generateQRMutation.mutate({ requestId: selectedRequest.id });
                        }
                      }}
                      disabled={isSubmitting || generateQRMutation.isPending}
                      className="w-full text-xs bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                    >
                      {generateQRMutation.isPending ? (
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      ) : null}
                      QR Código
                    </Button>
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
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto">
                    {communicationsQuery.data && communicationsQuery.data.length > 0 ? (
                      communicationsQuery.data.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-2 rounded text-xs ${
                            msg.senderType === "admin"
                              ? "bg-pink-100 text-pink-900 ml-4"
                              : "bg-blue-100 text-blue-900 mr-4"
                          }`}
                        >
                          <p className="font-medium mb-1">
                            {msg.senderType === "admin" ? "Tú" : "Cliente"}
                          </p>
                          <p>{msg.message}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4 text-xs">Sin mensajes</p>
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
                    Enviar Mensaje
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
          </TabsContent>

          {/* Inventario Tab */}
          <TabsContent value="inventario" className="mt-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Gestión de Inventario</CardTitle>
                <CardDescription>Registra y controla tus compras de materiales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Sistema de inventario en desarrollo</p>
                  <p className="text-sm text-gray-500">Podrás registrar compras de materiales, cantidad, costo y número de referencia</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contabilidad Tab */}
          <TabsContent value="contabilidad" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-green-600 text-sm font-medium mb-2">Ingresos Totales</p>
                    <p className="text-3xl font-bold text-green-600">$0</p>
                    <p className="text-xs text-gray-500 mt-2">De todas las solicitudes</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-red-600 text-sm font-medium mb-2">Gastos Totales</p>
                    <p className="text-3xl font-bold text-red-600">$0</p>
                    <p className="text-xs text-gray-500 mt-2">Materiales y compras</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-blue-600 text-sm font-medium mb-2">Ganancia Neta</p>
                    <p className="text-3xl font-bold text-blue-600">$0</p>
                    <p className="text-xs text-gray-500 mt-2">Ingresos - Gastos</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Resumen Financiero</CardTitle>
                <CardDescription>Análisis de ingresos vs gastos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Sistema de contabilidad en desarrollo</p>
                  <p className="text-sm text-gray-500">Verás gráficos de ingresos, gastos y ganancias mensuales</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Promociones Tab */}
          <TabsContent value="promociones" className="mt-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Promociones Activas ({promotionsQuery.data?.length || 0})</CardTitle>
                <CardDescription>Descuentos por porcentaje en productos</CardDescription>
              </CardHeader>
              <CardContent>
                {promotionsQuery.data && promotionsQuery.data.length > 0 ? (
                  <div className="space-y-3">
                    {promotionsQuery.data.map((promo: any) => (
                      <div key={promo.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <p className="font-semibold text-gray-900">{promo.name}</p>
                          <p className="text-sm text-gray-600">Descuento: {promo.discountPercentage}%</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Editar</Button>
                          <Button size="sm" variant="outline" className="text-red-600">Eliminar</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No hay promociones activas</p>
                    <Button>Crear Promoción</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg mt-6">
              <CardHeader>
                <CardTitle>Categorías ({categoriesQuery.data?.length || 0})</CardTitle>
                <CardDescription>Categorías de productos en la galería</CardDescription>
              </CardHeader>
              <CardContent>
                {categoriesQuery.data && categoriesQuery.data.length > 0 ? (
                  <div className="space-y-3">
                    {categoriesQuery.data.map((cat: any) => (
                      <div key={cat.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{cat.icon}</span>
                          <p className="font-semibold text-gray-900">{cat.name}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Editar</Button>
                          <Button size="sm" variant="outline" className="text-red-600">Eliminar</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">No hay categorías creadas</p>
                    <Button>Crear Categoría</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      </div>
    </div>
  );
}
