import { Express, Request, Response } from 'express';
import { PublicKey } from '@solana/web3.js';
import { getMarginfiClient } from '../services';

/**
 * Setup bank-related routes
 * @param app Express application
 * @param apiPrefix API prefix
 */
export const setupBankRoutes = (app: Express, apiPrefix: string): void => {
  /**
   * @route GET /api/v1/banks
   * @description Get all banks
   * @access Public
   */
  app.get(`${apiPrefix}/banks`, async (req: Request, res: Response) => {
    try {
      const marginfiClient = getMarginfiClient();
      const banks = await marginfiClient.getAllBanks();
      
      res.status(200).json({
        success: true,
        data: banks.map(bank => ({
          address: bank.address.toString(),
          mint: bank.mint.toString(),
          tokenSymbol: bank.tokenSymbol,
          tokenName: bank.tokenName,
          tokenDecimals: bank.tokenDecimals,
          assetShareValue: bank.assetShareValue.toString(),
          liabilityShareValue: bank.liabilityShareValue.toString(),
          depositLimit: bank.depositLimit.toString(),
          borrowLimit: bank.borrowLimit.toString(),
          depositRate: bank.depositRate.toString(),
          borrowRate: bank.borrowRate.toString(),
          totalAssets: bank.totalAssets.toString(),
          totalLiabilities: bank.totalLiabilities.toString(),
          price: bank.price.toString(),
          isActive: bank.isActive,
        })),
      });
    } catch (error) {
      console.error('Error fetching banks:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch banks',
      });
    }
  });

  /**
   * @route GET /api/v1/banks/:address
   * @description Get a bank by its address
   * @access Public
   */
  app.get(`${apiPrefix}/banks/:address`, async (req: Request, res: Response) => {
    try {
      const { address } = req.params;
      
      if (!address) {
        return res.status(400).json({
          success: false,
          error: 'Bank address is required',
        });
      }
      
      let bankAddress: PublicKey;
      try {
        bankAddress = new PublicKey(address);
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: 'Invalid bank address',
        });
      }
      
      const marginfiClient = getMarginfiClient();
      const bank = await marginfiClient.getBankByAddress(bankAddress);
      
      if (!bank) {
        return res.status(404).json({
          success: false,
          error: 'Bank not found',
        });
      }
      
      res.status(200).json({
        success: true,
        data: {
          address: bank.address.toString(),
          mint: bank.mint.toString(),
          tokenSymbol: bank.tokenSymbol,
          tokenName: bank.tokenName,
          tokenDecimals: bank.tokenDecimals,
          assetShareValue: bank.assetShareValue.toString(),
          liabilityShareValue: bank.liabilityShareValue.toString(),
          depositLimit: bank.depositLimit.toString(),
          borrowLimit: bank.borrowLimit.toString(),
          depositRate: bank.depositRate.toString(),
          borrowRate: bank.borrowRate.toString(),
          totalAssets: bank.totalAssets.toString(),
          totalLiabilities: bank.totalLiabilities.toString(),
          price: bank.price.toString(),
          isActive: bank.isActive,
        },
      });
    } catch (error) {
      console.error('Error fetching bank:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch bank',
      });
    }
  });

  /**
   * @route GET /api/v1/banks/symbol/:symbol
   * @description Get a bank by its token symbol
   * @access Public
   */
  app.get(`${apiPrefix}/banks/symbol/:symbol`, async (req: Request, res: Response) => {
    try {
      const { symbol } = req.params;
      
      if (!symbol) {
        return res.status(400).json({
          success: false,
          error: 'Token symbol is required',
        });
      }
      
      const marginfiClient = getMarginfiClient();
      const bank = await marginfiClient.getBankBySymbol(symbol);
      
      if (!bank) {
        return res.status(404).json({
          success: false,
          error: 'Bank not found',
        });
      }
      
      res.status(200).json({
        success: true,
        data: {
          address: bank.address.toString(),
          mint: bank.mint.toString(),
          tokenSymbol: bank.tokenSymbol,
          tokenName: bank.tokenName,
          tokenDecimals: bank.tokenDecimals,
          assetShareValue: bank.assetShareValue.toString(),
          liabilityShareValue: bank.liabilityShareValue.toString(),
          depositLimit: bank.depositLimit.toString(),
          borrowLimit: bank.borrowLimit.toString(),
          depositRate: bank.depositRate.toString(),
          borrowRate: bank.borrowRate.toString(),
          totalAssets: bank.totalAssets.toString(),
          totalLiabilities: bank.totalLiabilities.toString(),
          price: bank.price.toString(),
          isActive: bank.isActive,
        },
      });
    } catch (error) {
      console.error('Error fetching bank:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch bank',
      });
    }
  });
};