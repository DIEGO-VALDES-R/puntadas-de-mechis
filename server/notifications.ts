import { notifyOwner } from "./_core/notification";

export async function notifyNewRequest(
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  packageType: string,
  description: string
) {
  const content = `
Nueva solicitud de amigurumi recibida:

**Cliente:** ${customerName}
**Email:** ${customerEmail}
**Teléfono:** ${customerPhone}
**Tipo de Empaque:** ${packageType}
**Descripción:** ${description}

Por favor, accede al panel de administración para gestionar esta solicitud.
  `.trim();

  try {
    await notifyOwner({
      title: "Nueva Solicitud de Amigurumi",
      content,
    });
    console.log("[Notification] Owner notified about new request");
  } catch (error) {
    console.error("[Notification] Failed to notify owner:", error);
  }
}

export async function notifyPaymentReceived(
  customerName: string,
  amount: number,
  requestId: number
) {
  const content = `
Pago/Abono recibido:

**Cliente:** ${customerName}
**Monto:** $${(amount / 100).toLocaleString("es-CO")}
**ID de Solicitud:** ${requestId}

El cliente ha realizado el pago. Por favor, procede con la solicitud.
  `.trim();

  try {
    await notifyOwner({
      title: "Pago Recibido",
      content,
    });
    console.log("[Notification] Owner notified about payment");
  } catch (error) {
    console.error("[Notification] Failed to notify owner about payment:", error);
  }
}
