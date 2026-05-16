import { Module } from '@nestjs/common';

import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';

@Module({
  controllers: [TodosController],
  exports: [TodosService],
  providers: [TodosService],
})
export class TodosModule {}
