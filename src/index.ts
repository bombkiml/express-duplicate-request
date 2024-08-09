import { Request, Response, NextFunction } from "express";
import { Store } from "./store";

/**
 * Error handling options
 * @param json - Javascript plain object to send to client if request is duplicated
 * @param statusCodes - Status code to send to the client if request is duplicated
 */
export type ErrorHandlingOptions = {
  json?: unknown;
  statusCode?: number;
};

/**
 * Property picker
 * @param req - The request object
 * @return The id
 */
export type PropertyPicker = (req: Request) => string;

/**
 * Error handling options
 * @param json - Javascript plain object to send to client if request is duplicated
 * @param statusCodes - Status code to send to the client if request is duplicated
 */
export type MiddlewareOptions = {
  expiration?: number;
  errorHandling?: ErrorHandlingOptions;
  property: string | PropertyPicker;
  prefix: string;
  connectionUri?: string;
};

/**
 * Generate specific the middleware function
 * @param options - Middleware options
 * @return The middleware function used by express
 */
function slowDown(options: MiddlewareOptions) {
  let store = new Store({
    expiration: options?.expiration ?? 300,
    prefix: options?.prefix
  });

  const RequestMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // If options.property is a function, gets is return value
    const id: string =
      typeof options.property === "function"
        ? options.property(req)
        : String(req.ip);
    const alreadyExists = await store.isRequestExists(id);
    if (alreadyExists) {
      const responseData: unknown = options?.errorHandling?.json ?? {
        code: 429,
        status: "REQUEST_ALREADY_SENT",
        success: false,
        info: {
          status: "SLOW_DOWN",
          message: "Slow down to Request."
        },
        message: "Request already sent."
      };
      const statusCode: number = options?.errorHandling?.statusCode ?? 429;

      res.status(statusCode).json(responseData);
    } else {
      // Don't wait for addRequest to finish, no await
      store.addRequest(id, false);
      next();
    }
  };
  return RequestMiddleware;
}

export { slowDown };
