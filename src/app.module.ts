/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants/jwt.constant';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = config.get<string>('DATABASE_URL');

        if (!url || typeof url !== 'string') {
          throw new Error('Invalid or missing DATABASE_URL');
        }

        return {
          type: 'postgres',
          url,
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: '1h',
      },
    }),
    AuthModule,
  ],
})
export class AppModule {}
