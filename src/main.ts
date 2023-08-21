import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { HttpStatus, RequestMethod, ValidationPipe } from "@nestjs/common";

import { AppModule } from "./app.module";
import { NestFactory } from "@nestjs/core";



function configSwagger(app) {
  const config = new DocumentBuilder().addBearerAuth().setTitle("GA Script").setVersion("1.0").build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
}


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.setGlobalPrefix("api", {
    exclude: [{ path: "/", method: RequestMethod.GET }]
  });

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true
    })
  );

  configSwagger(app);

  const port = process.env.PORT || 8000;
  await app.listen(port);

}

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   const config = new DocumentBuilder()
//     .setTitle('GA Script')
//     .setDescription('We can get google analytics data, with session, views, and users')
//     .setVersion('1.0')
//     .build();
//   const document = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup('api', app, document);
//   await app.listen(3000);
// }
bootstrap();
