import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    googleAuth(): Promise<void>;
    googleAuthRedirect(req: any): Promise<"No user from Google" | {
        message: string;
        access_token: string;
    }>;
    signout(): {
        message: string;
    };
}
