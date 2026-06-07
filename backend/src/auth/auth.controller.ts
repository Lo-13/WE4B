import { Body, Controller, Get, ParseIntPipe, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('logout')
  logout(@Body() loginDto: LoginDto) {
    return this.authService.logout(loginDto);
  }

  @Get('me')
  getCurrentUser(
    @Query('userId', new ParseIntPipe({ optional: true })) userId?: number,
    @Query('email') email?: string,
  ) {
    return this.authService.getCurrentUser(userId, email);
  }
}
