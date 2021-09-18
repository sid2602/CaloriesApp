import { Injectable } from '@nestjs/common';
import { Product } from './product.entity';
@Injectable()
export class ProductService {
  async getProducts() {
    const products = await Product.find({});
    return products;
  }
}
