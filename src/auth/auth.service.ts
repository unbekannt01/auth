/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Auth, UseRole } from './entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly userRepository: Repository<Auth>,
  ) {}

  async registeruser(createUserDto: CreateAuthDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (user) throw new ConflictException('User Already Registered...!');

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: UseRole.USER,
    });

    await this.userRepository.save(newUser);
    return { message: 'User Registered Successfully...!' };
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    // user.loginStatus = true;
    // const payload = { id: user.id, email: user.email };
    await this.userRepository.save(user);

    return {
      message: 'User Login Successfully...!',
      // token: this.jwtService.sign(payload, {
      //   secret: jwtConstants.secret,
      //   expiresIn: '1h',
      // }),
    };
  }

  async validateUser(email: string, password: string): Promise<Auth> {
    const normalizedEmail = email.toLowerCase();
    const user = await this.userRepository.findOne({
      where: { email: normalizedEmail },
    });

    if (!user) {
      throw new NotFoundException('User not found...!');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new BadRequestException('Wrong Credentials...!');
    }

    return user;
  }
}
