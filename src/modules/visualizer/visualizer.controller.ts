import { Request, Response } from 'express';
import { getStats } from './visualizer.service.js';

export const statsController = async (req: Request, res: Response) => {
  const {query} = req.query as any
  const response = await getStats(query);

  res.render('visualizer', {
    labels: response.data.labels,
    values: response.data.values,
  });
};
