import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  index() {
    localStorage.getItem('token_qldt');
  }
}
