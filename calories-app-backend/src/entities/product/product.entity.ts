import { PrimaryGeneratedColumn, Entity, Column, BaseEntity } from 'typeorm';

@Entity()
export class ProductEntity extends BaseEntity {
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

  @Column()
  category: string;

  @Column()
  portionName: string;

  @Column()
  portionWage: number;
}
