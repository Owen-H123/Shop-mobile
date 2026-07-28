import { productFromDto, ProductDto } from '@/application/dtos/product.dto';
import { Product } from '@/domain/entities/product';
import { ProductRepository } from '@/domain/repositories/product-repository';
import { httpClient } from '@/infrastructure/api/http-client';

export class ProductApiRepository implements ProductRepository {
  async getAll(): Promise<Product[]> {
    const { data } = await httpClient.get<ProductDto[]>('/products');
    return data.map(productFromDto);
  }

  async getById(id: number): Promise<Product> {
    const { data } = await httpClient.get<ProductDto>(`/products/${id}`);
    return productFromDto(data);
  }
}
