import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function Payment() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "completed" | "failed">("pending");

  const requestId = localStorage.getItem("requestId");
  const customerId = localStorage.getItem("customerId");

  const requestQuery = trpc.request.getById.useQuery(
    { id: parseInt(requestId || "0") },
    { enabled: !!requestId }
  );

  const customerQuery = trpc.customer.getById.useQuery(
    { id: parseInt(customerId || "0") },
    { enabled: !!customerId }
  );

  const paymentMutation = trpc.payment.create.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        // Redirect to Bold payment link
        redirectToBoldPayment();
      }
    },
    onError: (error) => {
      toast.error(error.message || "Error al crear el pago");
    },
  });

  const redirectToBoldPayment = () => {
    if (!requestQuery.data || !customerQuery.data) return;

    const request = requestQuery.data;
    const customer = customerQuery.data;

    // Bold payment link
    const boldLink = "https://checkout.bold.co/payment/LNK_EXBI7L6EK8";
    
    // Create URL with parameters
    const params = new URLSearchParams({
      amount: (request.depositAmount / 100).toString(),
      reference: `AMIGURUMI-${request.id}`,
      description: `Abono para solicitud de amigurumi #${request.id}`,
    });

    // Redirect to Bold payment
    window.location.href = `${boldLink}?${params.toString()}`;
  };

  const handleCreatePayment = async () => {
    if (!requestId || !customerId) {
      toast.error("Información incompleta");
      return;
    }

    setIsLoading(true);
    try {
      await paymentMutation.mutateAsync({
        requestId: parseInt(requestId),
        customerId: parseInt(customerId),
        amount: requestQuery.data?.depositAmount || 50000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (requestQuery.isLoading || customerQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información de pago...</p>
        </div>
      </div>
    );
  }

  if (!requestQuery.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-md mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">No se encontró la solicitud</p>
              <Link href="/">
                <Button className="w-full">Volver al Inicio</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const request = requestQuery.data;
  const customer = customerQuery.data;
  const amountInPesos = (request.depositAmount / 100).toLocaleString("es-CO");

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <Link href="/request">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>

        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle>Realizar Pago</CardTitle>
            <CardDescription className="text-pink-100">
              Completa el pago de tu abono obligatorio
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {paymentStatus === "completed" ? (
              <div className="text-center space-y-4">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                <h3 className="text-lg font-semibold text-gray-900">¡Pago Exitoso!</h3>
                <p className="text-gray-600">
                  Tu pago ha sido procesado correctamente. Recibirás una confirmación por correo.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold text-gray-900">Resumen de Solicitud</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID Solicitud:</span>
                      <span className="font-medium">#{request.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cliente:</span>
                      <span className="font-medium">
                        {customer?.firstName} {customer?.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tipo de Empaque:</span>
                      <span className="font-medium capitalize">
                        {request.packageType.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Abono Obligatorio:</span>
                      <span className="text-pink-600">COP ${amountInPesos}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Métodos de Pago</h4>
                  <p className="text-sm text-gray-600">
                    Procesa tu pago de forma segura a través de Bold
                  </p>
                </div>

                {/* Payment Button */}
                <Button
                  onClick={handleCreatePayment}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  disabled={isLoading || paymentMutation.isPending}
                >
                  {isLoading || paymentMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    `Pagar COP $${amountInPesos}`
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Tu información de pago es segura y encriptada
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
