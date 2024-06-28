import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Department, DepartmentDocument } from 'src/schemas/department.schema';
import { DepartmentsDto } from './departments-dto/departments-dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Department.name)
    private readonly departmentModel: Model<Department>,
  ) {}

  async create({
    name,
    description,
  }: DepartmentsDto): Promise<DepartmentDocument> {
    const newDepartment = new this.departmentModel({
      name,
      description,
    });
    return newDepartment.save();
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

  async deleteOneById(_id: string): Promise<void | null> {
    const departmentDeleted = await this.departmentModel.findById(_id).exec();
    if (!departmentDeleted) {
      return null;
    }
    await this.departmentModel.findByIdAndDelete(_id).exec();
  }
}
