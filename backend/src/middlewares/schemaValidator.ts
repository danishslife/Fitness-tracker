import type { Request, Response, NextFunction } from "express";
import z from "zod";

export const validateBody = (schema: z.ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const message =
        result.error.issues.map((issue) => issue.message).join(", ") ||
        "Invalid request";
      return res.status(400).json({ message });
    }

    // Overwrite req.body with the sanitized/parsed data (removes unregistered fields)
    req.body = result.data;
    next();
  };
};
