import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  
  interface IRequestFlash extends Request {
    flash: any;
  }
  
  @Catch(HttpException)
  export class CateExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<IRequestFlash>();
      
      const err = JSON.parse(JSON.stringify(exception));
      
      exception = JSON.parse(JSON.stringify(exception));
      
      request.flash('message', exception);
      response.redirect('/admin/category/add');
    }
  }
  