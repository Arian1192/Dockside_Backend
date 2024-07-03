import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Department, DepartmentDocument } from '../schemas/department.schema';
import { DepartmentsDto } from './departments-dto/departments-dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Department.name)
    private readonly departmentModel: Model<DepartmentDocument>,
  ) {}

  async create({
    name,
    description,
  }: DepartmentsDto): Promise<DepartmentDocument> {
    return this.departmentModel.create({ name, description });
  }

  async getAll(): Promise<DepartmentDocument[] | []> {
    return this.departmentModel.find().exec();
  }

  async getOneById(_id: string): Promise<DepartmentDocument | null> {
    const department = await this.departmentModel.findById(_id).exec();
    if (!department) {
      return null;
    } else {
      return department;
    }
  }

  async getOneByName(name: string): Promise<DepartmentDocument | null> {
    const department = await this.departmentModel.findOne({ name }).exec();
    if (!department) {
      return null;
    } else {
      return department;
    }
  }

  async updateOneById(
    _id: string,
    { name, description }: DepartmentsDto,
  ): Promise<DepartmentDocument | null> {
    const departmentUpdated = await this.departmentModel
      .findByIdAndUpdate(
        _id,
        {
          name,
          description,
        },
        { new: true },
      )
      .exec();
    if (!departmentUpdated) {
      return null;
    } else {
      return departmentUpdated;
    }
  }

  async deleteOneById(_id: string): Promise<null> {
    await this.departmentModel.findByIdAndDelete(_id).exec();
    return null;
  }
}
