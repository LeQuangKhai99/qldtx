import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CategoriesModule } from 'src/categories/categories.module';
import { ProductsModule } from 'src/products/products.module';
import { UsersModule } from 'src/users/users.module';
@Module({
  imports: [
    RouterModule.register([
      {
        path: 'admin',
        module: AdminModule,
        children: [
          {
            path: 'users',
            module: UsersModule,
          },
          {
            path: 'products',
            module: ProductsModule,
          },
          {
            path: 'category',
            module: CategoriesModule,
          },
        ],
      },
    ]),
  ]
})
export class AdminModule {}
