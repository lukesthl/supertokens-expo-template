import type { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
import { Catch } from "@nestjs/common";
import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { Error as STError } from "supertokens-node";
import { errorHandler } from "supertokens-node/framework/express";

@Catch(STError)
export class SupertokensExceptionFilter implements ExceptionFilter {
  handler: ErrorRequestHandler;

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.handler = errorHandler();
  }

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const resp = ctx.getResponse<Response>();
    if (resp.headersSent) {
      return;
    }

    this.handler(exception, ctx.getRequest<Request>(), resp, ctx.getNext<NextFunction>());
  }
}
