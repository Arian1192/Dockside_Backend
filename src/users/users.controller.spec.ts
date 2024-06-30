import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, connect, Model, Types } from 'mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { Department, DepartmentSchema } from '../schemas/department.schema'; // Importar el esquema de Department
import { getModelToken } from '@nestjs/mongoose';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
import { JsonWebTokenModule } from '../jwt/jwt.module';
import { SignUpDto } from 'src/auth/sign-up.dto';
import { DepartmentsDto } from '../departments/departments-dto/departments-dto';
import { DepartmentsService } from '../departments/departments.service';
import { DepartmentsController } from '../departments/departments.controller';
import { Response } from 'express';

describe('UsersController', () => {
  let authController: AuthController;
  let userController: UsersController;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let userModel: Model<User>;
  let mockUser: SignUpDto;
  let mockDepartment: DepartmentsDto;
  let department: DepartmentsDto;
  let mockDeparmentService: Partial<DepartmentsService>;
  let departmentsController: DepartmentsController;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    userModel = mongoConnection.model('User', UserSchema);
    mongoConnection.model('Department', DepartmentSchema); // Registrar el modelo de Department
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  beforeEach(async () => {
    mockUser = {
      name: 'Jhon',
      email: 'jhon@email.com',
      password: '1237892',
    };

    mockDepartment = {
      _id: new Types.ObjectId(),
      name: 'IT',
      description: 'Information Technology',
    };

    mockDeparmentService = {
      create: jest.fn().mockResolvedValue(mockDepartment),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [JsonWebTokenModule],
      providers: [
        UsersService,
        AuthService,
        { provide: getModelToken('User'), useValue: userModel },
        { provide: getModelToken('Department'), useValue: {} }, // Proveer el modelo de Department
        { provide: DepartmentsService, useValue: mockDeparmentService },
      ],
      controllers: [UsersController, AuthController, DepartmentsController],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    userController = module.get<UsersController>(UsersController);
    departmentsController = module.get<DepartmentsController>(
      DepartmentsController,
    );
    // departmentModel = module.get<Model<Department>>(
    //   getModelToken('Department'),
    // ); // Obtener el modelo de Department

    // department ? = await departmentsController.create(mockDepartment);
  });

  afterEach(async () => {
    const collection = mongoConnection.collection('users');
    const departmentsCollection = mongoConnection.collection('departments');
    await collection.deleteMany({});
    await departmentsCollection.deleteMany({});
  });

  describe('createEmployee', () => {
    it('should return an employee', async () => {
      const departmentsArray: Types.ObjectId[] = [];
      if (department._id) {
        departmentsArray.push(department._id);
      }
      const payload = { ...mockUser, departments: departmentsArray };
      const result = await authController.signUp(payload);
      expect(result).toBeInstanceOf(Object);
      if ('access_token' in result) {
        const { access_token } = result as { access_token: string };
        expect(access_token).toBeDefined();
      } else {
        throw new Error('Unexpected result format');
      }
    });
  });

  describe('findAll', () => {
    it('should return an array of employees', async () => {
      const departmentsArray: Types.ObjectId[] = [];
      if (department._id) {
        departmentsArray.push(department._id);
      }
      const payload = { ...mockUser, departments: departmentsArray };
      await authController.signUp(payload);
      const result = await userController.findAll();
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
