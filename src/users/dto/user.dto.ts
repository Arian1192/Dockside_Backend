import { IsEmail, IsString, MinLength, IsEnum, IsArray } from 'class-validator';
import { ROLE } from '../../schemas/user.schema';
import { Types } from 'mongoose';

export class UserDto {
  @IsEmail()
  @IsString()
  readonly email?: string;
  @IsString()
  @MinLength(6, { message: 'password must be at least 6 characters' })
  readonly password?: string;
  @IsString()
  readonly name?: string;
  @IsString()
  @IsEnum(ROLE, { message: 'role must be a valid role' })
  readonly role?: string;
  @IsArray()
  department?: string[] | Types.ObjectId[];
}
