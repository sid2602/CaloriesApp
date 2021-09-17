import { Injectable } from '@nestjs/common';
import { ProductEntity } from './product.entity';
@Injectable()
export class ProductService {
  async getProducts() {
    const products = await ProductEntity.find({});
    return products;
  }
}
