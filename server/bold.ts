/**
 * Bold Payment Gateway Integration
 * Documentation: https://docs.bold.co/
 */

export interface BoldPaymentResponse {
  id: string;
  status: string;
  amount: number;
  currency: string;
  description: string;
  reference: string;
  created_at: string;
  updated_at: string;
}

export interface BoldWebhookPayload {
  id: string;
  status: string;
  amount: number;
  currency: string;
  reference: string;
  created_at: string;
  updated_at: string;
}

/**
 * Verify Bold webhook signature
 * @param payload The webhook payload
 * @param signature The signature from Bold
 * @param secretKey Your Bold secret key
 */
export function verifyBoldWebhookSignature(
  payload: string,
  signature: string,
  secretKey: string
): boolean {
  // Bold uses HMAC-SHA256 for webhook signatures
  // Implementation depends on Bold's specific signature format
  // This is a placeholder - adjust based on Bold's actual implementation
  
  try {
    const crypto = require("crypto");
    const hash = crypto
      .createHmac("sha256", secretKey)
      .update(payload)
      .digest("hex");
    
    return hash === signature;
  } catch (error) {
    console.error("[Bold] Error verifying signature:", error);
    return false;
  }
}

/**
 * Parse Bold webhook payload
 */
export function parseBoldWebhookPayload(payload: any): BoldWebhookPayload {
  return {
    id: payload.id,
    status: payload.status,
    amount: payload.amount,
    currency: payload.currency,
    reference: payload.reference,
    created_at: payload.created_at,
    updated_at: payload.updated_at,
  };
}

/**
 * Map Bold payment status to our internal status
 */
export function mapBoldStatusToInternal(boldStatus: string): string {
  const statusMap: Record<string, string> = {
    pending: "pending",
    approved: "completed",
    declined: "failed",
    cancelled: "failed",
    refunded: "refunded",
  };

  return statusMap[boldStatus] || "pending";
}
