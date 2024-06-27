import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, connect, Model } from 'mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
import { JsonWebTokenModule } from '../jwt/jwt.module';
import { SignUpDto } from 'src/auth/sign-up.dto';
import { Department } from 'src/schemas/department.schema';

describe('UsersController', () => {
  let authController: AuthController;
  let userController: UsersController;
  let departmentController: DepartmentController; // 👈 add this line
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let userModel: Model<User>;
  let mockUser: SignUpDto;
  let mockDepartment: DepartmentDto; // 👈 add this line and create a DepartmentDto

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    userModel = mongoConnection.model('User', UserSchema);
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
      name: 'IT',
      description: 'Information Technology',
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [JsonWebTokenModule],
      providers: [
        UsersService,
        DepartmentService, // 👈 add this line
        AuthService,
        { provide: getModelToken('User'), useValue: userModel },
      ],
      controllers: [UsersController, AuthController, DepartmentController],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    userController = module.get<UsersController>(UsersController);
    departmentController =
      module.get<DepartmentController>(DepartmentController); // 👈 add this line
  });

  afterEach(async () => {
    const collection = mongoConnection.collection('users');
    await collection.deleteMany({});
  });

  describe('createEmployee', () => {
    it('should return an employee', async () => {
      const result = await authController.signUp(mockUser);
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
      await departmentController.createDepartment(mockDepartment);
      await authController.signUp(mockUser);
      const result = await userController.findAll();
      console.log(result);
      expect(result).toBeInstanceOf(Array);
    });
  });
});

//TODO: 4. Create a DepartmentController
//TODO: 5. Create a DepartmentService
//TODO: 6. Create a DepartmentDto
//TODO: 7. Create a Department schema - DONE ✅
//TODO: 8. Create a Department module
