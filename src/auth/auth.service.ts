import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) { }

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.userService.findOneByEmailWithPassword(email);
    console.log(user);

    if (!user) {
      throw new UnauthorizedException('User not found');
    } else {
      console.log(pass, user.password);
      const isPasswordMatch = await bcrypt.compareSync(pass, user.password);
      console.log(isPasswordMatch);
      if (!isPasswordMatch) {
        throw new UnauthorizedException('Password is incorrect');
      }
    }
    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      departments: user.department,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(
    name: string,
    email: string,
    pass: string,
    role?: string,
    departments?: Types.ObjectId[],
  ): Promise<{ access_token: string }> {
    let payload;
    const user = await this.userService.findOneByEmail(email, true);
    if (user) {
      // i don't want to expose the real reason because maybe the attackers want to create a malicious user using super_admin email and role.
      // so i just throw an UnauthorizedException with a generic message like 'Is not allowed to create a user with this email'
      throw new UnauthorizedException(
        'Is not allowed to create a user with this email',
      );
    } else {
      const newUser = await this.userService.createEmployee(
        name,
        email,
        pass,
        role,
        departments,
      );
      payload = {
        sub: newUser._id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
        departments: newUser.department,
      };
    }
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
