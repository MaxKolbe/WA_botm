import { Router } from 'express';
import { botRequests, broadcastController } from './bot.controller.js';
import { messageSchema } from './bot.schema.js';
import { validate } from '../../middleware/validate.js';

const botRouter = Router();

// Webhook for Twilio
botRouter.post('/', validate(messageSchema), botRequests);
botRouter.post(
  '/broadcast',
  /**Write authtication function to check if the user is an employee and an admin */
  broadcastController,
);

export default botRouter;
