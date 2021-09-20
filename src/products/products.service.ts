import { Body, Get, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import convertToSlug from 'src/common/slug';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import validate from './validate/validate-product';
import * as fs from 'fs';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private cateRepository: Repository<Category>
  ){}

  async create(createProductDto: CreateProductDto, file: Express.Multer.File) {
    const category = await this.cateRepository.findOne(+createProductDto.categoryId);
    if(!category) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Loại sản phẩm không tồn tại!',
        redirect: '/admin/products/add'
      }, HttpStatus.BAD_REQUEST);
    }
    const isValid = await validate(createProductDto, this.productRepository, file);
    if(isValid === true) {
      const arr =  file.path.split('/');
      arr.splice(0, 1);
      createProductDto.slug = convertToSlug(createProductDto.name);
      
      const newCate = await this.productRepository.create({
        ...createProductDto,
        image: arr.join('/'),
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
      relations: ['category'],
      order: {
        'id': 'DESC'
      },
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
      order: {
        'id': 'DESC'
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
    return await this.productRepository.findOne({
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

  async update(id: number, updateProductDto: UpdateProductDto, file: Express.Multer.File) {
    const product = await this.productRepository.findOne(id);
    
    if(!product) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: ['Sản phẩm không tồn tại!'],
        redirect: `/admin/products`
      }, HttpStatus.NOT_FOUND);
    }

    const category = await this.cateRepository.findOne(+updateProductDto.categoryId);
    if(!category) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Loại sản phẩm không tồn tại!',
        redirect: `/admin/products/update/${product.slug}`
      }, HttpStatus.BAD_REQUEST);
    }
    
    const isValid = await validate(updateProductDto, this.productRepository, file,  id);
    if(isValid === true) {
      let path = '';
      if(file) {
        const arr =  file.path?.split('/');
        arr.splice(0, 1);
        path = arr.join('/');
        fs.unlinkSync('./public/'+product.image);
      }
      else {
        path = product.image;
      }
      
      updateProductDto.slug = convertToSlug(updateProductDto.name);
      
      const newProduct = await this.productRepository.preload({
        id: +id,
        ...updateProductDto,
        image: path,
        category
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

  async remove(id: number) {
    const product = await this.findOneTrash(+id);

    if(!product) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Sản phẩm không tồn tại!',
        redirect: `/admin/products`
      }, HttpStatus.BAD_REQUEST);
    }
    else {
      fs.unlinkSync('./public/'+product.image);
    }
    return await this.productRepository.delete(id);
  }
}
