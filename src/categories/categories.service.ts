import { BadRequestException, HttpException, HttpStatus, Injectable, Req, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import convertToSlug from 'src/common/slug';
import { getRepository, IsNull, Not, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import validate from './validate/validate-category';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private cateRepository: Repository<Category>
  ){}

  async create(createCategoryDto: CreateCategoryDto) {
    const {name} = createCategoryDto;
    
    if(await validate(name, this.cateRepository) === true) {
      const cateDTO = {
        name: createCategoryDto.name,
        slug: convertToSlug(createCategoryDto.name)
      }
      
      const newCate = await this.cateRepository.create(cateDTO);
      return this.cateRepository.save(newCate);
    }
    else {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: await validate(name, this.cateRepository),
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
      // relations: ['products'],
      skip: page * (+process.env.PAGE_SIZE)  || 0,
      take: (+process.env.PAGE_SIZE) 
    });
  }

  findSoftDelete(page) {
    return this.cateRepository.find({
      withDeleted: true,
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
    return await this.cateRepository.find({
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

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const {name} = updateCategoryDto;
    const cate = await this.cateRepository.findOne(id);
    
    if(!cate) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: ['Loại sản phẩm không tồn tại!'],
        redirect: `/admin/category`
      }, HttpStatus.NOT_FOUND);
    }
    if(await validate(name, this.cateRepository, id) === true) {
      const cateDTO = {
        id: +id,
        name: updateCategoryDto.name,
        slug: convertToSlug(updateCategoryDto.name)
      }
      
      const newCate = await this.cateRepository.preload(cateDTO);
      
      return this.cateRepository.save(newCate);
    }
    else {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: await validate(name, this.cateRepository),
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

  remove(id: number) {
    return this.cateRepository.delete(id);
  }
}
