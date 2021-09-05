import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as passport from 'passport';
import flash = require('connect-flash');
import expressLayouts = require('express-ejs-layouts');
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(
    session({
      secret: 'my-secret',
      resave: true,
      saveUninitialized: false
    })
  );

  app.useGlobalPipes(new ValidationPipe());
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  app.set('layout', 'admin/layout/main', 'static/layout/main')
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  app.use(expressLayouts);
  await app.listen(3000);
}
bootstrap();
