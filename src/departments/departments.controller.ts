import { Body, Controller, Post, Get, Res, Param, Patch } from '@nestjs/common';
import { Response } from 'express';
import { DepartmentsDto } from './departments-dto/departments-dto';
import { DepartmentsService } from './departments.service';
import { Department } from 'src/schemas/department.schema';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  async create(
    @Body() _departmentsDto: DepartmentsDto,
    @Res() _response: Response,
  ): Promise<Department | undefined> {
    try {
      if (_departmentsDto.name !== undefined) {
        const isDepartmentCreated = await this.departmentsService.getOneByName(
          _departmentsDto.name,
        );
        if (isDepartmentCreated) {
          _response.status(409).json({ message: 'Department already exists' });
        } else {
          const departmentCreated =
            await this.departmentsService.create(_departmentsDto);
          _response.status(201).json(departmentCreated);
          return departmentCreated;
        }
      }
    } catch (error) {
      _response.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @Get()
  async getAll(): Promise<Department[] | []> {
    return this.departmentsService.getAll();
  }

  @Get('id/:id')
  async getOneById(
    @Param('id') _id: string,
    @Res() _response: Response,
  ): Promise<Department | null> {
    try {
      const departmentFound = await this.departmentsService.getOneById(_id);
      if (departmentFound === null) {
        _response.status(404).json({ message: 'Not found' });
        return null;
      } else {
        _response.status(200).json(departmentFound);
        return departmentFound;
      }
    } catch (error) {
      _response.status(500).json({ message: 'Internal Server Error' });
      return null;
    }
  }

  @Get('name/:name')
  async getOneByName(
    @Param('name') _name: string,
    @Res() _response: Response,
  ): Promise<Department | undefined> {
    try {
      const departmentFound = await this.departmentsService.getOneByName(_name);
      if (departmentFound === null) {
        _response.status(404).json({ message: 'Not found' });
        return undefined;
      } else {
        _response.status(200).json(departmentFound);
      }
    } catch (error) {
      _response.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @Patch('update/:id')
  async updateOneById(
    @Param('id') _id: string,
    @Body() _departmentsDto: DepartmentsDto,
    @Res() _response: Response,
  ): Promise<Department | { message: string } | null> {
    try {
      const departmentUpdated = await this.departmentsService.updateOneById(
        _id,
        _departmentsDto,
      );
      if (departmentUpdated === null) {
        _response.status(404).json({ message: 'Not found' });
        return null;
      } else {
        _response.status(200).json(departmentUpdated);
        return departmentUpdated;
      }
    } catch (error) {
      _response.status(500).json({ message: 'Internal Server Error' });
      return null;
    }
  }

  @Post('delete/:id')
  async deleteOneById(
    @Param('id') _id: string,
    @Res() _response: Response,
  ): Promise<void> {
    try {
      const departmentDeleted =
        await this.departmentsService.deleteOneById(_id);
      if (departmentDeleted === null) {
        _response.status(404).json({ message: 'Not found' });
        return;
      } else {
        _response.status(200).json('Department deleted successfully');
      }
    } catch (error) {
      _response.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
