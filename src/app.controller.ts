import { Controller, Get, Post, UseGuards, Request, UseFilters, Req, Res, Param } from '@nestjs/common';
import { AuthenticatedGuard } from './auth/guard/authenticated.guard';
import { CategoriesService } from './categories/categories.service';
import { Public } from './common/decorators/public.decorator';
import { AuthExceptionFilter } from './common/filters/auth-exceptions.filter';
import paginate from './common/paginate';
import { ProductsService } from './products/products.service';
import { Roles } from './roles/decorator/roles.decorator';
import { Role } from './roles/enum/role.enum';

@UseFilters(AuthExceptionFilter)
@UseGuards(AuthenticatedGuard)
@Controller()
export class AppController {
  private categories = null;
  constructor(
    private readonly categoryService: CategoriesService,
    private readonly productService: ProductsService
  ) {
    this.categories = this.categoryService.getAll();
  }

  @Public()
  @Get()
  async index(@Req() req, @Res() res) {
    const products = await this.productService.findLastest();
    
    res.render('static/index', {
      layout: 'static/layout/main',
      categories: await this.categories,
      products,
      user: req.user,
      error: req.flash('error'),
      success: req.flash('success'),
    });
  }

  @Public()
  @Get('category/:slug')
  async category(@Param('slug') slug: string ,@Req() req, @Res() res) {
    const cate = await this.categoryService.findBySlug(slug);
    
    if(!cate){
      req.flash('error', 'Loại sản phẩm không tồn tại');
      return res.redirect('/');
    }

    const products = await this.productService.findByCate(cate, req.query.page || 0);
    const totalPage = Math.ceil(await this.productService.totalRecordByCate(cate))/(+process.env.PAGE_SIZE);
    if(req.query.page > totalPage){
      return res.redirect('/category/'+cate.slug);
    }
    res.render('static/category', {
      layout: 'static/layout/main',
      categories: await this.categories,
      cate,
      products,
      user: req.user,
      paginate: paginate(req.query.page || 0, totalPage, '/category/'+cate.slug),
      error: req.flash('error'),
      success: req.flash('success'),
    });
  }

  @Public()
  @Get('product/:slug')
  async detail(@Param('slug') slug: string, @Req() req, @Res() res) {
    const product = await this.productService.findBySlug(slug);
    const productRelates = await this.productService.findRelate(product.id, product.category);
    
    if(!product) {
      req.flash('error', 'Sản phẩm không tồn tại');
      return res.redirect('/');
    }
    res.render('static/detail', {
      layout: 'static/layout/main',
      product,
      productRelates,
      user: req.user,
      categories: await this.categories,
      error: req.flash('error'),
      success: req.flash('success'),
    })
  }

  @Roles(Role.Admin)
  @Get('/admin')
  admin(@Req() req, @Res() res) {
    res.render('admin/index', {
      title: 'Dashboard',
      error: req.flash('error'),
      success: req.flash('success'),
      user: req.user
    });
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
