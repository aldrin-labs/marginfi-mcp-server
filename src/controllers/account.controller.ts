import { Express, Request, Response } from 'express';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { getMarginfiClient } from '../services';

/**
 * Setup account-related routes
 * @param app Express application
 * @param apiPrefix API prefix
 */
export const setupAccountRoutes = (app: Express, apiPrefix: string): void => {
  /**
   * @route GET /api/v1/accounts/:authority
   * @description Get all accounts for a user
   * @access Public
   */
  app.get(`${apiPrefix}/accounts/:authority`, async (req: Request, res: Response) => {
    try {
      const { authority } = req.params;
      
      if (!authority) {
        return res.status(400).json({
          success: false,
          error: 'Authority address is required',
        });
      }
      
      let authorityAddress: PublicKey;
      try {
        authorityAddress = new PublicKey(authority);
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: 'Invalid authority address',
        });
      }
      
      const marginfiClient = getMarginfiClient();
      const accounts = await marginfiClient.getMarginfiAccountsForAuthority(authorityAddress);
      
      res.status(200).json({
        success: true,
        data: accounts.map(account => ({
          address: account.address.toString(),
          authority: account.authority.toString(),
          balances: account.balances.map(balance => ({
            bankAddress: balance.bankAddress.toString(),
            tokenSymbol: balance.tokenSymbol,
            tokenName: balance.tokenName,
            tokenDecimals: balance.tokenDecimals,
            assetShares: balance.assetShares.toString(),
            liabilityShares: balance.liabilityShares.toString(),
            assetAmount: balance.assetAmount.toString(),
            liabilityAmount: balance.liabilityAmount.toString(),
            price: balance.price.toString(),
          })),
          healthFactor: account.healthFactor.toString(),
          equity: account.equity.toString(),
          assets: account.assets.toString(),
          liabilities: account.liabilities.toString(),
        })),
      });
    } catch (error) {
      console.error('Error fetching accounts:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch accounts',
      });
    }
  });

  /**
   * @route GET /api/v1/accounts/address/:address
   * @description Get an account by its address
   * @access Public
   */
  app.get(`${apiPrefix}/accounts/address/:address`, async (req: Request, res: Response) => {
    try {
      const { address } = req.params;
      
      if (!address) {
        return res.status(400).json({
          success: false,
          error: 'Account address is required',
        });
      }
      
      let accountAddress: PublicKey;
      try {
        accountAddress = new PublicKey(address);
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: 'Invalid account address',
        });
      }
      
      const marginfiClient = getMarginfiClient();
      const account = await marginfiClient.getMarginfiAccountByAddress(accountAddress);
      
      if (!account) {
        return res.status(404).json({
          success: false,
          error: 'Account not found',
        });
      }
      
      res.status(200).json({
        success: true,
        data: {
          address: account.address.toString(),
          authority: account.authority.toString(),
          balances: account.balances.map(balance => ({
            bankAddress: balance.bankAddress.toString(),
            tokenSymbol: balance.tokenSymbol,
            tokenName: balance.tokenName,
            tokenDecimals: balance.tokenDecimals,
            assetShares: balance.assetShares.toString(),
            liabilityShares: balance.liabilityShares.toString(),
            assetAmount: balance.assetAmount.toString(),
            liabilityAmount: balance.liabilityAmount.toString(),
            price: balance.price.toString(),
          })),
          healthFactor: account.healthFactor.toString(),
          equity: account.equity.toString(),
          assets: account.assets.toString(),
          liabilities: account.liabilities.toString(),
        },
      });
    } catch (error) {
      console.error('Error fetching account:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch account',
      });
    }
  });

  /**
   * @route POST /api/v1/accounts
   * @description Create a new account
   * @access Public
   */
  app.post(`${apiPrefix}/accounts`, async (req: Request, res: Response) => {
    try {
      const { authority } = req.body;
      
      if (!authority) {
        return res.status(400).json({
          success: false,
          error: 'Authority address is required',
        });
      }
      
      let authorityAddress: PublicKey;
      try {
        authorityAddress = new PublicKey(authority);
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: 'Invalid authority address',
        });
      }
      
      const marginfiClient = getMarginfiClient();
      const account = await marginfiClient.createMarginfiAccount(authorityAddress);
      
      res.status(201).json({
        success: true,
        data: {
          address: account.address.toString(),
          authority: account.authority.toString(),
          balances: account.balances.map(balance => ({
            bankAddress: balance.bankAddress.toString(),
            tokenSymbol: balance.tokenSymbol,
            tokenName: balance.tokenName,
            tokenDecimals: balance.tokenDecimals,
            assetShares: balance.assetShares.toString(),
            liabilityShares: balance.liabilityShares.toString(),
            assetAmount: balance.assetAmount.toString(),
            liabilityAmount: balance.liabilityAmount.toString(),
            price: balance.price.toString(),
          })),
          healthFactor: account.healthFactor.toString(),
          equity: account.equity.toString(),
          assets: account.assets.toString(),
          liabilities: account.liabilities.toString(),
        },
      });
    } catch (error) {
      console.error('Error creating account:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create account',
      });
    }
  });

  /**
   * @route POST /api/v1/accounts/:address/deposit
   * @description Deposit tokens into an account
   * @access Public
   */
  app.post(`${apiPrefix}/accounts/:address/deposit`, async (req: Request, res: Response) => {
    try {
      const { address } = req.params;
      const { bankAddress, amount } = req.body;
      
      if (!address) {
        return res.status(400).json({
          success: false,
          error: 'Account address is required',
        });
      }
      
      if (!bankAddress) {
        return res.status(400).json({
          success: false,
          error: 'Bank address is required',
        });
      }
      
      if (!amount) {
        return res.status(400).json({
          success: false,
          error: 'Amount is required',
        });
      }
      
      let accountAddress: PublicKey;
      try {
        accountAddress = new PublicKey(address);
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: 'Invalid account address',
        });
      }
      
      let bank: PublicKey;
      try {
        bank = new PublicKey(bankAddress);
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: 'Invalid bank address',
        });
      }
      
      const marginfiClient = getMarginfiClient();
      const account = await marginfiClient.deposit(
        accountAddress,
        bank,
        new BigNumber(amount)
      );
      
      res.status(200).json({
        success: true,
        data: {
          address: account.address.toString(),
          authority: account.authority.toString(),
          balances: account.balances.map(balance => ({
            bankAddress: balance.bankAddress.toString(),
            tokenSymbol: balance.tokenSymbol,
            tokenName: balance.tokenName,
            tokenDecimals: balance.tokenDecimals,
            assetShares: balance.assetShares.toString(),
            liabilityShares: balance.liabilityShares.toString(),
            assetAmount: balance.assetAmount.toString(),
            liabilityAmount: balance.liabilityAmount.toString(),
            price: balance.price.toString(),
          })),
          healthFactor: account.healthFactor.toString(),
          equity: account.equity.toString(),
          assets: account.assets.toString(),
          liabilities: account.liabilities.toString(),
        },
      });
    } catch (error) {
      console.error('Error depositing:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to deposit',
      });
    }
  });

  /**
   * @route POST /api/v1/accounts/:address/withdraw
   * @description Withdraw tokens from an account
   * @access Public
   */
  app.post(`${apiPrefix}/accounts/:address/withdraw`, async (req: Request, res: Response) => {
    try {
      const { address } = req.params;
      const { bankAddress, amount } = req.body;
      
      if (!address) {
        return res.status(400).json({
          success: false,
          error: 'Account address is required',
        });
      }
      
      if (!bankAddress) {
        return res.status(400).json({
          success: false,
          error: 'Bank address is required',
        });
      }
      
      if (!amount) {
        return res.status(400).json({
          success: false,
          error: 'Amount is required',
        });
      }
      
      let accountAddress: PublicKey;
      try {
        accountAddress = new PublicKey(address);
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: 'Invalid account address',
        });
      }
      
      let bank: PublicKey;
      try {
        bank = new PublicKey(bankAddress);
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: 'Invalid bank address',
        });
      }
      
      const marginfiClient = getMarginfiClient();
      const account = await marginfiClient.withdraw(
        accountAddress,
        bank,
        new BigNumber(amount)
      );
      
      res.status(200).json({
        success: true,
        data: {
          address: account.address.toString(),
          authority: account.authority.toString(),
          balances: account.balances.map(balance => ({
            bankAddress: balance.bankAddress.toString(),
            tokenSymbol: balance.tokenSymbol,
            tokenName: balance.tokenName,
            tokenDecimals: balance.tokenDecimals,
            assetShares: balance.assetShares.toString(),
            liabilityShares: balance.liabilityShares.toString(),
            assetAmount: balance.assetAmount.toString(),
            liabilityAmount: balance.liabilityAmount.toString(),
            price: balance.price.toString(),
          })),
          healthFactor: account.healthFactor.toString(),
          equity: account.equity.toString(),
          assets: account.assets.toString(),
          liabilities: account.liabilities.toString(),
        },
      });
    } catch (error) {
      console.error('Error withdrawing:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to withdraw',
      });
    }
  });

  /**
   * @route POST /api/v1/accounts/:address/borrow
   * @description Borrow tokens from an account
   * @access Public
   */
  app.post(`${apiPrefix}/accounts/:address/borrow`, async (req: Request, res: Response) => {
    try {
      const { address } = req.params;
      const { bankAddress, amount } = req.body;
      
      if (!address) {
        return res.status(400).json({
          success: false,
          error: 'Account address is required',
        });
      }
      
      if (!bankAddress) {
        return res.status(400).json({
          success: false,
          error: 'Bank address is required',
        });
      }
      
      if (!amount) {
        return res.status(400).json({
          success: false,
          error: 'Amount is required',
        });
      }
      
      let accountAddress: PublicKey;
      try {
        accountAddress = new PublicKey(address);
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: 'Invalid account address',
        });
      }
      
      let bank: PublicKey;
      try {
        bank = new PublicKey(bankAddress);
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: 'Invalid bank address',
        });
      }
      
      const marginfiClient = getMarginfiClient();
      const account = await marginfiClient.borrow(
        accountAddress,
        bank,
        new BigNumber(amount)
      );
      
      res.status(200).json({
        success: true,
        data: {
          address: account.address.toString(),
          authority: account.authority.toString(),
          balances: account.balances.map(balance => ({
            bankAddress: balance.bankAddress.toString(),
            tokenSymbol: balance.tokenSymbol,
            tokenName: balance.tokenName,
            tokenDecimals: balance.tokenDecimals,
            assetShares: balance.assetShares.toString(),
            liabilityShares: balance.liabilityShares.toString(),
            assetAmount: balance.assetAmount.toString(),
            liabilityAmount: balance.liabilityAmount.toString(),
            price: balance.price.toString(),
          })),
          healthFactor: account.healthFactor.toString(),
          equity: account.equity.toString(),
          assets: account.assets.toString(),
          liabilities: account.liabilities.toString(),
        },
      });
    } catch (error) {
      console.error('Error borrowing:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to borrow',
      });
    }
  });

  /**
   * @route POST /api/v1/accounts/:address/repay
   * @description Repay borrowed tokens
   * @access Public
   */
  app.post(`${apiPrefix}/accounts/:address/repay`, async (req: Request, res: Response) => {
    try {
      const { address } = req.params;
      const { bankAddress, amount } = req.body;
      
      if (!address) {
        return res.status(400).json({
          success: false,
          error: 'Account address is required',
        });
      }
      
      if (!bankAddress) {
        return res.status(400).json({
          success: false,
          error: 'Bank address is required',
        });
      }
      
      if (!amount) {
        return res.status(400).json({
          success: false,
          error: 'Amount is required',
        });
      }
      
      let accountAddress: PublicKey;
      try {
        accountAddress = new PublicKey(address);
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: 'Invalid account address',
        });
      }
      
      let bank: PublicKey;
      try {
        bank = new PublicKey(bankAddress);
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: 'Invalid bank address',
        });
      }
      
      const marginfiClient = getMarginfiClient();
      const account = await marginfiClient.repay(
        accountAddress,
        bank,
        new BigNumber(amount)
      );
      
      res.status(200).json({
        success: true,
        data: {
          address: account.address.toString(),
          authority: account.authority.toString(),
          balances: account.balances.map(balance => ({
            bankAddress: balance.bankAddress.toString(),
            tokenSymbol: balance.tokenSymbol,
            tokenName: balance.tokenName,
            tokenDecimals: balance.tokenDecimals,
            assetShares: balance.assetShares.toString(),
            liabilityShares: balance.liabilityShares.toString(),
            assetAmount: balance.assetAmount.toString(),
            liabilityAmount: balance.liabilityAmount.toString(),
            price: balance.price.toString(),
          })),
          healthFactor: account.healthFactor.toString(),
          equity: account.equity.toString(),
          assets: account.assets.toString(),
          liabilities: account.liabilities.toString(),
        },
      });
    } catch (error) {
      console.error('Error repaying:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to repay',
      });
    }
  });

  /**
   * @route POST /api/v1/accounts/:address/liquidate
   * @description Liquidate an account
   * @access Public
   */
  app.post(`${apiPrefix}/accounts/:address/liquidate`, async (req: Request, res: Response) => {
    try {
      const { address } = req.params;
      const { liquidateeAddress, assetBankAddress, liabilityBankAddress, amount } = req.body;
      
      if (!address) {
        return res.status(400).json({
          success: false,
          error: 'Liquidator account address is required',
        });
      }
      
      if (!liquidateeAddress) {
        return res.status(400).json({
          success: false,
          error: 'Liquidatee account address is required',
        });
      }
      
      if (!assetBankAddress) {
        return res.status(400).json({
          success: false,
          error: 'Asset bank address is required',
        });
      }
      
      if (!liabilityBankAddress) {
        return res.status(400).json({
          success: false,
          error: 'Liability bank address is required',
        });
      }
      
      if (!amount) {
        return res.status(400).json({
          success: false,
          error: 'Amount is required',
        });
      }
      
      let liquidatorAddress: PublicKey;
      try {
        liquidatorAddress = new PublicKey(address);
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: 'Invalid liquidator account address',
        });
      }
      
      let liquidatee: PublicKey;
      try {
        liquidatee = new PublicKey(liquidateeAddress);
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: 'Invalid liquidatee account address',
        });
      }
      
      let assetBank: PublicKey;
      try {
        assetBank = new PublicKey(assetBankAddress);
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: 'Invalid asset bank address',
        });
      }
      
      let liabilityBank: PublicKey;
      try {
        liabilityBank = new PublicKey(liabilityBankAddress);
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: 'Invalid liability bank address',
        });
      }
      
      const marginfiClient = getMarginfiClient();
      const account = await marginfiClient.liquidate(
        liquidatorAddress,
        liquidatee,
        assetBank,
        liabilityBank,
        new BigNumber(amount)
      );
      
      res.status(200).json({
        success: true,
        data: {
          address: account.address.toString(),
          authority: account.authority.toString(),
          balances: account.balances.map(balance => ({
            bankAddress: balance.bankAddress.toString(),
            tokenSymbol: balance.tokenSymbol,
            tokenName: balance.tokenName,
            tokenDecimals: balance.tokenDecimals,
            assetShares: balance.assetShares.toString(),
            liabilityShares: balance.liabilityShares.toString(),
            assetAmount: balance.assetAmount.toString(),
            liabilityAmount: balance.liabilityAmount.toString(),
            price: balance.price.toString(),
          })),
          healthFactor: account.healthFactor.toString(),
          equity: account.equity.toString(),
          assets: account.assets.toString(),
          liabilities: account.liabilities.toString(),
        },
      });
    } catch (error) {
      console.error('Error liquidating:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to liquidate',
      });
    }
  });
};