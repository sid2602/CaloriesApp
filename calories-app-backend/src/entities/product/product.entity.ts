import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  BaseEntity,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from '../category/category.entity';

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  calories: number;

  @Column()
  caloriesunit: string;

  @Column()
  weight: number;

  @Column()
  weightUnit: string;

  @OneToOne(() => Category)
  @JoinColumn()
  category: string;

  @Column()
  portionName: string;

  @Column()
  portionWage: number;
}
