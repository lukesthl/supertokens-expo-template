import {
  MiddlewareConsumer,
  Module,
  NestModule,
  DynamicModule,
} from '@nestjs/common';

import { ConfigInjectionToken, AuthModuleConfig } from './config.interface';
import { SupertokensService } from './supertokens/supertokens.service';
import { AuthMiddleware } from './auth.middleware';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [SupertokensService, EmailService],
  exports: [],
  controllers: [],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }

  static forRoot({
    connectionURI,
    apiKey,
    appInfo,
  }: AuthModuleConfig): DynamicModule {
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
