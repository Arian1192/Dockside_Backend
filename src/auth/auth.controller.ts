import { Body, Controller, Post, HttpCode, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './sign-in.dto';
import { SignUpDto } from './sign-up.dto';
import { BcryptPipe } from '../users/pipes/bcrypt.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('login')
  signIn(@Body() _signInDto: SignInDto) {
    console.log(_signInDto);
    if (!_signInDto.email || !_signInDto.password) {
      return {
        statusCode: 400,
        message: 'Bad Request',
        error: 'email and password are required',
      };
    } else {
      return this.authService.signIn(_signInDto.email, _signInDto.password);
    }
  }

  @HttpCode(201)
  @Post('register')
  @UsePipes(BcryptPipe)
  signUp(@Body() _signUpDto: SignUpDto) {
    if (!_signUpDto.email || !_signUpDto.password || !_signUpDto.name) {
      return {
        statusCode: 400,
        message: 'Bad Request',
        error: 'name, email, and password are required',
      };
    } else if (_signUpDto.password.length < 6) {
      return {
        statusCode: 400,
        message: 'Bad Request',
        error: 'password must be at least 6 characters',
      };
    } else if (!_signUpDto.email.includes('@')) {
      return {
        statusCode: 400,
        message: 'Bad Request',
        error: 'email must be a valid email address',
      };
    } else {
      return this.authService.signUp(
        _signUpDto.name,
        _signUpDto.email,
        _signUpDto.password,
        _signUpDto.role,
        _signUpDto.department,
      );
    }
  }
}
