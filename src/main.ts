import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as passport from 'passport';
import flash = require('connect-flash');
import expressLayouts = require('express-ejs-layouts');
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'typeorm';
import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.use(
    session({
      secret: 'my-secret',
      resave: true,
      saveUninitialized: false
    })
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(cookieParser());
  // app.use(csurf({cookie: true}));

  app.useGlobalPipes(new ValidationPipe());
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  app.set('layout', 'admin/layout/main', 'static/layout/main')
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  app.use(expressLayouts);
  app.use(function(req, res, next) {
    res.locals.user = req.user;
    // res.locals.csrfToken = req.csrfToken(),
    res.locals.csrfToken = '',
    next();
  });
  await app.listen(3000);
}
bootstrap();
