import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  readonly email: string;
  @IsString()
  @MinLength(6, { message: 'password must be at least 6 characters' })
  @IsNotEmpty()
  readonly password: string;
}
