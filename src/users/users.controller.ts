import { Controller, Get, Req, Res } from '@nestjs/common';
import { User } from 'schemas/user.schema';
import { UsersService } from './users.service';
import { Request, Response } from 'express';

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
    const user = await this.usersService.findOneById(id);

    if (!user) {
      response.status(404).json({ message: 'Not found' });
      return;
    }

    response.status(200).json(user);
    return user;
  }

  @Get('email/:email')
  findOneByEmail(@Req() _request: Request): Promise<User | null> {
    const { email } = _request.params;
    return this.usersService.findOneByEmail(email);
  }
}
