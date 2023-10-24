import type { DynamicModule, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { EmailService } from "../email/email.service";
import { AuthController } from "./auth.controller";
import { AuthMiddleware } from "./auth.middleware";
import type { AuthModuleConfig} from "./config.interface";
import { ConfigInjectionToken } from "./config.interface";
import { SupertokensService } from "./supertokens/supertokens.service";

@Module({
  imports: [JwtModule.register({})],
  providers: [SupertokensService, EmailService],
  exports: [],
  controllers: [],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes("*");
  }

  static forRoot({ connectionURI, apiKey, appInfo }: AuthModuleConfig): DynamicModule {
    return {
      providers: [
        {
          useValue: {
            appInfo,
            connectionURI,
            apiKey,
          },
          provide: ConfigInjectionToken,
        },
        SupertokensService,
      ],
      controllers: [AuthController],
      exports: [],
      imports: [],
      module: AuthModule,
    };
  }
}
