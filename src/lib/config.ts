import { PublicKey } from '@solana/web3.js';
import { Environment, MarginfiConfig } from './types';

// Program IDs for different environments
const MARGINFI_PROGRAM_ID = {
  mainnet: new PublicKey('MFv2hWf31Z9kbCa1snEPYctwafyhdvnV7FZnsebVacA'),
  devnet: new PublicKey('MFv2hWf31Z9kbCa1snEPYctwafyhdvnV7FZnsebVacA'),
  localnet: new PublicKey('MFv2hWf31Z9kbCa1snEPYctwafyhdvnV7FZnsebVacA'),
};

// Group IDs for different environments
const MARGINFI_GROUP_ID = {
  mainnet: new PublicKey('4qp6Fx6tnZkY5Wropq9wUYgtFxXKwE6viJRdmhBk8eQ2'),
  devnet: new PublicKey('4qp6Fx6tnZkY5Wropq9wUYgtFxXKwE6viJRdmhBk8eQ2'),
  localnet: new PublicKey('4qp6Fx6tnZkY5Wropq9wUYgtFxXKwE6viJRdmhBk8eQ2'),
};

/**
 * Get the MarginFi configuration for a specific environment
 * @param environment MarginFi environment
 * @returns MarginFi configuration
 */
export const getConfig = (environment: Environment): MarginfiConfig => {
  return {
    programId: MARGINFI_PROGRAM_ID[environment],
    groupPk: MARGINFI_GROUP_ID[environment],
    environment,
  };
};