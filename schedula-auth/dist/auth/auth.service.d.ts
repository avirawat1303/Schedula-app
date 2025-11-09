import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class AuthService {
    private readonly userRepo;
    private readonly jwtService;
    constructor(userRepo: Repository<User>, jwtService: JwtService);
    signup(dto: SignupDto): Promise<{
        message: string;
        user: {
            email: string;
            role: string;
        };
    }>;
    signin(dto: SigninDto): Promise<{
        access_token: string;
        role: string;
    }>;
    googleLogin(req: any): Promise<"No user from Google" | {
        message: string;
        access_token: string;
    }>;
}
