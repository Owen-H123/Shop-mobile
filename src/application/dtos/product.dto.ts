import { Product } from '@/domain/entities/product';

export type ProductDto = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
};

export function productFromDto(dto: ProductDto): Product {
  return {
    id: dto.id,
    title: dto.title,
    price: dto.price,
    description: dto.description,
    category: dto.category,
    image: dto.image,
    rating: dto.rating,
  };
}
