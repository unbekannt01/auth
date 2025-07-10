/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Auth } from './entities/auth.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth]),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
