import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Ticket, TicketDocument } from 'src/schemas/ticket.schema';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket.name)
    private readonly ticketModel: Model<TicketDocument>,
  ) {}

  async create(ticket: Ticket): Promise<TicketDocument> {
    return await this.ticketModel.create(ticket);
  }

  async getAll(): Promise<TicketDocument[] | []> {
    return this.ticketModel
      .find()
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
    ticket: Ticket,
  ): Promise<TicketDocument | undefined> {
    try {
      const isTicketUpdated = await this.ticketModel
        .findByIdAndUpdate(_id, ticket, { new: true })
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
