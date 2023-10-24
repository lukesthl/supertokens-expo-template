import type { NestMiddleware } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import type { Request, Response } from "express";
import { middleware } from "supertokens-node/framework/express";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  supertokensMiddleware: ReturnType<typeof middleware>;

  constructor() {
    this.supertokensMiddleware = middleware();
  }

  use(req: Request, res: Response, next: () => void) {
    return this.supertokensMiddleware(req, res, next);
  }
}
