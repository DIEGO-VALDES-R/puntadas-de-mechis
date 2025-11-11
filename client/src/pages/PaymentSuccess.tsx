import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Mail, MessageSquare } from "lucide-react";
import { Link } from "wouter";

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16" />
            </div>
            <CardTitle>¡Pago Exitoso!</CardTitle>
            <CardDescription className="text-green-100">
              Tu solicitud ha sido registrada correctamente
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Confirmation Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">Confirmación Recibida</h3>
              <p className="text-sm text-green-800">
                Tu abono ha sido procesado correctamente. Recibirás un correo de confirmación con los detalles de tu solicitud.
              </p>
            </div>

            {/* Next Steps */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Próximos Pasos</h4>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Mail className="h-5 w-5 text-pink-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-gray-900">Confirmación por Email</p>
                    <p className="text-xs text-gray-600">Revisa tu correo para los detalles de tu solicitud</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MessageSquare className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-gray-900">Comunicación Directa</p>
                    <p className="text-xs text-gray-600">Nos pondremos en contacto pronto para coordinar detalles</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Números de contacto:</strong>
              </p>
              <p className="text-sm text-gray-900">
                📱 +57 312 591 2152<br />
                📱 +57 322 458 9653
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link href="/my-requests">
                <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                  Ver Mis Solicitudes
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Volver al Inicio
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
