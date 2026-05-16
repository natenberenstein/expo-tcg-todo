import { Module } from '@nestjs/common';

import { TodosModule } from '../todos/todos.module';
import { ScansController } from './scans.controller';
import { ScansService } from './scans.service';

@Module({
  controllers: [ScansController],
  imports: [TodosModule],
  providers: [ScansService],
})
export class ScansModule {}
