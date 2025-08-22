import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

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

  @Get('auth-status')
  @UseGuards(JwtAuthGuard)
  getAuthStatus(@Request() req) {
    return {
      authenticated: true,
      user: {
        id: req.user.sub,
        email: req.user.email,
        role: req.user.role,
      },
      timestamp: new Date().toISOString(),
      message: 'JWT token is valid',
    };
  }
}
