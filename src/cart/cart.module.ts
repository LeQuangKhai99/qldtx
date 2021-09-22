import { CacheModule, Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: "redis",
      port: 6379
    }),
  ],
  controllers: [CartController],
  providers: [CartService]
})
export class CartModule {}
