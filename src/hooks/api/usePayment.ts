import { useMutation, useQuery } from '@tanstack/react-query';
import { paymentService } from '../../services/payment.service';
import type { 
  CreateCheckoutSessionRequest, 
  CheckoutSessionResponse, 
  PaymentConfirmationResponse,
  CancelSubscriptionResponse
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
  subscriptionStatus: () => [...paymentKeys.all, 'subscriptionStatus'] as const,
  cancelSubscription: () => [...paymentKeys.all, 'cancelSubscription'] as const,
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
 
 
      
      try {
        const result = await paymentService.createCheckoutSession(data);
        
 
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

export const useConfirmPayment = () => {
  return useMutation<
    IServerResponse<PaymentConfirmationResponse>,
    Error,
    string
  >({
    mutationFn: async (sessionId: string) => {
 
 
      
      try {
        const result = await paymentService.confirmPayment(sessionId);
        
 
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
 
 

      try {
        const result = await paymentService.createSubscriptionSession(data);

 
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

/**
 * Hook for fetching subscription status including auto-renewal status
 * 
 * This hook fetches the current subscription status to determine if the user
 * has an active subscription and if auto-renewal is enabled.
 * 
 * @example
 * ```tsx
 * import { useSubscriptionStatus } from '../hooks/api';
 * 
 * const MyComponent = () => {
 *   const { data: subscriptionStatus, isLoading, error } = useSubscriptionStatus();
 *   
 *   if (isLoading) return <div>Loading subscription status...</div>;
 *   if (error) return <div>Error loading subscription status</div>;
 *   
 *   const canCancel = subscriptionStatus?.data.isSubscribed && subscriptionStatus?.data.isAutoRenewalOn;
 *   
 *   return (
 *     <div>
 *       <p>Subscribed: {subscriptionStatus?.data.isSubscribed ? 'Yes' : 'No'}</p>
 *       <p>Auto-renewal: {subscriptionStatus?.data.isAutoRenewalOn ? 'On' : 'Off'}</p>
 *       {canCancel && <button>Cancel Subscription</button>}
 *     </div>
 *   );
 * };
 */
export const useSubscriptionStatus = () => {
  return useQuery({
    queryKey: paymentKeys.subscriptionStatus(),
    queryFn: () => paymentService.getSubscriptionStatus(), 
    refetchOnWindowFocus: true,
    retry: 1, // Only retry once on failure
  });
};


export const useCancelSubscription = () => {
  return useMutation<
    IServerResponse<CancelSubscriptionResponse>,
    Error,
    void
  >({
    mutationFn: async () => {
 
      
      try {
        const result = await paymentService.cancelSubscription();
        
 
        console.log("🎉 Hook cancellation result:", {
          status: result.status,
          success: result.data?.success,
          message: result.data?.message,
          canceledAt: result.data?.canceledAt,
          timestamp: new Date().toISOString()
        });
        
        return result;
      } catch (error) {
        console.error("💥 useCancelSubscription: Mutation failed");
        console.error("🔍 Hook cancellation error:", {
          error: (error as Error).message,
          stack: (error as Error).stack,
          timestamp: new Date().toISOString()
        });
        
        throw error;
      }
    },
    onSuccess: (data) => {
 
      console.log("📈 Cancellation success:", {
        status: data.status,
        success: data.data?.success,
        message: data.data?.message,
        canceledAt: data.data?.canceledAt,
        timestamp: new Date().toISOString()
      });
    },
    onError: (error) => {
      console.error("💔 useCancelSubscription: onError callback");
      console.error("📉 Cancellation error:", {
        error: error.message,
        timestamp: new Date().toISOString()
      });
    },
    onSettled: (data, error) => {
 
      console.log("📋 Cancellation settlement:", {
        success: !!data && !error,
        hasData: !!data,
        hasError: !!error,
        timestamp: new Date().toISOString()
      });
    }
  });
}; 