import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketDto } from './dto/tickets.dto';
import { Ticket } from 'src/schemas/ticket.schema';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketService: TicketsService) {}

  @Post()
  async create(@Body() ticketDto: TicketDto): Promise<Ticket> {
    try {
      const ticketCreated = await this.ticketService.create(ticketDto);
      return ticketCreated;
    } catch (error) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async getAll(): Promise<Ticket[] | []> {
    try {
      const listOfTicketsCreated = await this.ticketService.getAll();
      return listOfTicketsCreated;
    } catch (error) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('id/:id')
  async getOneById(@Param('id') _id: string): Promise<Ticket | undefined> {
    try {
      const ticket = await this.ticketService.getOneById(_id);
      return ticket;
    } catch (error) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('update/id/:id')
  async updateOneById(
    @Param('id') _id: string,
    @Body() _ticket: TicketDto,
  ): Promise<Ticket | undefined> {
    try {
      const ticketUpdated = await this.ticketService.updateOneById(
        _id,
        _ticket,
      );
      return ticketUpdated;
    } catch (error) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('delete/id/:id')
  async deleteOneById(@Param('id') _id: string): Promise<void> {
    try {
      await this.ticketService.deleteOneById(_id);
    } catch (error) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
