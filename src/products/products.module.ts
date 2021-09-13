import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from 'src/categories/entities/category.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { ProductExistsRule } from './validate/product-exist-rule';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category])
  ],
  controllers: [ProductsController,],
  providers: [ProductExistsRule ,ProductsService, CategoriesService],
  exports: [ProductsService]
})
export class ProductsModule {}
