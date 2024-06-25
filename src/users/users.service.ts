import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'schemas/user.schema';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createEmployee(
    name: string,
    email: string,
    pass: string,
    role?: string,
  ): Promise<UserDocument> {
    const newUser = new this.userModel({
      name: name,
      email: email,
      password: pass,
      role: role,
    });
    return newUser.save();
  }

  async getAll(): Promise<UserDocument[]> {
    return this.userModel
      .find({ role: { $in: ['manager', 'support', 'user'] } }) // only return users with these roles
      .select('-password')
      .populate('department')
      .exec();
  }

  async findOneByEmail(
    email: string,
    skipFilterRole = false,
  ): Promise<UserDocument | null> {
    const query: any = { email };

    if (!skipFilterRole) {
      query.role = { $nin: ['admin', 'super_admin'] };
    }

    const userFound = await this.userModel
      .findOne(query)
      .select('-password')
      .populate('department')
      .exec();

    return userFound;
  }

  async findOneById(id: string): Promise<UserDocument | null> {
    return this.userModel
      .findById(id)
      .select('-password')
      .populate('department')
      .exec();
  }
}
