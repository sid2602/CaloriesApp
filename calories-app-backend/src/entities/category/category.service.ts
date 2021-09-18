import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryDto } from './category.dto';
import { Category } from './category.entity';
import { CategoryInterface } from './category.interface';
@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getCategories(): Promise<CategoryInterface[]> {
    return await this.categoryRepository.find({});
  }

  async getCategoryById(id: number): Promise<CategoryInterface> {
    return await this.categoryRepository.findOne({ id });
  }

  async updateCategory(
    id: number,
    categoryDto: CategoryDto,
  ): Promise<CategoryInterface> {
    const category = await this.categoryRepository.findOne(id);
    return this.categoryRepository.save({ ...category, ...categoryDto });
  }

  async createCategory(categoryDto: CategoryDto): Promise<{ id: number }> {
    const category = await this.categoryRepository.save(categoryDto);
    return { id: category.id };
  }

  async deleteCategory(id: number): Promise<void> {
    await this.categoryRepository.delete({ id });
  }
}
