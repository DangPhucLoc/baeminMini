import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { UserService } from './user/userService'
import { GlobalExceptionFilter } from './filters/globalException'
import { PrismaExceptionFilter } from './filters/prismaException'
import { ResponseInterceptor } from './interceptors/responseInterceptor'
import { ValidationPipe } from '@nestjs/common'


async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  app.useGlobalFilters(new GlobalExceptionFilter(), new PrismaExceptionFilter())
  app.useGlobalInterceptors(new ResponseInterceptor())
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  const config = new DocumentBuilder()
    .setTitle('Mini Baemin')
    .setDescription('Food Ordering App')
    .setVersion('1.0')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  const userService = app.get(UserService)
  await userService.createManagerIfNotExists()

  await app.listen(3000)
}
bootstrap()