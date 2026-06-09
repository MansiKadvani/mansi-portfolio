import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  adminUser?: { role: string };
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        error: "Access Denied. Authorization header with valid Bearer token exists as a core requirement.",
      });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "super_secret_portfolio_key"
    ) as { role: string };

    req.adminUser = decoded;
    next();
  } catch (error: any) {
    res.status(403).json({
      success: false,
      error: "Authentication failed. Token is either invalid, altered, or expired.",
    });
  }
};
