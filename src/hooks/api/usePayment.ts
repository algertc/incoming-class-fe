import { useMutation, useQuery } from '@tanstack/react-query';
import { paymentService } from '../../services/payment.service';
import type { 
  CreateCheckoutSessionRequest, 
  CheckoutSessionResponse, 
  PaymentConfirmationResponse 
} from '../../services/payment.service';
import type { IServerResponse } from '../../models/serverResponse.model';

/**
 * React Query key factory for payment-related queries
 */
export const paymentKeys = {
  all: ['payment'] as const,
  sessions: () => [...paymentKeys.all, 'sessions'] as const,
  session: (id: string) => [...paymentKeys.sessions(), id] as const,
  subscriptionSessions: () => [...paymentKeys.all, 'subscriptionSessions'] as const,
  checkout: () => [...paymentKeys.all, 'checkout'] as const,
  confirmation: () => [...paymentKeys.all, 'confirmation'] as const,
  subscription: () => [...paymentKeys.all, 'subscription'] as const,
  pricing: () => [...paymentKeys.all, 'pricing'] as const,
};

/**
 * Hook for creating a Stripe Checkout session
 * 
 * This hook handles the creation of Stripe Checkout sessions for profile completion payments.
 * It returns the checkout URL that users will be redirected to for payment processing.
 * 
 * @example
 * ```tsx
 * import { useCreateCheckoutSession } from '../hooks/api';
 * 
 * const MyComponent = () => {
 *   const { mutateAsync: createCheckoutSession, isPending, error } = useCreateCheckoutSession();
 *   
 *   const handlePayment = async () => {
 *     try {
 *       const response = await createCheckoutSession({
 *         amount: 999, // $9.99 in cents
 *         currency: 'usd',
 *         successUrl: 'https://myapp.com/success',
 *         cancelUrl: 'https://myapp.com/cancel'
 *       });
 *       window.location.href = response.data.checkoutUrl;
 *     } catch (error) {
 *       console.error('Checkout session creation failed:', error);
 *     }
 *   };
 *   
 *   return (
 *     <button onClick={handlePayment} disabled={isPending}>
 *       {isPending ? 'Creating session...' : 'Pay Now'}
 *     </button>
 *   );
 * };
 */
