import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const existingUser = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = this.userRepo.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: dto.role || 'patient',
    });

    await this.userRepo.save(newUser);

    return { message: 'User registered successfully', user: { email: newUser.email, role: newUser.role } };
  }

  async signin(dto: SigninDto) {

    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { access_token: token, role: user.role };
  }

  async googleLogin(req: any) {
    if (!req.user) return 'No user from Google';

    const { email, name } = req.user;
    let user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      // Auto-register Google user if not found
      user = this.userRepo.create({
        name,
        email,
        password: '', // Google users don’t need password
        role: 'patient',
      });
      await this.userRepo.save(user);
    }

    const token = this.jwtService.sign({ id: user.id, email: user.email, role: user.role });
    return { message: 'Google login successful', access_token: token };
  }
}
