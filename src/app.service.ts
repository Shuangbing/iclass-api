import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  apiVersion(): any {
    return { serivce: "iClass API v0.0.1" };
  }
}
