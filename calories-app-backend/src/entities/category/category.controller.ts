import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryDto } from './category.dto';
import { CategoryInterface } from './category.interface';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/')
  @HttpCode(200)
  async getCategories(): Promise<CategoryInterface[]> {
    return await this.categoryService.getCategories();
  }

  @Get('/:id')
  @HttpCode(200)
  async getCategory(@Param('id') id: number): Promise<CategoryInterface> {
    return await this.categoryService.getCategoryById(id);
  }

  @Put('/:id')
  @HttpCode(200)
  async updateCategory(
    @Param('id') id: number,
    @Body() categoryDto: CategoryDto,
  ) {
    return await this.categoryService.updateCategory(id, categoryDto);
  }

  @Post('/')
  @HttpCode(200)
  async createCategory(
    @Body() categoryDto: CategoryDto,
  ): Promise<{ id: number }> {
    return await this.categoryService.createCategory(categoryDto);
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteCategory(@Param('id') id: number): Promise<void> {
    return await this.categoryService.deleteCategory(id);
  }
}
