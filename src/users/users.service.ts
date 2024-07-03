import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { UserDto } from './dto/user.dto';
import { Department } from '../schemas/department.schema';
import { type } from 'os';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Department.name)
    private readonly departmentModel: Model<Department>,
  ) { }

  async createEmployee(
    name: string,
    email: string,
    pass: string,
    role?: string,
    departments?: Types.ObjectId[],
  ): Promise<UserDocument> {
    const newUser = new this.userModel({
      name,
      email,
      password: pass,
      role: role || 'user',
      departments: departments || [],
    });
    return newUser.save();
  }

  async getAll(): Promise<UserDocument[]> {
    return this.userModel
      .find({ role: { $in: ['manager', 'support', 'user'] } }) // only return users with these roles
      .select('-password')
      .populate('departments')
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
      .populate('departments')
      .exec();

    return userFound;
  }

  async findOneById(id: Types.ObjectId): Promise<UserDocument | null> {
    return this.userModel
      .findById(id)
      .select('-password')
      .populate('departments')
      .exec();
  }

  async updateOneById(
    _id: string,
    user: UserDto,
  ): Promise<User | { message: string } | void | null> {
    console.log('Paso por aqui');
    console.log(user);
    const isUserFound = await this.userModel.findById(_id).exec();
    if (!isUserFound) {
      return { message: 'Not found' };
    } else {
      // como se ha encontrado el usuario se procede primero a comprobar si se ha enviaddo un nuevo departamento.
      if (user.department) {
        // comprobamos el tipo de dato que se ha enviado en el array
        for (let department of user.department) {
          if (typeof department === 'string') {
            // si es un string se procede a convertirlo en un ObjectId
            const departmentId = new Types.ObjectId(department);
            // se comprueba si el departamento existe
            const departmentFound = await this.departmentModel
              .findById(departmentId)
              .exec();
            // si el departamento no existe se retorna un mensaje de error
            if (!departmentFound) {
              return { message: 'Department not found' };
            } else {
              // si el departamento existe se procede a substituir el string por el ObjectId
              department = departmentId;
            }
          }
        }
      }
      // cuando se ha comprobado que todos los departamentos existen se procede a actualizar el usuario
      const userUpdated = await this.userModel
        .findByIdAndUpdate(_id, user, { new: true })
        .populate('department')
        .exec();
      return userUpdated;
    }
  }
}
