import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      name: 'Gaming Rooms API',
      status: 'ok',
    };
  }
}