export const useCreateCheckoutSession = () => {
  return useMutation<
    IServerResponse<CheckoutSessionResponse>,
    Error,
    CreateCheckoutSessionRequest
  >({
    mutationFn: async (data: CreateCheckoutSessionRequest) => {
      console.log("🎯 useCreateCheckoutSession: Mutation started");
      console.log("📊 Hook request data:", data);
      
      try {
        const result = await paymentService.createCheckoutSession(data);
        
        console.log("✅ useCreateCheckoutSession: Mutation successful");
        console.log("🎉 Hook result:", {
          status: result.status,
          hasData: !!result.data,
          timestamp: new Date().toISOString()
        });
        
        return result;
      } catch (error) {
        console.error("💥 useCreateCheckoutSession: Mutation failed");
        console.error("🔍 Hook error:", {
          error: (error as Error).message,
          stack: (error as Error).stack,
          requestData: data,
          timestamp: new Date().toISOString()
        });
        
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      console.log("🎊 useCreateCheckoutSession: onSuccess callback");
      console.log("📈 Success data:", {
        status: data.status,
        checkoutUrl: data.data?.checkoutUrl,
        transactionStatus: data.data?.transactionStatus,
        variables,
        timestamp: new Date().toISOString()
      });
    },
    onError: (error, variables) => {
      console.error("💔 useCreateCheckoutSession: onError callback");
      console.error("📉 Error details:", {
        error: error.message,
        variables,
        timestamp: new Date().toISOString()
      });
    },
    onSettled: (data, error, variables) => {
      console.log("🏁 useCreateCheckoutSession: onSettled callback");
      console.log("📋 Settlement details:", {
        success: !!data && !error,
        hasData: !!data,
        hasError: !!error,
        variables,
        timestamp: new Date().toISOString()
      });
    }
  });
};

/**
 * Hook for confirming a payment
 * 
 * This hook can be used to handle post-payment confirmation if needed.
 * With session-based checkout, this is typically handled by Stripe webhooks.
 * 
 * @example
 * ```tsx
 * import { useConfirmPayment } from '../hooks/api';
 * 
 * const MyComponent = () => {
 *   const { mutateAsync: confirmPayment, isPending } = useConfirmPayment();
 *   
 *   const handleConfirmPayment = async (sessionId: string) => {
 *     try {
 *       const response = await confirmPayment(sessionId);
 *       console.log('Payment confirmed:', response.data.message);
 *     } catch (error) {
 *       console.error('Payment confirmation failed:', error);
 *     }
 *   };
 *   
 *   return (
 *     <button onClick={() => handleConfirmPayment('session_id')} disabled={isPending}>
 *       {isPending ? 'Confirming...' : 'Confirm Payment'}
 *     </button>
 *   );
 * };
 */
export const useConfirmPayment = () => {
  return useMutation<
    IServerResponse<PaymentConfirmationResponse>,
    Error,
    string
  >({
    mutationFn: async (sessionId: string) => {
      console.log("🔐 useConfirmPayment: Mutation started");
      console.log("🆔 Hook session ID:", sessionId);
      
      try {
        const result = await paymentService.confirmPayment(sessionId);
        
        console.log("✅ useConfirmPayment: Mutation successful");
        console.log("🎉 Hook confirmation result:", {
          status: result.status,
          success: result.data?.success,
          message: result.data?.message,
          timestamp: new Date().toISOString()
        });
        
        return result;
      } catch (error) {
        console.error("💥 useConfirmPayment: Mutation failed");
        console.error("🔍 Hook confirmation error:", {
          error: (error as Error).message,
          stack: (error as Error).stack,
          sessionId,
          timestamp: new Date().toISOString()
        });
        
        throw error;
      }
    },
    onSuccess: (data, sessionId) => {
      console.log("🎊 useConfirmPayment: onSuccess callback");
      console.log("📈 Confirmation success:", {
        status: data.status,
        success: data.data?.success,
        message: data.data?.message,
        sessionId,
        timestamp: new Date().toISOString()
      });
    },
    onError: (error, sessionId) => {
      console.error("💔 useConfirmPayment: onError callback");
      console.error("📉 Confirmation error:", {
        error: error.message,
        sessionId,
        timestamp: new Date().toISOString()
      });
    },
    onSettled: (data, error, sessionId) => {
      console.log("🏁 useConfirmPayment: onSettled callback");
      console.log("📋 Confirmation settlement:", {
        success: !!data && !error,
        hasData: !!data,
        hasError: !!error,
        sessionId,
        timestamp: new Date().toISOString()
      });
    }
  });
};

/**
 * Hook for creating a Stripe Checkout session for premium subscription
 */
export const useCreateSubscriptionSession = () => {
  return useMutation<
    IServerResponse<CheckoutSessionResponse>,
    Error,
    CreateCheckoutSessionRequest
  >({
    mutationFn: async (data: CreateCheckoutSessionRequest) => {
      console.log("🎯 useCreateSubscriptionSession: Mutation started");
      console.log("📊 Hook request data:", data);

      try {
        const result = await paymentService.createSubscriptionSession(data);

        console.log("✅ useCreateSubscriptionSession: Mutation successful");
        console.log("🎉 Hook result:", {
          status: result.status,
          hasData: !!result.data,
          timestamp: new Date().toISOString(),
        });

        return result;
      } catch (error) {
        console.error("💥 useCreateSubscriptionSession: Mutation failed");
        console.error("🔍 Hook error:", {
          error: (error as Error).message,
          stack: (error as Error).stack,
          requestData: data,
          timestamp: new Date().toISOString(),
        });

        throw error;
      }
    },
    onSuccess: (data, variables) => {
      console.log("🎊 useCreateSubscriptionSession: onSuccess callback");
      console.log("📈 Success data:", {
        status: data.status,
        checkoutUrl: data.data?.checkoutUrl,
        transactionStatus: data.data?.transactionStatus,
        variables,
        timestamp: new Date().toISOString(),
      });
    },
    onError: (error, variables) => {
      console.error("💔 useCreateSubscriptionSession: onError callback");
      console.error("📉 Error details:", {
        error: error.message,
        variables,
        timestamp: new Date().toISOString(),
      });
    },
    onSettled: (data, error, variables) => {
      console.log("🏁 useCreateSubscriptionSession: onSettled callback");
      console.log("📋 Settlement details:", {
        success: !!data && !error,
        hasData: !!data,
        hasError: !!error,
        variables,
        timestamp: new Date().toISOString(),
      });
    },
  });
};

export const usePricing = () => {
  return useQuery({
    queryKey: paymentKeys.pricing(),
    queryFn: () => paymentService.getCurrentPricing(),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });
}; 