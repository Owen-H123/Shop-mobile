import { Product } from '@/domain/entities/product';
import { ProductRepository } from '@/domain/repositories/product-repository';

export class GetProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  execute(): Promise<Product[]> {
    return this.productRepository.getAll();
  }
}
