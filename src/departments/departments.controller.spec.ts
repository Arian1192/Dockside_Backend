import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { Response } from 'express';

describe('DepartmentsController', () => {
  let controller: DepartmentsController;
  let service: DepartmentsService;

  const mockDepartment = {
    _id: '60f4e1f1f7c1b4f9e7b7e3b2',
    name: 'Test Department',
    description: 'Test Department Description',
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockDepartment),
    getAll: jest.fn().mockResolvedValue([mockDepartment]),
    getOneById: jest.fn().mockResolvedValue(mockDepartment),
    getOneByName: jest.fn().mockResolvedValue(mockDepartment),
    updateOneById: jest.fn().mockResolvedValue(mockDepartment),
    deleteOneById: jest.fn().mockResolvedValue(null),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepartmentsController],
      providers: [{ provide: DepartmentsService, useValue: mockService }],
    }).compile();

    controller = module.get<DepartmentsController>(DepartmentsController);
    service = module.get<DepartmentsService>(DepartmentsService);
  });
});
//     });
