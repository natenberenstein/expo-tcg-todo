import { IsIn, IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { taskLanes, type TaskLane } from '../todo.types';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(140)
  title!: string;

  @IsIn(taskLanes)
  lane!: TaskLane;
}
