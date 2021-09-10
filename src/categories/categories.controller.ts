import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, Res, UseFilters, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/guard/authenticated.guard';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { AuthExceptionFilter } from 'src/common/filters/auth-exceptions.filter';
import paginate from 'src/common/paginate';
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
      error: req.flash('error'),
      success: req.flash('success'),
    });
  }

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto, @Req() req, @Res() res) {
    const cate = await this.categoriesService.create(createCategoryDto);
    
    if(cate) {
      req.flash('success', 'Thêm mới loại sản phẩm thành công!');
    }
    else {
      req.flash('error', 'Có lỗi xảy ra vui lòng thử lại sau!');
    }
    res.redirect('/admin/category');
  }

  @Get()
  async findAll(@Req() req, @Res() res) {
    const categories = await this.categoriesService.findAll(req.query.page || 0);
    if(categories.length == 0) {
      res.redirect('/admin/category');
    }
    
    const totalPage = Math.ceil(await this.categoriesService.totalPage()/ (+process.env.PAGE_SIZE));

    res.render('admin/pages/category/index', {
      title: 'List Categories',
      error: req.flash('error'),
      success: req.flash('success'),
      categories,
      paginate: paginate(req.query.page || 0, totalPage)
    });
  }

  @Get('/update/:slug')
  async edit(@Param('slug') slug: string, @Req() req, @Res() res) {
    const cate = await this.categoriesService.findBySlug(slug);
    if(!cate){
      req.flash('error', 'Loại sản phẩm không tồn tại');
      res.redirect('/admin/category');
    }
    res.render('admin/pages/category/edit', {
      title: 'Edit Categories',
      error: req.flash('error'),
      success: req.flash('success'),
      cate
    });
  }

  @Post('/update/:id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @Req() req, @Res() res) {
    const cate = await this.categoriesService.update(+id, updateCategoryDto);
    if(cate) {
      req.flash('success', 'Cập nhật loại sản phẩm thành công!');
    }
    else {
      req.flash('error', 'Có lỗi xảy ra vui lòng thử lại sau!');
    }
    res.redirect('/admin/category/');
  }

  @Get('/delete/:id')
  async remove(@Param('id') id: string, @Req() req, @Res() res) {
    const cate = this.categoriesService.findOne(+id);
    if(cate) {
      req.flash('success', 'Xóa loại sẩn phẩm thành công!')
    }
    else {
      req.flash('error', 'Loại sản phẩm không tồn tại!');
    }
    await this.categoriesService.softRemove(+id);
    res.redirect('/admin/category');
  }

  @Get('trash')
  async trash(@Req() req, @Res() res) {
    const categories = await this.categoriesService.findSoftDelete(req.query.page || 0);
    if(categories.length == 0) {
      res.redirect('/admin/category');
    }
    
    const totalPage = Math.ceil(await this.categoriesService.totalPage()/ (+process.env.PAGE_SIZE));

    res.render('admin/pages/category/trash', {
      title: 'Trash Categories',
      error: req.flash('error'),
      success: req.flash('success'),
      categories,
      paginate: paginate(req.query.page || 0, totalPage)
    });
  }
}
