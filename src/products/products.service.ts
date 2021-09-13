import { Body, Get, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import convertToSlug from 'src/common/slug';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import validate from './validate/validate-product';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private cateRepository: Repository<Category>
  ){}

  async create(createProductDto: CreateProductDto) {
    const category = await this.cateRepository.findOne(+createProductDto.categoryId);
    if(!category) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Loại sản phẩm không tồn tại!',
        redirect: '/admin/products/add'
      }, HttpStatus.BAD_REQUEST);
    }
    const isValid = await validate(createProductDto, this.productRepository);
    if(isValid === true) {
      createProductDto.slug = convertToSlug(createProductDto.name);
      
      const newCate = await this.productRepository.create({
        ...createProductDto,
        category
      });
      return this.productRepository.save(newCate);
    }
    else {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: isValid,
        redirect: '/admin/products/add'
      }, HttpStatus.BAD_REQUEST);
    }
  }

  async findByName(name: string) {
    return await this.productRepository.findOne({
      name: name
    });
  }

  async findAll(page) {
    return await this.productRepository.find({
      // relations: ['products'],
      skip: page * (+process.env.PAGE_SIZE)  || 0,
      take: (+process.env.PAGE_SIZE) 
    });
  }

  findSoftDelete(page) {
    return this.productRepository.find({
      withDeleted: true,
      where: {
        deleted_at: Not(IsNull())
      },
      skip: page * (+process.env.PAGE_SIZE)  || 0,
      take: (+process.env.PAGE_SIZE),
    });
  }

  totalPage() {
    return this.productRepository.count();
  }

  totalPageSoftDelete() {
    return this.productRepository.findAndCount({
      deleted_at: IsNull()
    });
  }

  async findOne(id: number) {
    return await this.productRepository.findOne({
      where: [{id: id}],
      relations: ['category']
    });
  }

  async findOneTrash(id: number) {
    return await this.productRepository.find({
      withDeleted: true,
      where: {
        id
      }
    });
  }

  findBySlug(slug: string) {
    return this.productRepository.findOne({
      where: [
        {slug: slug}
      ],
      relations: ['category']
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne(id);
    
    if(!product) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: ['Loại sản phẩm không tồn tại!'],
        redirect: `/admin/products`
      }, HttpStatus.NOT_FOUND);
    }
    
    const isValid = await validate(updateProductDto, this.productRepository, id);
    if(isValid === true) {
      updateProductDto.image = updateProductDto.image || product.image;
      updateProductDto.slug = convertToSlug(updateProductDto.name);
      
      const newProduct = await this.productRepository.preload({
        id: +id,
        ...updateProductDto
      });
      
      return this.productRepository.save(newProduct);
    }
    else {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: isValid,
        redirect: `/admin/products/update/${product.slug}`
      }, HttpStatus.BAD_REQUEST);
    }
  }

  softRemove(id: number) {
    return this.productRepository.softDelete(id);
  }

  async restore(id: number) {
    return await this.productRepository.restore(id);
  }

  remove(id: number) {
    return this.productRepository.delete(id);
  }
}
