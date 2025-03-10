import { Connection } from '@solana/web3.js';
import { MarginfiClient } from '../lib/marginfi-client';
import { Environment } from '../lib/types';

let marginfiClient: MarginfiClient | null = null;

/**
 * Initialize all services required by the application
 */
export const initializeServices = async (): Promise<void> => {
  try {
    console.log('Initializing services...');
    
    // Initialize Solana connection
    const connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com');
    
    // Initialize MarginFi client
    marginfiClient = await MarginfiClient.connect(
      connection,
      process.env.MARGINFI_ENV as Environment || 'mainnet'
    );
    
    console.log('Services initialized successfully');
  } catch (error) {
    console.error('Error initializing services:', error);
    throw error;
  }
};

/**
 * Get the MarginFi client instance
 */
export const getMarginfiClient = (): MarginfiClient => {
  if (!marginfiClient) {
    throw new Error('MarginFi client not initialized');
  }
  return marginfiClient;
};