import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const phoneNumber = "573125912152";
  const message = "Hola, me interesa solicitar un amigurumi personalizado. ¿Cuál es el proceso?";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 flex items-center justify-center"
      title="Contactar por WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  );
}
