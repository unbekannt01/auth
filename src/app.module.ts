/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'buddy',
      database: 'fullStack',
      autoLoadEntities: true,
      synchronize: true,
    }),

    AuthModule,
  ],
})
export class AppModule {}
