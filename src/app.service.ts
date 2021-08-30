import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  index() {
    return 'home page';
  }

  admin() {
    return 'admin page';
  }
}
