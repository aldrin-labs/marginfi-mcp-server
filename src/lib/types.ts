import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';

export type Environment = 'mainnet' | 'devnet' | 'localnet';

export interface MarginfiConfig {
  programId: PublicKey;
  groupPk: PublicKey;
  environment: Environment;
}

export interface Bank {
  address: PublicKey;
  mint: PublicKey;
  tokenSymbol: string;
  tokenName: string;
  tokenDecimals: number;
  assetShareValue: BigNumber;
  liabilityShareValue: BigNumber;
  depositLimit: BigNumber;
  borrowLimit: BigNumber;
  depositRate: BigNumber;
  borrowRate: BigNumber;
  totalAssets: BigNumber;
  totalLiabilities: BigNumber;
  price: BigNumber;
  isActive: boolean;
}

export interface MarginfiAccount {
  address: PublicKey;
  authority: PublicKey;
  balances: AccountBalance[];
  healthFactor: BigNumber;
  equity: BigNumber;
  assets: BigNumber;
  liabilities: BigNumber;
}

export interface AccountBalance {
  bankAddress: PublicKey;
  tokenSymbol: string;
  tokenName: string;
  tokenDecimals: number;
  assetShares: BigNumber;
  liabilityShares: BigNumber;
  assetAmount: BigNumber;
  liabilityAmount: BigNumber;
  price: BigNumber;
}

export interface OraclePrice {
  price: BigNumber;
  timestamp: number;
}

export enum MarginRequirementType {
  Initial = 'Initial',
  Maintenance = 'Maintenance',
  Equity = 'Equity',
}