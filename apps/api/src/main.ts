import { join } from "path";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { json, urlencoded } from "express";
import supertokens from "supertokens-node";

import { AppModule } from "./app.module";
import { SupertokensExceptionFilter } from "./auth/filter/auth.filter";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: ["http://localhost:3000"],
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });

  app.useStaticAssets(join(__dirname, "..", "public"), {
    setHeaders: (res: NestExpressApplication, path) => {
      if (!path.endsWith("json")) {
        res.set("Content-Type", "application/json");
      }
    },
  });
  app.setBaseViewsDir(join(__dirname, "..", "views"));
  app.setViewEngine("hbs");
  app.useGlobalFilters(new SupertokensExceptionFilter());
  app.use(json({ limit: "5mb" }));
  app.use(urlencoded({ extended: true, limit: "5mb" }));
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
