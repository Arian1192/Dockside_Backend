import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { UserDto } from './dto/user.dto';
import { BcryptPipe } from './pipes/bcrypt.pipe';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


  @Get()
  findAll(): Promise<User[] | []> {
    return this.usersService.getAll();
  }

  @Get('id/:id')
  async findOne(
    @Req() _request: Request,
    @Res() response: Response,
  ): Promise<User | void> {
    const { id } = _request.params;
    const idConverted = new Types.ObjectId(id);
    const user = await this.usersService.findOneById(idConverted);

    if (!user) {
      response.status(404).json({ message: 'Not found' });
      return;
    }

    response.status(200).json(user);
    return user;
  }

  @Get('email/:email')
  async findOneByEmail(@Req() _request: Request): Promise<User | null> {
    const { email } = _request.params;
    return this.usersService.findOneByEmail(email);
  }

  @Patch('update/:id')
  @UsePipes(BcryptPipe) // Use the pipe to hash the password
  async updateOneById(
    @Param('id') id: string,
    @Body() user: UserDto,
    @Res() _response: Response,
  ): Promise<User | { message: string } | void | null> {
    try {
      const userUpdated = await this.usersService.updateOneById(id, user);
      if (!userUpdated) {
        _response.status(404).json({ message: 'Not found' });
      } else {
        _response.status(200).json(userUpdated);
        return userUpdated;
      }
    } catch (error) {
      console.error('Error updating user:', error);
      _response.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @Delete('delete/:id')
  async deleteOneBydId(
    @Param('id') id: string,
    @Res() _response: Response,
  ): Promise<{ message: string } | void> {
    try {
      const userDeleted = await this.usersService.deleteOneById(id);
      if (!userDeleted) {
        _response.status(404).json({ message: 'Not found' });
        return;
      } else {
        _response.status(200).json({ message: 'User deleted' });
      }
    } catch (error) {
      _response.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
