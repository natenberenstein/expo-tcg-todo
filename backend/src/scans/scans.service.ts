import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { TodosService } from '../todos/todos.service';
import { type Todo } from '../todos/todo.types';
import { CreateScanDto } from './dto/create-scan.dto';

type CardScan = {
  id: string;
  imageUri?: string;
  notes?: string;
  status: 'captured';
  todoId: string;
  createdAt: string;
};

@Injectable()
export class ScansService {
  private readonly logger = new Logger(ScansService.name);
  private scans: CardScan[] = [];

  constructor(private readonly todosService: TodosService) {}

  findAll() {
    this.logger.log(`Listed ${this.scans.length} scans`);

    return {
      data: this.scans,
      meta: {
        total: this.scans.length,
      },
    };
  }

  create(dto: CreateScanDto): { scan: CardScan; todo: Todo } {
    const title = dto.notes?.trim()
      ? `Review card scan: ${dto.notes.trim()}`
      : 'Review captured card scan';
    const todo = this.todosService.create({ lane: 'scan', title });
    const scan: CardScan = {
      id: randomUUID(),
      imageUri: dto.imageUri,
      notes: dto.notes?.trim(),
      status: 'captured',
      todoId: todo.id,
      createdAt: new Date().toISOString(),
    };

    this.scans = [scan, ...this.scans];
    this.logger.log(
      `Captured scan id=${scan.id} todoId=${todo.id} hasImage=${Boolean(scan.imageUri)}`,
    );

    return { scan, todo };
  }
}
