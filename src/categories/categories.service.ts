import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { getRepository, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private cateRepository: Repository<Category>
  ){}

  async create(createCategoryDto: CreateCategoryDto) {
    const {name} = createCategoryDto;

    //check unique 
    const cate = await this.cateRepository.findOne({
      name: name
    });

    const newCate = await this.cateRepository.create(createCategoryDto);
    return this.cateRepository.save(newCate);
  }

  async findByName(name: string) {
    const cate = await this.cateRepository.findOne({
      name: name
    });
  
    
  }

  findAll(paginationQuery: PaginationQueryDto) {
    const {limit, offset} = paginationQuery;
    return this.cateRepository.find({
      // relations: ['products'],
      skip: offset || 0,
      take: limit || 10
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
