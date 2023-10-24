import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import type { Response } from "express";
import { Error as STError } from "supertokens-node";
import { VerifySessionOptions } from "supertokens-node/recipe/session";
import { verifySession } from "supertokens-node/recipe/session/framework/express";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly verifyOptions?: VerifySessionOptions) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();

    let err: Response | undefined = undefined;
    const resp = ctx.getResponse<Response>();
    // You can create an optional version of this by passing {sessionRequired: false} to verifySession
    await verifySession(this.verifyOptions)(ctx.getRequest(), resp, (res) => {
      err = res as Response;
    });

    if (resp.headersSent) {
      throw new STError({
        message: "RESPONSE_SENT",
        type: "RESPONSE_SENT",
      });
    }

    if (err) {
      throw err;
    }

    return true;
  }
}
