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
      
      exception = JSON.parse(JSON.stringify(exception));
      console.log(exception);
      
      request.flash('message', exception.response.message);
      response.redirect('/admin/category/add');
    }
  }
  