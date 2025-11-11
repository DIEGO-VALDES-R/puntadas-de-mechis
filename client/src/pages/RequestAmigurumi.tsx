import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Camera, Upload, X } from "lucide-react";
import { Link } from "wouter";
import { storagePut } from "@/lib/storage";

const PACKAGE_TYPES = [
  { value: "wooden_box", label: "Caja de Madera" },
  { value: "paper_bag", label: "Bolsa de Papel" },
  { value: "chest_box", label: "Caja Cofre" },
  { value: "glass_dome", label: "Cúpula de Vidrio" },
];

const DEPOSIT_AMOUNTS = [
  { value: 50000, label: "COP $50,000" },
  { value: 100000, label: "COP $100,000" },
  { value: 150000, label: "COP $150,000" },
  { value: 200000, label: "COP $200,000" },
];

export default function RequestAmigurumi() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    description: "",
    packageType: "",
    depositAmount: 50000,
  });
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const customerId = localStorage.getItem("customerId");

  const requestMutation = trpc.request.create.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Solicitud creada exitosamente");
        // Store request ID and proceed to payment
        localStorage.setItem("requestId", data.request.id.toString());
        setLocation("/payment");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Error al crear solicitud");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "depositAmount" ? parseInt(value) : value,
    }));
  };

  const handleImageSelect = (file: File | null) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("La imagen no debe superar 5MB");
        return;
      }
      setReferenceImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageSelect(file);
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageSelect(file);
  };

  const removeImage = () => {
    setReferenceImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerId) {
      toast.error("Por favor, regístrate primero");
      setLocation("/register");
      return;
    }

    if (!formData.packageType) {
      toast.error("Por favor, selecciona un tipo de empaque");
      return;
    }

    setIsLoading(true);

    try {
      let referenceImageUrl: string | undefined;

      // Upload image if provided
      if (referenceImage) {
        try {
          const result = await storagePut(
            `amigurumi-references/${Date.now()}-${Math.random().toString(36).substring(7)}`,
            referenceImage,
            referenceImage.type
          );
          referenceImageUrl = result.url;
        } catch (error) {
          console.error("Error uploading image:", error);
          toast.error("Error al subir la imagen");
          return;
        }
      }

      await requestMutation.mutateAsync({
        customerId: parseInt(customerId),
        description: formData.description,
        packageType: formData.packageType as any,
        depositAmount: formData.depositAmount,
        referenceImageUrl,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>

        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle>Solicitar Amigurumi</CardTitle>
            <CardDescription className="text-pink-100">
              Describe tu amigurumi personalizado y elige las opciones que prefieras
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Descripción del Amigurumi *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe detalladamente tu amigurumi: tamaño, colores, características especiales, etc."
                  value={formData.description}
                  onChange={handleChange}
                  required
                  minLength={10}
                  className="min-h-32"
                />
                <p className="text-xs text-gray-500">
                  Mínimo 10 caracteres
                </p>
              </div>

              {/* Reference Image */}
              <div className="space-y-2">
                <Label>Foto de Referencia (Opcional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <div className="relative inline-block">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-w-xs max-h-64 rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Cambiar Archivo
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => cameraInputRef.current?.click()}
                        >
                          <Camera className="mr-2 h-4 w-4" />
                          Tomar Foto
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="flex justify-center gap-4">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex flex-col items-center gap-2 p-4 hover:bg-gray-50 rounded-lg transition"
                        >
                          <Upload className="h-8 w-8 text-gray-400" />
                          <span className="text-sm font-medium">Subir Archivo</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => cameraInputRef.current?.click()}
                          className="flex flex-col items-center gap-2 p-4 hover:bg-gray-50 rounded-lg transition"
                        >
                          <Camera className="h-8 w-8 text-gray-400" />
                          <span className="text-sm font-medium">Tomar Foto</span>
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG o GIF (máx. 5MB)
                      </p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleCameraCapture}
                  className="hidden"
                />
              </div>

              {/* Package Type */}
              <div className="space-y-2">
                <Label htmlFor="packageType">Tipo de Empaque *</Label>
                <Select
                  value={formData.packageType}
                  onValueChange={(value) => handleSelectChange(value, "packageType")}
                >
                  <SelectTrigger id="packageType">
                    <SelectValue placeholder="Selecciona un tipo de empaque" />
                  </SelectTrigger>
                  <SelectContent>
                    {PACKAGE_TYPES.map((pkg) => (
                      <SelectItem key={pkg.value} value={pkg.value}>
                        {pkg.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Deposit Amount */}
              <div className="space-y-2">
                <Label htmlFor="depositAmount">Monto de Abono Obligatorio *</Label>
                <Select
                  value={formData.depositAmount.toString()}
                  onValueChange={(value) => handleSelectChange(value, "depositAmount")}
                >
                  <SelectTrigger id="depositAmount">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPOSIT_AMOUNTS.map((amount) => (
                      <SelectItem key={amount.value} value={amount.value.toString()}>
                        {amount.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  El abono es obligatorio para procesar tu solicitud
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando Solicitud...
                  </>
                ) : (
                  "Crear Solicitud"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
