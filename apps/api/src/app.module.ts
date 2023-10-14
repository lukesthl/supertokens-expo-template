import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './logger/logger.middleware';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    AuthModule.forRoot({
      connectionURI: process.env.SUPERTOKENS_CONNECTION_URI,
      apiKey: process.env.SUPERTOKENS_API_KEY,
      appInfo: {
        appName: 'SuperTokens Managed Service',
        apiDomain: process.env.API_DOMAIN,
        // only used for email links
        websiteDomain: process.env.API_DOMAIN,
        apiBasePath: '/auth',
        websiteBasePath: '/auth',
      },
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
