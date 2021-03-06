import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, Res, UseFilters, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthenticatedGuard } from 'src/auth/guard/authenticated.guard';
import { customFileName } from 'src/common/custom-file-name';
import { AuthExceptionFilter } from 'src/common/filters/auth-exceptions.filter';
import paginate from 'src/common/paginate';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { diskStorage } from 'multer';
import { Role } from 'src/roles/enum/role.enum';
import { Roles } from 'src/roles/decorator/roles.decorator';

@UseFilters(AuthExceptionFilter)
@Roles(Role.Admin)
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
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination:'./public/upload/category',
        filename:customFileName
      }),
    })
  )
  async create(@Body() createCategoryDto: CreateCategoryDto, @Req() req, @Res() res, @UploadedFile() file: Express.Multer.File) {
    const cate = await this.categoriesService.create(createCategoryDto, file);
    
    if(cate) {
      req.flash('success', 'Thêm mới loại sản phẩm thành công!');
    }
    else {
      req.flash('error', 'Có lỗi xảy ra vui lòng thử lại sau!');
    }
    return res.redirect('/admin/category');
  }

  @Get()
  async findAll(@Req() req, @Res() res) {
    const categories = await this.categoriesService.findAll(req.query.page || 0);
    const totalPage = Math.ceil(await this.categoriesService.totalPage()/ (+process.env.PAGE_SIZE));

    res.render('admin/pages/category/index', {
      title: 'List Categories',
      error: req.flash('error'),
      success: req.flash('success'),
      categories,
      paginate: paginate(req.query.page || 0, totalPage, '/admin/category'),
    });
  }

  @Get('/update/:slug')
  async edit(@Param('slug') slug: string, @Req() req, @Res() res) {
    const cate = await this.categoriesService.findBySlug(slug);
    if(!cate){
      req.flash('error', 'Loại sản phẩm không tồn tại');
      return res.redirect('/admin/category');
    }
    res.render('admin/pages/category/edit', {
      title: 'Edit Categories',
      error: req.flash('error'),
      success: req.flash('success'),
      cate,
    });
  }

  @Post('/update/:id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination:'./public/upload/category',
        filename:customFileName
      }),
    })
  )
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @Req() req, @Res() res, @UploadedFile() file: Express.Multer.File) {
    const cate = await this.categoriesService.update(+id, updateCategoryDto, file);
    if(cate) {
      req.flash('success', 'Cập nhật loại sản phẩm thành công!');
    }
    else {
      req.flash('error', 'Có lỗi xảy ra vui lòng thử lại sau!');
    }
    return res.redirect('/admin/category/');
  }

  @Get('/softDelete/:id')
  async remove(@Param('id') id: string, @Req() req, @Res() res) {
    const cate = this.categoriesService.findOne(+id);
    if(!cate) {
      req.flash('error', 'Loại sản phẩm không tồn tại!');
    }
    else {
      await this.categoriesService.softRemove(+id);
      req.flash('success', 'Xóa loại sẩn phẩm thành công!');
    }
    return res.redirect('/admin/category');
  }

  @Get('trash')
  async trash(@Req() req, @Res() res) {
    const categories = await this.categoriesService.findSoftDelete(req.query.page || 0);
    const totalPage = Math.ceil(await this.categoriesService.totalPageSoftDelete()/ (+process.env.PAGE_SIZE));

    res.render('admin/pages/category/trash', {
      title: 'Trash Categories',
      error: req.flash('error'),
      success: req.flash('success'),
      categories,
      paginate: paginate(req.query.page || 0, totalPage, '/admin/category/trash'),
    });
  }

  @Get('restore/:id')
  async restore(@Param('id') id: string,@Req() req, @Res() res) {
    const cate = await this.categoriesService.findOneTrash(+id);

    if(!cate) {
      req.flash('error', 'Loại sản phẩm không tồn tại!');
    }
    else {
      req.flash('success', 'Khôi phục loại sẩn phẩm thành công!');
      await this.categoriesService.restore(+id);
    }

    return res.redirect('/admin/category/trash');
  }

  @Get('delete/:id')
  async delete(@Param('id') id: string,@Req() req, @Res() res) {
    req.flash('success', 'Xóa loại sẩn phẩm thành công!');
    await this.categoriesService.remove(+id);
    return res.redirect('/admin/category/trash');
  }
}
