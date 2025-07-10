/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 3, ttl: 1800000 } }) // 30 Minute ( 3-time )
  @Post('register')
  async register(@Body() createuserDto: CreateAuthDto) {
    return await this.authService.registeruser(createuserDto);
  }

  @Throttle({ default: { limit: 2, ttl: 60000 } }) // 1 Minute ( 2-time )
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto.email, loginDto.password);
  }

  @Get('profile')
  async profile() {
    return await this.authService.getAllUserData();
  }
}
