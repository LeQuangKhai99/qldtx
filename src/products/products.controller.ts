import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, UseFilters, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import paginate from 'src/common/paginate';
import { AuthenticatedGuard } from 'src/auth/guard/authenticated.guard';
import { AuthExceptionFilter } from 'src/common/filters/auth-exceptions.filter';
import { CategoriesService } from 'src/categories/categories.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { customFileName } from 'src/common/custom-file-name';
import { Roles } from 'src/roles/decorator/roles.decorator';
import { Role } from 'src/roles/enum/role.enum';

@UseFilters(AuthExceptionFilter)
@Roles(Role.Admin)
@Controller('')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoryService: CategoriesService
  ) {}

  @Get('add')
  async add(@Res() res, @Req() req) {
    const categories = await this.categoryService.getAll();
    res.render('admin/pages/product/add', {
      title: 'Add Product',
      error: req.flash('error'),
      success: req.flash('success'), 
      categories
    });
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination:'./public/upload/product',
        filename:customFileName
      }),
    })
  )
  async create(@Body() createProductDto: CreateProductDto, @Req() req, @Res() res, @UploadedFile() file: Express.Multer.File) {
    const product = await this.productsService.create(createProductDto, file);
    
    if(product) {
      req.flash('success', 'Thêm mới sản phẩm thành công!');
    }
    else {
      req.flash('error', 'Có lỗi xảy ra vui lòng thử lại sau!');
    }
    return res.redirect('/admin/products');
  }

  @Get()
  async findAll(@Req() req, @Res() res) {
    const products = await this.productsService.findAll(req.query.page || 0);
    
    const totalPage = Math.ceil(await this.productsService.totalPage()/ (+process.env.PAGE_SIZE));

    res.render('admin/pages/product/index', {
      title: 'List Categories',
      error: req.flash('error'),
      success: req.flash('success'),
      products,
      paginate: paginate(req.query.page || 0, totalPage, '/admin/products'),
    });
  }

  @Get('/update/:slug')
  async edit(@Param('slug') slug: string, @Req() req, @Res() res) {
    const product = await this.productsService.findBySlug(slug);

    const categories = await this.categoryService.getAll();
    if(!product){
      req.flash('error', 'Sản phẩm không tồn tại');
      return res.redirect('/admin/product');
    }
    res.render('admin/pages/product/edit', {
      title: 'Edit Products',
      error: req.flash('error'),
      success: req.flash('success'),
      product,
      categories
    });
  }

  @Post('/update/:id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination:'./public/upload/product',
        filename:customFileName
      }),
    })
  )
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @Req() req, @Res() res, @UploadedFile() file: Express.Multer.File) {
    const product = await this.productsService.update(+id, updateProductDto, file);
    if(product) {
      req.flash('success', 'Cập nhật sản phẩm thành công!');
    }
    else {
      req.flash('error', 'Có lỗi xảy ra vui lòng thử lại sau!');
    }
    return res.redirect('/admin/products');
  }

  @Get('/softDelete/:id')
  async remove(@Param('id') id: string, @Req() req, @Res() res) {
    const cate = this.productsService.findOne(+id);
    if(!cate) {
      req.flash('error', 'Loại sản phẩm không tồn tại!');
    }
    else {
      await this.productsService.softRemove(+id);
      req.flash('success', 'Xóa sẩn phẩm thành công!');
    }
    return res.redirect('/admin/products');
  }

  @Get('trash')
  async trash(@Req() req, @Res() res) {
    const products = await this.productsService.findSoftDelete(req.query.page || 0);
    const totalPage = Math.ceil(await this.productsService.totalPageSoftDelete()/ (+process.env.PAGE_SIZE));

    res.render('admin/pages/product/trash', {
      title: 'Trash Categories',
      error: req.flash('error'),
      success: req.flash('success'),
      products,
      paginate: paginate(req.query.page || 0, totalPage, '/admin/products/trash'),
    });
  }

  @Get('restore/:id')
  async restore(@Param('id') id: string,@Req() req, @Res() res) {
    const cate = await this.productsService.findOneTrash(+id);

    if(!cate) {
      req.flash('error', 'Loại sản phẩm không tồn tại!');
    }
    else {
      req.flash('success', 'Khôi phục sẩn phẩm thành công!');
      await this.productsService.restore(+id);
    }

    return res.redirect('/admin/products/trash');
  }

  @Get('delete/:id')
  async delete(@Param('id') id: string,@Req() req, @Res() res) {
    req.flash('success', 'Xóa sẩn phẩm thành công!');
    await this.productsService.remove(+id);
    return res.redirect('/admin/products/trash');
  }
}
