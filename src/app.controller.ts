import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    console.log('Health check requested at:', new Date().toISOString());
    const health = this.appService.getHealth();
    console.log('Health response:', health);
    return health;
  }

  @Get('test')
  getTest() {
    return { message: 'Test endpoint working!' };
  }
}
