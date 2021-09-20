import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryDto } from './category.dto';
import { Category } from './category.entity';
import { CategoryInterface } from './category.interface';
import * as fs from 'fs';
import { CsvParser } from 'nest-csv-parser';
import { resolve } from 'path';

class Entity {
  category: string;
}

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private csvParser: CsvParser,
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

  async importCategoriesFromCsv(fileName: string) {
    try {
      const stream = fs.createReadStream(resolve('./') + '/files/' + fileName);
      const entities = await this.csvParser.parse(stream, Entity, null, null, {
        strict: true,
        separator: ',',
      });

      await Promise.all(
        entities.list.map(async (item) => {
          return await this.createCategory({
            name: item.category,
          } as CategoryDto);
        }),
      );
    } catch (e) {
      Logger.error(e.message, 'import categories');
    }
  }
}
