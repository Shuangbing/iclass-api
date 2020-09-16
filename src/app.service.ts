import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  index(): any {
    return { serivce: "iClass API v0.0.1" };
  }
}
