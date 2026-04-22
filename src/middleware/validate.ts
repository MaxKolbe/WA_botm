// middle ware to validate user input and redirect to appropriate route
import z from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validate =
  <T>(schema: z.ZodType<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
    });

    if (result.success === false) {
       next();
    } else {
        return res.redirect('/webhook/broadcast');
    }
  };
