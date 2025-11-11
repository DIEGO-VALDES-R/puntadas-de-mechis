import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ShoppingCart } from "lucide-react";
import { Link } from "wouter";

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: {
    id: number;
    image: string;
    title: string;
    description: string;
    details?: string;
  } | null;
}

export default function GalleryModal({ isOpen, onClose, image }: GalleryModalProps) {
  if (!image) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-0 bg-white">
        <div className="relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
          >
            <X className="w-6 h-6 text-gray-900" />
          </button>

          {/* Image */}
          <div className="w-full bg-gray-100 flex items-center justify-center min-h-96">
            <img
              src={image.image}
              alt={image.title}
              className="w-full h-auto object-contain max-h-96"
            />
          </div>

          {/* Content */}
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{image.title}</h2>
            <p className="text-gray-600 mb-4">{image.description}</p>

            {image.details && (
              <div className="bg-pink-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Características:</h3>
                <p className="text-sm text-gray-700 whitespace-pre-line">{image.details}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Link href="/register" className="flex-1">
                <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Solicitar Este Amigurumi
                </Button>
              </Link>
              <a
                href="https://wa.me/573125912152?text=Hola, me interesa el amigurumi: {image.title}"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="outline" className="w-full">
                  Consultar por WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
