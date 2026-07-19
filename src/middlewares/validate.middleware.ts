import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from '../utils/errors';

export function validate(schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const data = source === 'body' ? req.body : source === 'query' ? req.query : req.params;
    const result = schema.safeParse(data);

    if (!result.success) {
      const messages = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw new ValidationError(messages);
    }

    if (source === 'body') req.body = result.data;
    else if (source === 'query') (req as any).validatedQuery = result.data;
    else (req as any).validatedParams = result.data;

    next();
  };
}
