import { Router } from 'express';
import { botRequests, broadcastController } from './bot.controller.js';
import { messageSchema } from './bot.schema.js';
import { validate } from '../../middleware/validate.js';
import { verifyAdminandPermissions } from "../../middleware/verify.js"

const botRouter = Router();

// Webhook for Twilio
botRouter.post('/', validate(messageSchema), botRequests);
botRouter.post(
  '/broadcast',
  verifyAdminandPermissions(),
  broadcastController,
);

export default botRouter;
