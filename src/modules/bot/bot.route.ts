import { Router } from 'express';
import { botRequests } from './bot.controller.js';

const botRouter = Router();

// Webhook for Twilio
botRouter.post('/', botRequests);

export default botRouter;
