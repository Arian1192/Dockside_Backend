import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JsonWebTokenModule } from 'src/jwt/jwt.module';

@Module({
  imports: [UsersModule, JsonWebTokenModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
