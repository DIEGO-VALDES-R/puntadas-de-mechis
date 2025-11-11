import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void;
  currentImage?: string;
  disabled?: boolean;
}

export default function ImageUpload({ onImageSelect, currentImage, disabled }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona una imagen válida");
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen no debe exceder 5MB");
      return;
    }

    // Crear vista previa
    const reader = new FileReader();
    reader.onload = (e) => {
      const previewUrl = e.target?.result as string;
      setPreview(previewUrl);
      setFileName(file.name);
      onImageSelect(file, previewUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreview(null);
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {preview ? (
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img
              src={preview}
              alt="Vista previa"
              className="w-full h-full object-cover"
            />
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="text-sm text-gray-600">
            <p className="font-medium">Archivo seleccionado:</p>
            <p className="truncate">{fileName}</p>
          </div>
          <Button
            onClick={handleClick}
            variant="outline"
            className="w-full"
            disabled={disabled}
          >
            <Upload className="w-4 h-4 mr-2" />
            Cambiar Imagen
          </Button>
        </div>
      ) : (
        <button
          onClick={handleClick}
          disabled={disabled}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-pink-500 hover:bg-pink-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          <div className="flex flex-col items-center gap-2">
            <ImageIcon className="w-8 h-8 text-gray-400" />
            <div className="text-center">
              <p className="font-medium text-gray-900">Haz clic para adjuntar imagen</p>
              <p className="text-sm text-gray-500">o arrastra una imagen aquí</p>
              <p className="text-xs text-gray-400 mt-2">PNG, JPG, GIF (máx. 5MB)</p>
            </div>
          </div>
        </button>
      )}
    </div>
  );
}
