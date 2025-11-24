import { Router } from 'express';
import { botRequests } from '../../controllers/botController.js';

const botRouter = Router();

// Webhook for Twilio
botRouter.post('/', botRequests);

export default botRouter;
