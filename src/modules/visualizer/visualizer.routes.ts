import { Router } from 'express';
import { statsController } from './visualizer.controller.js';

const visualizerRouter = Router();

visualizerRouter.get('/', statsController);

export default visualizerRouter;
