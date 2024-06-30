import { Body, Controller, Get, Param, Patch, Req, Res } from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
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
  async updateOneById(
    @Param('id') id: string,
    @Body() user: UserDto,
    @Res() _response: Response,
  ): Promise<User | { message: string } | void | null> {
    console.log('user', user);
    try {
      const userUpdated = await this.usersService.updateOneById(id, user);
      console.log('userUpdated', userUpdated);
      if (!userUpdated) {
        _response.status(404).json({ message: 'Not found' });
      } else {
        _response.status(200).json(userUpdated);
        return userUpdated;
      }
    } catch (error) {
      _response.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
