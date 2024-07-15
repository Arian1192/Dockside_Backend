import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Ticket, TicketDocument } from 'src/schemas/ticket.schema';
import { TicketDto } from './dto/tickets.dto';
@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket.name)
    private readonly ticketModel: Model<TicketDocument>,
  ) { }

  async create(ticket: Ticket): Promise<TicketDocument> {
    console.log('Entro al service');
    console.log(ticket);
    return await this.ticketModel.create(ticket);
  }

  async getAll(): Promise<TicketDocument[] | []> {
    return (
      this.ticketModel
        .find()
        .populate([
          {
            path: 'creatorId',
            select: '-password',
            options: { strictPopulate: false },
          },
          // { path: 'department' },
        ])
        // no popular la contraseña
        .populate([{ path: 'agentId', strictPopulate: false }])
        .populate([{ path: 'categoryId', strictPopulate: false }])
        .populate([{ path: 'department', strictPopulate: false }])
        .populate([
          {
            path: 'comments',
            strictPopulate: false,
            populate: { path: 'userId' },
          },
        ])
        .exec()
    );
  }

  async getOneById(_id: string): Promise<TicketDocument | undefined> {
    try {
      const ticket = await this.ticketModel
        .findById(_id)
        .populate([{ path: 'creatorId', strictPopulate: false }])
        .populate([{ path: 'agentId', strictPopulate: false }])
        .populate([{ path: 'categoryId', strictPopulate: false }])
        .populate([
          {
            path: 'comments',
            strictPopulate: false,
            populate: { path: 'userId' },
          },
        ])
        .exec();
      if (!ticket) {
        return undefined;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updateOneById(
    _id: string,
    _ticket: TicketDto,
  ): Promise<TicketDocument | undefined> {
    try {
      const isTicketUpdated = await this.ticketModel
        .findByIdAndUpdate(_id, _ticket, { new: true })
        .populate([{ path: 'creatorId', strictPopulate: false }])
        .populate([{ path: 'agentId', strictPopulate: false }])
        .populate([{ path: 'categoryId', strictPopulate: false }])
        .populate([
          {
            path: 'comments',
            strictPopulate: false,
            populate: { path: 'userId' },
          },
        ])
        .exec();
      if (!isTicketUpdated) {
        return undefined;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteOneById(_id: string): Promise<void> {
    await this.ticketModel.findByIdAndDelete(_id).exec();
  }
}
