import { Product } from '@/domain/entities/product';

export interface ProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: number): Promise<Product>;
}
