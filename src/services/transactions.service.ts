import { request } from '../hooks/api/http.client';
import API_ENDPOINTS from '../hooks/api/api.endpoints';
import type { IServerResponse } from '../models/serverResponse.model';

/**
 * Transaction interface based on the backend schema
 */
export interface Transaction {
  id: string;
  college: {
    id: string;
    name: string;
  };
  amount: number;
  paymentType: 'post' | 'subscription';
  status: 'success' | 'failed';
  transactionDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Transactions Service
 * 
 * Handles all transaction-related operations including:
 * - Fetching user transactions
 * - Getting transaction history
 */
class TransactionsService {
  /**
   * Get all transactions for the current user
   * 
   * @returns Promise with the user's transaction history
   */
  async getAllTransactions(): Promise<IServerResponse<{transactions: Transaction[], totalDocs: number}>> {
    return request<{transactions: Transaction[], totalDocs: number}>({
      url: API_ENDPOINTS.transactions.all,
      method: 'GET'
    });
  }
}

// Export as a singleton
export const transactionsService = new TransactionsService(); 