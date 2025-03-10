import { Express, Request, Response } from 'express';
import { PublicKey } from '@solana/web3.js';
import { getMarginfiClient } from '../services';

/**
 * Setup price-related routes
 * @param app Express application
 * @param apiPrefix API prefix
 */
export const setupPriceRoutes = (app: Express, apiPrefix: string): void => {
  /**
   * @route GET /api/v1/prices/:mint
   * @description Get the price of a token by its mint address
   * @access Public
   */
  app.get(`${apiPrefix}/prices/:mint`, async (req: Request, res: Response) => {
    try {
      const { mint } = req.params;
      
      if (!mint) {
        return res.status(400).json({
          success: false,
          error: 'Mint address is required',
        });
      }
      
      let mintAddress: PublicKey;
      try {
        mintAddress = new PublicKey(mint);
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: 'Invalid mint address',
        });
      }
      
      const marginfiClient = getMarginfiClient();
      const price = await marginfiClient.getPrice(mintAddress);
      
      if (!price) {
        return res.status(404).json({
          success: false,
          error: 'Price not found',
        });
      }
      
      res.status(200).json({
        success: true,
        data: {
          price: price.price.toString(),
          timestamp: price.timestamp,
        },
      });
    } catch (error) {
      console.error('Error fetching price:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch price',
      });
    }
  });
};