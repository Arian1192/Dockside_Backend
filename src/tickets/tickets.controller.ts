import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
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
}
