import { request } from '../hooks/api/http.client';
import API_ENDPOINTS from '../hooks/api/api.endpoints';
import type { IServerResponse } from '../models/serverResponse.model';

/**
 * Payment service response interfaces
 */
export interface CheckoutSessionResponse {
  checkoutUrl: string;
  transactionStatus: string;
}

export interface CreateCheckoutSessionRequest {
  amount: number; // Amount in cents
  currency: string;
  successUrl: string;
  cancelUrl: string;
}

export interface PaymentConfirmationResponse {
  success: boolean;
  message: string;
}

/**
 * Payment Service
 * 
 * Handles all payment-related operations including:
 * - Creating Stripe checkout sessions
 * - Confirming payments
 * - Managing payment status
 */
class PaymentService {
  /**
   * Create a Stripe checkout session
   * 
   * @param data - The checkout session request data
   * @returns Promise with the checkout session response containing the checkout URL
   */
  async createCheckoutSession(data: CreateCheckoutSessionRequest): Promise<IServerResponse<CheckoutSessionResponse>> {
    console.log("🏪 PaymentService: Creating checkout session");
    console.log("📋 Service request data:", {
      ...data,
      timestamp: new Date().toISOString(),
      endpoint: API_ENDPOINTS.payment.createCheckoutSession
    });

    try {
      const startTime = performance.now();
      
      const response = await request<CheckoutSessionResponse>({
        url: API_ENDPOINTS.payment.createCheckoutSession,
        method: 'POST',
        data,
      });

      const endTime = performance.now();
      const duration = endTime - startTime;

      console.log("✅ PaymentService: Checkout session created successfully");
      console.log("⏱️ API call duration:", `${duration.toFixed(2)}ms`);
      console.log("📦 Service response:", {
        status: response.status,
        message: response.message,
        data: response.data,
        timestamp: new Date().toISOString(),
        duration: `${duration.toFixed(2)}ms`
      });

      return response;
    } catch (error) {
      console.error("💥 PaymentService: Checkout session creation failed");
      console.error("🔍 Service error details:", {
        error: (error as Error).message,
        stack: (error as Error).stack,
        endpoint: API_ENDPOINTS.payment.createCheckoutSession,
        requestData: data,
        timestamp: new Date().toISOString()
      });
      
      throw error;
    }
  }

  /**
   * Confirm a payment after successful checkout
   * 
   * @param sessionId - The Stripe session ID to confirm
   * @returns Promise with the payment confirmation response
   */
  async confirmPayment(sessionId: string): Promise<IServerResponse<PaymentConfirmationResponse>> {
    console.log("🔐 PaymentService: Confirming payment");
    console.log("🆔 Session ID:", sessionId);
    console.log("📍 Endpoint:", API_ENDPOINTS.payment.confirmPayment);

    try {
      const startTime = performance.now();
      
      const response = await request<PaymentConfirmationResponse>({
        url: API_ENDPOINTS.payment.confirmPayment,
        method: 'POST',
        data: { sessionId },
      });

      const endTime = performance.now();
      const duration = endTime - startTime;

      console.log("✅ PaymentService: Payment confirmed successfully");
      console.log("⏱️ Confirmation duration:", `${duration.toFixed(2)}ms`);
      console.log("📦 Confirmation response:", {
        status: response.status,
        message: response.message,
        data: response.data,
        sessionId,
        timestamp: new Date().toISOString(),
        duration: `${duration.toFixed(2)}ms`
      });

      return response;
    } catch (error) {
      console.error("💥 PaymentService: Payment confirmation failed");
      console.error("🔍 Confirmation error details:", {
        error: (error as Error).message,
        stack: (error as Error).stack,
        sessionId,
        endpoint: API_ENDPOINTS.payment.confirmPayment,
        timestamp: new Date().toISOString()
      });
      
      throw error;
    }
  }
}

// Export as a singleton
export const paymentService = new PaymentService(); 