import { BadRequestException, HttpException, HttpStatus, Injectable, Req, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import convertToSlug from 'src/common/slug';
import { getRepository, IsNull, Not, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import validate from './validate/validate-category';
import * as fs from 'fs';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private cateRepository: Repository<Category>
  ){}

  async create(createCategoryDto: CreateCategoryDto, file: Express.Multer.File) {
    
    const isValid = await validate(createCategoryDto, this.cateRepository, file);
    if(isValid === true) {
      const arr =  file.path.split('/');
      arr.splice(0, 1);
      const newCate = await this.cateRepository.create({
        ...createCategoryDto,
        slug: convertToSlug(createCategoryDto.name),
        image: arr.join('/')
      });
      return this.cateRepository.save(newCate);
    }
    else {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: isValid,
        redirect: '/admin/category/add'
      }, HttpStatus.BAD_REQUEST);
    }
  }

  async findByName(name: string) {
    const cate = await this.cateRepository.findOne({
      name: name
    });
  }

  async findAll(page) {
    return await this.cateRepository.find({
      order: {
        'id': 'DESC'
      },
      skip: page * (+process.env.PAGE_SIZE)  || 0,
      take: (+process.env.PAGE_SIZE) 
    });
  }

  async getAll() {
    return await this.cateRepository.find();
  }

  findSoftDelete(page) {
    return this.cateRepository.find({
      withDeleted: true,
      order: {
        'id': 'DESC'
      },
      where: {
        deleted_at: Not(IsNull())
      },
      skip: page * (+process.env.PAGE_SIZE)  || 0,
      take: (+process.env.PAGE_SIZE),
    });
  }

  totalPage() {
    return this.cateRepository.count();
  }

  totalPageSoftDelete() {
    return this.cateRepository.findAndCount({
      deleted_at: IsNull()
    });
  }

  async findOne(id: number) {
    return await this.cateRepository.findOne(id);
  }

  async findOneTrash(id: number) {
    return await this.cateRepository.findOne({
      withDeleted: true,
      where: {
        id
      }
    });
  }

  findBySlug(slug: string) {
    return this.cateRepository.findOne({
      slug: slug
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto, file: Express.Multer.File) {
    const cate = await this.cateRepository.findOne(id);
    
    if(!cate) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: ['Loại sản phẩm không tồn tại!'],
        redirect: `/admin/category`
      }, HttpStatus.NOT_FOUND);
    }
    const isValid = await validate(updateCategoryDto, this.cateRepository, file, id);
    
    if(isValid === true) {
      let path = '';
      if(file) {
        const arr =  file.path?.split('/');
        arr.splice(0, 1);
        path = arr.join('/');
        fs.unlinkSync('./public/'+cate.image);
      }
      else {
        path = cate.image;
      }
      updateCategoryDto.slug = convertToSlug(updateCategoryDto.name);
      const newCate = await this.cateRepository.preload({
        id: +id,
        ...updateCategoryDto,
        image: path
      });
      
      return this.cateRepository.save(newCate);
    }
    else {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: isValid,
        redirect: `/admin/category/update/${cate.slug}`
      }, HttpStatus.BAD_REQUEST);
    }
  }

  softRemove(id: number) {
    return this.cateRepository.softDelete(id);
  }

  async restore(id: number) {
    return await this.cateRepository.restore(id);
  }

  async remove(id: number) {
    const cate = await this.findOneTrash(+id);

    if(!cate) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Loại sản phẩm không tồn tại!',
        redirect: `/admin/category`
      }, HttpStatus.BAD_REQUEST);
    }
    else {
      fs.unlinkSync('./public/'+cate.image);
    }
    return await this.cateRepository.delete(id);
  }
}
