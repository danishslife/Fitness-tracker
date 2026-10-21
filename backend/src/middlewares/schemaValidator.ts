import type { Request, Response, NextFunction } from "express";
import type { z } from "zod";

export const validateBody = (schema: z.ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const message =
        result.error.issues.map((issue) => issue.message).join(", ") ||
        "Invalid request";
      return res.status(400).json({ message });
    }

    req.body = result.data;
    next();
  };
};
