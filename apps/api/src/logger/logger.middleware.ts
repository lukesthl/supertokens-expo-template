import type { NestMiddleware } from "@nestjs/common";
import { Injectable, Logger } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger("HTTP");

  use(request: Request, response: Response, next: NextFunction): void {
    const { method } = request;
    const ip = request.get("X-Real-IP") ?? request.ip;
    const userAgent = request.get("user-agent") ?? "";
    response.on("close", () => {
      const { statusCode } = response;
      const contentLength = response.get("content-length");
      const messsage = `${method} ${
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        request.baseUrl || request.route?.path || request.path
      } ${statusCode} ${contentLength} - ${userAgent} ${ip}`;
      if (statusCode >= 200 && statusCode < 400) {
        this.logger.log(messsage);
      } else {
        this.logger.error(messsage);
      }
    });

    next();
  }
}
