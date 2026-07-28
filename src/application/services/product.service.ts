import { GetProductByIdUseCase } from '@/domain/usecases/get-product-by-id.usecase';
import { GetProductsUseCase } from '@/domain/usecases/get-products.usecase';
import { ProductApiRepository } from '@/infrastructure/repositories/product-api.repository';

const productRepository = new ProductApiRepository();
const getProductsUseCase = new GetProductsUseCase(productRepository);
const getProductByIdUseCase = new GetProductByIdUseCase(productRepository);

export const productService = {
  getProducts: () => getProductsUseCase.execute(),
  getProductById: (id: number) => getProductByIdUseCase.execute(id),
};
