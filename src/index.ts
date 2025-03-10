import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { setupRoutes } from './controllers';
import { initializeServices } from './services';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Initialize services
initializeServices();

// Setup routes
setupRoutes(app);

// Start server
app.listen(PORT, () => {
  console.log(`MarginFi MCP Server running on port ${PORT}`);
});

export default app;