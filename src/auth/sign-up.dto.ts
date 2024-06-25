import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { ROLE } from 'schemas/user.schema';

export class SignUpDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  readonly email: string;
  @IsString()
  @MinLength(6, { message: 'password must be at least 6 characters' })
  @IsNotEmpty()
  readonly password: string;
  @IsString()
  @IsNotEmpty()
  readonly name: string;
  @IsString()
  @IsEnum(ROLE, { message: 'role must be a valid role' })
  readonly role?: string;
}
