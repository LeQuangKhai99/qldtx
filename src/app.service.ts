import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  index() {
    return {'mess': 'a'};
  }

  admin() {
    return {'test': 'a'};
  }
}
