import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private hello: string = 'Hello World!';

  public getHello(): string {
    return this.hello;
  }
}
