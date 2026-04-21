import { Router } from 'express';
import { botRequests } from './bot.controller.js';
import logger from '../../configs/logger.config.js';
const botRouter = Router();

// Webhook for Twilio
botRouter.post('/', botRequests);
botRouter.post('/broadcast', (req, res) => {
  logger.info('I AM IN BROADCASTS');
  return res.send(
    `<Response><Message>You hit the broadcast route Your message was ${req.body.Body}.</Message></Response>`,
  );
});

export default botRouter;
