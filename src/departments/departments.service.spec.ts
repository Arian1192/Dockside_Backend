import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentsService } from './departments.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Department } from '../schemas/department.schema';

describe('DepartmentsService', () => {
  let service: DepartmentsService;

  const mockDepartment = {
    _id: '60f4e1f1f7c1b4f9e7b7e3b2',
    name: 'Test Department',
    description: 'Test Department Description',
  };

  const mockDepartmentUpdate = {
    _id: '60f4e1f1f7c1b4f9e7b7e3b2',
    name: 'Test Department Updated',
    description: 'Test Department Description Updated',
  };

  const mockModel = {
    create: jest.fn().mockResolvedValue(mockDepartment),
    find: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([mockDepartment]),
    }),
    findById: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockDepartment),
    }),
    findOne: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockDepartment),
    }),
    findByIdAndUpdate: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockDepartmentUpdate),
    }),
    findByIdAndDelete: jest.fn().mockReturnValue({
      exec: jest.fn().mockReturnThis(),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartmentsService,
        { provide: getModelToken('Department'), useValue: mockModel },
      ],
    }).compile();
    service = module.get<DepartmentsService>(DepartmentsService);
    module.get<Model<Department>>(getModelToken('Department'));
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('DepartmentService Test', () => {
    it('should create a department successfully', async () => {
      const department = await service.create({
        name: 'Test Department',
        description: 'Test Department Description',
      });
      expect(department).toHaveProperty('_id');
    });

    it('should return an array of departments', async () => {
      const departments = await service.getAll();
      expect(departments).toEqual([mockDepartment]);
    });

    it('should return a department by id', async () => {
      const department = await service.getOneById('60f4e1f1f7c1b4f9e7b7e3b2');
      expect(department).toEqual(mockDepartment);
    });

    it('should return a department by name', async () => {
      const department = await service.getOneByName('Test Department');
      expect(department).toEqual(mockDepartment);
    });

    it('should update a department by id', async () => {
      const department = await service.updateOneById(
        '60f4e1f1f7c1b4f9e7b7e3b2',
        {
          name: 'Test Department Updated',
          description: 'Test Department Description Updated',
        },
      );
      expect(department).toEqual(mockDepartmentUpdate);
    });

    it('should delete a department by id', async () => {
      const department = await service.deleteOneById(
        '60f4e1f1f7c1b4f9e7b7e3b2',
      );
      expect(department).toBeNull();
    });
  });
});
