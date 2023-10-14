import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import supertokens from 'supertokens-node';
import { SupertokensExceptionFilter } from './auth/filter/auth.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000'],
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });

  app.useStaticAssets(join(__dirname, '..', 'public'), {
    setHeaders: (res, path) => {
      if (!path.endsWith('json')) {
        res.set('Content-Type', 'application/json');
      }
    },
  });
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  app.useGlobalFilters(new SupertokensExceptionFilter());
  app.use(json({ limit: '5mb' }));
  app.use(urlencoded({ extended: true, limit: '5mb' }));
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
