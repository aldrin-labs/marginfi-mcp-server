import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { MarginfiClient } from '../../lib/marginfi-client';
import { Environment } from '../../lib/types';

// Mock the Connection class
jest.mock('@solana/web3.js', () => {
  const original = jest.requireActual('@solana/web3.js');
  return {
    ...original,
    Connection: jest.fn().mockImplementation(() => ({
      getAccountInfo: jest.fn().mockResolvedValue(null),
    })),
  };
});

// Mock the getConfig function
jest.mock('../../lib/config', () => ({
  getConfig: jest.fn().mockImplementation((environment: Environment) => ({
    programId: new PublicKey('MFv2hWf31Z9kbCa1snEPYctwafyhdvnV7FZnsebVacA'),
    groupPk: new PublicKey('4qp6Fx6tnZkY5Wropq9wUYgtFxXKwE6viJRdmhBk8eQ2'),
    environment,
  })),
}));

describe('MarginfiClient', () => {
  let connection: Connection;
  let marginfiClient: MarginfiClient;

  beforeEach(async () => {
    connection = new Connection('https://api.mainnet-beta.solana.com');
    marginfiClient = await MarginfiClient.connect(connection, 'mainnet');
  });

  describe('getAllBanks', () => {
    it('should return an array of banks', async () => {
      const banks = await marginfiClient.getAllBanks();
      
      expect(Array.isArray(banks)).toBe(true);
      expect(banks.length).toBeGreaterThan(0);
      
      const bank = banks[0];
      expect(bank.address).toBeInstanceOf(PublicKey);
      expect(bank.mint).toBeInstanceOf(PublicKey);
      expect(typeof bank.tokenSymbol).toBe('string');
      expect(typeof bank.tokenName).toBe('string');
      expect(typeof bank.tokenDecimals).toBe('number');
      expect(bank.assetShareValue).toBeInstanceOf(BigNumber);
      expect(bank.liabilityShareValue).toBeInstanceOf(BigNumber);
      expect(bank.depositLimit).toBeInstanceOf(BigNumber);
      expect(bank.borrowLimit).toBeInstanceOf(BigNumber);
      expect(bank.depositRate).toBeInstanceOf(BigNumber);
      expect(bank.borrowRate).toBeInstanceOf(BigNumber);
      expect(bank.totalAssets).toBeInstanceOf(BigNumber);
      expect(bank.totalLiabilities).toBeInstanceOf(BigNumber);
      expect(bank.price).toBeInstanceOf(BigNumber);
      expect(typeof bank.isActive).toBe('boolean');
    });
  });

  describe('getBankByAddress', () => {
    it('should return a bank by its address', async () => {
      const bankAddress = new PublicKey(Keypair.generate().publicKey);
      const bank = await marginfiClient.getBankByAddress(bankAddress);
      
      expect(bank).not.toBeNull();
      expect(bank?.address.equals(bankAddress)).toBe(true);
    });
  });

  describe('getBankBySymbol', () => {
    it('should return a bank by its symbol', async () => {
      const symbol = 'USDC';
      const bank = await marginfiClient.getBankBySymbol(symbol);
      
      expect(bank).not.toBeNull();
      expect(bank?.tokenSymbol).toBe(symbol);
    });
  });

  describe('getMarginfiAccountsForAuthority', () => {
    it('should return accounts for an authority', async () => {
      const authority = new PublicKey(Keypair.generate().publicKey);
      const accounts = await marginfiClient.getMarginfiAccountsForAuthority(authority);
      
      expect(Array.isArray(accounts)).toBe(true);
      expect(accounts.length).toBeGreaterThan(0);
      
      const account = accounts[0];
      expect(account.address).toBeInstanceOf(PublicKey);
      expect(account.authority.equals(authority)).toBe(true);
      expect(Array.isArray(account.balances)).toBe(true);
      expect(account.healthFactor).toBeInstanceOf(BigNumber);
      expect(account.equity).toBeInstanceOf(BigNumber);
      expect(account.assets).toBeInstanceOf(BigNumber);
      expect(account.liabilities).toBeInstanceOf(BigNumber);
    });
  });

  describe('getMarginfiAccountByAddress', () => {
    it('should return an account by its address', async () => {
      const accountAddress = new PublicKey(Keypair.generate().publicKey);
      const account = await marginfiClient.getMarginfiAccountByAddress(accountAddress);
      
      expect(account).not.toBeNull();
      expect(account?.address.equals(accountAddress)).toBe(true);
    });
  });

  describe('getPrice', () => {
    it('should return a price for a mint', async () => {
      const mint = new PublicKey(Keypair.generate().publicKey);
      const price = await marginfiClient.getPrice(mint);
      
      expect(price).not.toBeNull();
      expect(price?.price).toBeInstanceOf(BigNumber);
      expect(typeof price?.timestamp).toBe('number');
    });
  });

  describe('createMarginfiAccount', () => {
    it('should create a new account', async () => {
      const authority = new PublicKey(Keypair.generate().publicKey);
      const account = await marginfiClient.createMarginfiAccount(authority);
      
      expect(account).not.toBeNull();
      expect(account.authority.equals(authority)).toBe(true);
    });
  });

  describe('deposit', () => {
    it('should deposit tokens into an account', async () => {
      const accountAddress = new PublicKey(Keypair.generate().publicKey);
      const bankAddress = new PublicKey(Keypair.generate().publicKey);
      const amount = new BigNumber(100);
      
      const account = await marginfiClient.deposit(accountAddress, bankAddress, amount);
      
      expect(account).not.toBeNull();
      expect(account.address.equals(accountAddress)).toBe(true);
    });
  });

  describe('withdraw', () => {
    it('should withdraw tokens from an account', async () => {
      const accountAddress = new PublicKey(Keypair.generate().publicKey);
      const bankAddress = new PublicKey(Keypair.generate().publicKey);
      const amount = new BigNumber(50);
      
      const account = await marginfiClient.withdraw(accountAddress, bankAddress, amount);
      
      expect(account).not.toBeNull();
      expect(account.address.equals(accountAddress)).toBe(true);
    });
  });

  describe('borrow', () => {
    it('should borrow tokens from an account', async () => {
      const accountAddress = new PublicKey(Keypair.generate().publicKey);
      const bankAddress = new PublicKey(Keypair.generate().publicKey);
      const amount = new BigNumber(200);
      
      const account = await marginfiClient.borrow(accountAddress, bankAddress, amount);
      
      expect(account).not.toBeNull();
      expect(account.address.equals(accountAddress)).toBe(true);
    });
  });

  describe('repay', () => {
    it('should repay borrowed tokens', async () => {
      const accountAddress = new PublicKey(Keypair.generate().publicKey);
      const bankAddress = new PublicKey(Keypair.generate().publicKey);
      const amount = new BigNumber(150);
      
      const account = await marginfiClient.repay(accountAddress, bankAddress, amount);
      
      expect(account).not.toBeNull();
      expect(account.address.equals(accountAddress)).toBe(true);
    });
  });

  describe('liquidate', () => {
    it('should liquidate an account', async () => {
      const liquidatorAddress = new PublicKey(Keypair.generate().publicKey);
      const liquidateeAddress = new PublicKey(Keypair.generate().publicKey);
      const assetBankAddress = new PublicKey(Keypair.generate().publicKey);
      const liabilityBankAddress = new PublicKey(Keypair.generate().publicKey);
      const amount = new BigNumber(75);
      
      const account = await marginfiClient.liquidate(
        liquidatorAddress,
        liquidateeAddress,
        assetBankAddress,
        liabilityBankAddress,
        amount
      );
      
      expect(account).not.toBeNull();
      expect(account.address.equals(liquidatorAddress)).toBe(true);
    });
  });
});