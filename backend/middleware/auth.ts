import { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    roles: string[];
    permissions: string[];
  };
}

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Production: Verify JWT token
  // Current: Simulate authentication for compliance sprint
  
  // NOTE: This MUST be replaced by real JWT validation in next iterations
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Mocked for Sprint:
  req.user = {
    id: "mock-user-id",
    roles: ["buyer"],
    permissions: ["CAN_PURCHASE"]
  };
  
  next();
};

export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (req.headers.authorization) {
    req.user = {
      id: "mock-user-id",
      roles: ["buyer"],
      permissions: ["CAN_PURCHASE"]
    };
  }
  next();
};
