import { Express } from 'express';
import { setupBankRoutes } from './bank.controller';
import { setupAccountRoutes } from './account.controller';
import { setupPriceRoutes } from './price.controller';

/**
 * Setup all API routes
 * @param app Express application
 */
export const setupRoutes = (app: Express): void => {
  // API version prefix
  const apiPrefix = '/api/v1';
  
  // Setup routes for each controller
  setupBankRoutes(app, apiPrefix);
  setupAccountRoutes(app, apiPrefix);
  setupPriceRoutes(app, apiPrefix);
  
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });
};