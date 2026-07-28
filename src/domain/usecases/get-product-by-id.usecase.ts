import { Product } from '@/domain/entities/product';
import { ProductRepository } from '@/domain/repositories/product-repository';

export class GetProductByIdUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  execute(id: number): Promise<Product> {
    return this.productRepository.getById(id);
  }
}
