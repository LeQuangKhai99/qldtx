import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import {Cache} from 'cache-manager';

@Injectable()
export class CartService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ){}
  async add(createCartDto: CreateCartDto, req, res) {
    const keyUser = 'cart-info-'+req.user.username;
    let carts = await this.cacheManager.get(keyUser);
    if(!carts) {
      carts = {
        products: [
          createCartDto
        ],
        user: req.user
      };
      await this.cacheManager.set(keyUser, carts, {ttl: 60*60*24});
      console.log(carts, createCartDto);
    }
    else {
      console.log(carts, createCartDto);
      
    }
    return 'This action adds a new cart';
  }

  findAll() {
    return `This action returns all cart`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
