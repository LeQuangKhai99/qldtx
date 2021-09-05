import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, Res, UseFilters, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/guard/authenticated.guard';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { AuthExceptionFilter } from 'src/common/filters/auth-exceptions.filter';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CateExceptionFilter } from './filters/cate-exception.filter';

@UseFilters(AuthExceptionFilter)
@UseGuards(AuthenticatedGuard)
@Controller('')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('add')
  add(@Res() res, @Req() req) {
    res.render('admin/pages/category/add', {
      title: 'Add Category',
      message: req.flash('message')
    });
  }

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const cate = this.categoriesService.create(createCategoryDto);

    console.log(await cate);
    
    return cate;
  }

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto, @Req() Req, @Res() res) {
    const categories = this.categoriesService.findAll(paginationQuery);
    res.render('admin/pages/category/index', {
      title: 'List Categories'
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
